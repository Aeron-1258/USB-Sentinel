# install_service.ps1
# Fixed version: Installs backend as auto-start background monitor.
# Works both as Windows Service (requires Admin + NSSM) and as Scheduled Task (works without Admin).

$ErrorActionPreference = "Stop"

$IsAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

$ServiceName = "USBEnterpriseMonitor"
$ServiceDisplayName = "USB Endpoint Security Monitor"
$ServiceDescription = "Continuously monitors physical PnP USB hardware events for the USB Device Control Framework."
$TaskName = "USB-Sentinel-Backend"
$NodePath = (Get-Command node.exe -ErrorAction SilentlyContinue).Source
$AppPath = Join-Path $PSScriptRoot "server.js"
$LogFile = Join-Path $PSScriptRoot "service.log"

if (!$NodePath) {
    Write-Error "Node.js is not installed or not in the system PATH."
    exit 1
}
if (!(Test-Path $AppPath)) {
    Write-Error "server.js not found at $AppPath"
    exit 1
}

Write-Host "Node: $NodePath"
Write-Host "App : $AppPath"
Write-Host "Admin mode: $IsAdmin"

# 1. Create hidden wrapper that actually keeps node alive + logs output
$wrapperPath = Join-Path $PSScriptRoot "service_wrapper.ps1"
$wrapperContent = @"
`$ErrorActionPreference = 'SilentlyContinue'
`$logFile = '$LogFile'
function Write-Log(`$msg) { Add-Content -Path `$logFile -Value "`$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') `$msg" }
Write-Log "[Wrapper] Starting USB-Sentinel backend..."
# Kill any stale node holding port 3001 before start
try { Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id `$_.OwningProcess -Force -ErrorAction SilentlyContinue } } catch {}
# Start node and keep wrapper alive; restart if node crashes
while (`$true) {
    Write-Log "[Wrapper] Launching node $AppPath"
    # FIX: Removed extra quotes around AppPath and removed RedirectStandardOutput (caused file-lock and PID empty)
    `$proc = Start-Process -FilePath '$NodePath' -ArgumentList '$AppPath' -WorkingDirectory '$PSScriptRoot' -WindowStyle Hidden -PassThru
    if (`$proc) {
        Write-Log "[Wrapper] Node PID `$(`$proc.Id) started"
        `$proc.WaitForExit()
        Write-Log "[Wrapper] Node exited with code `$(`$proc.ExitCode). Restarting in 3s..."
    } else {
        Write-Log "[Wrapper] Failed to start node. Retrying in 3s..."
    }
    Start-Sleep -Seconds 3
}
"@
Set-Content -Path $wrapperPath -Value $wrapperContent -Encoding UTF8
Write-Host "Created wrapper: $wrapperPath"

# 2. Create auto-start so backend runs when you plug USB (no manual python app.py needed)
if ($IsAdmin) {
    # Admin: Scheduled Task with SYSTEM (runs even before login, survives reboot)
    try {
        Write-Host "Creating Scheduled Task (Admin SYSTEM): $TaskName ..."
        Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
        $powershellExe = (Get-Command powershell.exe).Source
        $action = New-ScheduledTaskAction -Execute $powershellExe -Argument "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$wrapperPath`""
        $triggers = @(
            (New-ScheduledTaskTrigger -AtLogOn),
            (New-ScheduledTaskTrigger -AtStartup)
        )
        $principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
        $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1) -ExecutionTimeLimit 0 -Hidden
        $task = New-ScheduledTask -Action $action -Trigger $triggers -Principal $principal -Settings $settings -Description $ServiceDescription
        Register-ScheduledTask -TaskName $TaskName -InputObject $task -Force -ErrorAction Stop | Out-Null
        Write-Host "Scheduled Task '$TaskName' registered (SYSTEM)."
        Start-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
        Write-Host "Scheduled Task started."
    } catch {
        Write-Warning "Scheduled Task (SYSTEM) failed: $($_.Exception.Message)"
    }
} else {
    # Non-Admin: Use Startup folder + Registry Run (no admin rights needed)
    Write-Host "Non-Admin: Creating Startup auto-launch (no admin needed)..."
    try {
        $startupFolder = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs\Startup"
        $startupShortcut = Join-Path $startupFolder "USB-Sentinel-Backend.lnk"
        $powershellExe = (Get-Command powershell.exe).Source
        # Create .cmd launcher in backend folder
        $launcherCmd = Join-Path $PSScriptRoot "start_hidden.cmd"
        Set-Content -Path $launcherCmd -Value "@echo off`r`nstart /min powershell -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$wrapperPath`"" -Encoding ASCII
        # Create shortcut via WScript
        $wsh = New-Object -ComObject WScript.Shell
        $shortcut = $wsh.CreateShortcut($startupShortcut)
        $shortcut.TargetPath = $launcherCmd
        $shortcut.WorkingDirectory = $PSScriptRoot
        $shortcut.WindowStyle = 7
        $shortcut.Description = $ServiceDescription
        $shortcut.Save()
        Write-Host "Created Startup shortcut: $startupShortcut"

        # Also add Registry Run key for current user (HKCU - no admin)
        $regPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run"
        $regValue = "powershell -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$wrapperPath`""
        Set-ItemProperty -Path $regPath -Name "USB-Sentinel-Backend" -Value $regValue -ErrorAction SilentlyContinue
        Write-Host "Added Registry Run: HKCU...Run -> USB-Sentinel-Backend"

        # Start now in background (hidden)
        Write-Host "Starting backend now in background..."
        Start-Process -FilePath $powershellExe -ArgumentList "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$wrapperPath`"" -WindowStyle Hidden
        Start-Sleep 2
        Write-Host "Backend launched hidden. Check http://localhost:3001/api/devices in 3 seconds."
    } catch {
        Write-Warning "Startup auto-launch failed: $($_.Exception.Message)"
        # Fallback: just start now
        try { Start-Process -FilePath $powershellExe -ArgumentList "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$wrapperPath`"" -WindowStyle Hidden } catch {}
    }
}

# 3. If Admin, also try to install as Windows Service (for enterprise 24/7 even with no user logged in)
if ($IsAdmin) {
    Write-Host "Installing Windows Service: $ServiceName"
    $nssmPath = (Get-Command nssm -ErrorAction SilentlyContinue).Source
    # Try to auto-download NSSM if not found (optional)
    if (-not $nssmPath) {
        Write-Host "NSSM not found. Trying to use native service wrapper..."
    }
    if ($nssmPath) {
        Write-Host "NSSM detected. Configuring robust service..."
        try { & $nssmPath stop $ServiceName 2>$null } catch {}
        try { & $nssmPath remove $ServiceName confirm 2>$null } catch {}
        & $nssmPath install $ServiceName $NodePath $AppPath
        & $nssmPath set $ServiceName Description $ServiceDescription
        & $nssmPath set $ServiceName AppDirectory $PSScriptRoot
        & $nssmPath set $ServiceName AppStdout $LogFile
        & $nssmPath set $ServiceName AppStderr $LogFile
        & $nssmPath set $ServiceName Start SERVICE_AUTO_START
        & $nssmPath set $ServiceName AppRestartDelay 5000
        & $nssmPath start $ServiceName
        Write-Host "NSSM service '$ServiceName' installed and started."
    } else {
        # Fallback native wrapper - check first if service exists
        $existing = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
        if ($existing) {
            Write-Host "Removing old service $ServiceName ..."
            Stop-Service -Name $ServiceName -Force -ErrorAction SilentlyContinue
            Start-Sleep 2
            # Use sc.exe to delete
            & sc.exe delete $ServiceName | Out-Null
            Start-Sleep 2
        }
        Write-Host "Creating native Windows Service (fallback)..."
        $powershellExe = (Get-Command powershell.exe).Source
        try {
            New-Service -Name $ServiceName -BinaryPathName "$powershellExe -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$wrapperPath`"" -DisplayName $ServiceDisplayName -Description $ServiceDescription -StartupType Automatic -ErrorAction Stop
            # Set recovery to restart on failure
            & sc.exe failure $ServiceName reset= 86400 actions= restart/5000/restart/5000/restart/5000 | Out-Null
            Start-Service -Name $ServiceName -ErrorAction SilentlyContinue
            Write-Host "Native service '$ServiceName' installed."
        } catch {
            Write-Warning "Service install failed (may already exist or need reboot): $($_.Exception.Message)"
            Write-Host "Scheduled Task will still ensure background monitoring."
        }
    }
} else {
    Write-Warning "Not running as Administrator. Skipped Windows Service install (needs Admin)."
    Write-Host "Startup auto-launch was created instead - it will auto-start when you log on."
    Write-Host "To get full 24/7 system-wide service (runs even before login), right-click PowerShell -> Run as Administrator and run again: .\install_service.ps1"
}

Write-Host ""
Write-Host "Done! The USB monitoring engine is now running in background."
Write-Host "Logs: $LogFile"
Write-Host "Check: http://localhost:3001/api/devices"
if ($IsAdmin) { 
    Write-Host "Check Task Scheduler -> $TaskName and services.msc -> $ServiceDisplayName" 
} else {
    Write-Host "Check Startup folder and Registry HKCU Run -> USB-Sentinel-Backend"
    Write-Host "To verify: Get-Content `"$LogFile`" -Tail 20"
}
