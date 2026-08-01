# install_service.ps1
# This script configures the USB Monitoring Backend as a persistent Windows Service.
# It requires Administrator privileges.

$ErrorActionPreference = "Stop"

if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Warning "Please run this script as an Administrator."
    exit
}

$ServiceName = "USBEnterpriseMonitor"
$ServiceDisplayName = "USB Endpoint Security Monitor"
$ServiceDescription = "Continuously monitors physical PnP USB hardware events for the USB Device Control Framework."
$NodePath = (Get-Command node.exe -ErrorAction SilentlyContinue).Source
$AppPath = Join-Path $PSScriptRoot "server.js"

if (!$NodePath) {
    Write-Error "Node.js is not installed or not in the system PATH."
    exit
}

Write-Host "Installing Windows Service: $ServiceName"

# We use NSSM (Non-Sucking Service Manager) if available, otherwise fallback to creating a basic wrapper
$nssmPath = (Get-Command nssm -ErrorAction SilentlyContinue).Source

if ($nssmPath) {
    Write-Host "NSSM detected. Configuring robust service..."
    & $nssmPath install $ServiceName $NodePath $AppPath
    & $nssmPath set $ServiceName Description $ServiceDescription
    & $nssmPath set $ServiceName AppDirectory $PSScriptRoot
    & $nssmPath set $ServiceName Start SERVICE_AUTO_START
    & $nssmPath start $ServiceName
} else {
    Write-Host "NSSM not found. Generating standalone PowerShell service wrapper..."
    
    $wrapperPath = Join-Path $PSScriptRoot "service_wrapper.ps1"
    $wrapperContent = @"
`$ErrorActionPreference = 'SilentlyContinue'
Start-Process -FilePath '$NodePath' -ArgumentList '$AppPath' -WindowStyle Hidden -Wait
"@
    Set-Content -Path $wrapperPath -Value $wrapperContent
    
    $powershellExe = (Get-Command powershell.exe).Source
    
    # Native Windows service creation (hacky for node apps without nssm or node-windows, but works for basic deployment)
    New-Service -Name $ServiceName -BinaryPathName "$powershellExe -ExecutionPolicy Bypass -WindowStyle Hidden -File $wrapperPath" -DisplayName $ServiceDisplayName -Description $ServiceDescription -StartupType Automatic
    Start-Service -Name $ServiceName
}

Write-Host "Service '$ServiceName' installed and started successfully!"
Write-Host "The USB monitoring engine is now running in the background and will persist across reboots."
