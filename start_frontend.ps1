$ErrorActionPreference = 'SilentlyContinue'
$logFile = 'C:\Users\aeron\USB-Sentinel\frontend.log'
function Write-Log($msg) { Add-Content -Path $logFile -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $msg" }
Write-Log "[Frontend] Starting vite dev server..."
Set-Location 'C:\Users\aeron\USB-Sentinel'
while ($true) {
    Write-Log "[Frontend] launching npm run dev"
    $proc = Start-Process -FilePath 'C:\Program Files\nodejs\npm.cmd' -ArgumentList 'run','dev' -WorkingDirectory 'C:\Users\aeron\USB-Sentinel' -WindowStyle Hidden -PassThru
    Write-Log "[Frontend] vite PID $($proc.Id)"
    $proc.WaitForExit()
    Write-Log "[Frontend] vite exited code $($proc.ExitCode) restarting in 3s"
    Start-Sleep 3
}
