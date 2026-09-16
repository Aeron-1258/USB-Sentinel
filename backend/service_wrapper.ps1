$ErrorActionPreference = 'SilentlyContinue'
$logFile = 'C:\Users\aeron\USB-Sentinel\backend\service.log'
function Write-Log($msg) { Add-Content -Path $logFile -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $msg" }
Write-Log "[Wrapper] Starting USB-Sentinel backend..."
# Kill any stale node holding port 3001 before start
try { Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } } catch {}
# Start node and keep wrapper alive; restart if node crashes
while ($true) {
    Write-Log "[Wrapper] Launching node C:\Users\aeron\USB-Sentinel\backend\server.js"
    # FIX: Removed extra quotes around AppPath and removed RedirectStandardOutput (caused file-lock and PID empty)
    $proc = Start-Process -FilePath 'C:\Program Files\nodejs\node.exe' -ArgumentList 'C:\Users\aeron\USB-Sentinel\backend\server.js' -WorkingDirectory 'C:\Users\aeron\USB-Sentinel\backend' -WindowStyle Hidden -PassThru
    if ($proc) {
        Write-Log "[Wrapper] Node PID $($proc.Id) started"
        $proc.WaitForExit()
        Write-Log "[Wrapper] Node exited with code $($proc.ExitCode). Restarting in 3s..."
    } else {
        Write-Log "[Wrapper] Failed to start node. Retrying in 3s..."
    }
    Start-Sleep -Seconds 3
}
