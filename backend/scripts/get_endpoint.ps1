$ErrorActionPreference = "SilentlyContinue"

$cs = Get-CimInstance Win32_ComputerSystem
$os = Get-CimInstance Win32_OperatingSystem
$cpu = Get-CimInstance Win32_Processor | Select-Object -First 1
$net = Get-CimInstance Win32_NetworkAdapterConfiguration | Where-Object { $_.IPEnabled -eq $true } | Select-Object -First 1
$bios = Get-CimInstance Win32_BIOS

$uptime = (Get-Date) - $os.LastBootUpTime
$memGB = if ($cs.TotalPhysicalMemory) { [math]::Round($cs.TotalPhysicalMemory / 1GB, 2).ToString() + " GB" } else { "N/A" }

# Dynamic resolution — no hardcoded SECURE-ENDPOINT-01 / CORP\sec_admin
$hostname = $env:COMPUTERNAME
if (-not $hostname) { $hostname = $cs.Name }
if (-not $hostname) { $hostname = "UNKNOWN-HOST" }

$username = $env:USERNAME
$domainUser = if ($env:USERDOMAIN -and $username) { "$env:USERDOMAIN\$username" } else { $username }
if (-not $domainUser) { $domainUser = "N/A" }

$compName = $cs.DNSHostName
if (-not $compName) { $compName = $hostname }

$endpoint = [PSCustomObject]@{
    hostname       = $hostname
    computerName   = $compName
    user           = $domainUser
    osVersion      = $os.Caption
    osBuild        = $os.BuildNumber
    domain         = $cs.Domain
    workgroup      = $cs.Workgroup
    cpu            = $cpu.Name
    ram            = $memGB
    bios           = $bios.SMBIOSBIOSVersion
    macAddress     = $net.MACAddress
    localIp        = ($net.IPAddress | Select-Object -First 1)
    systemUuid     = $bios.SerialNumber
    agentVersion   = "v2.4.0-production"
    endpointId     = "EP-$hostname"
    lastBootTime   = $os.LastBootUpTime.ToString("yyyy-MM-dd HH:mm:ss")
    uptime         = "$($uptime.Days)d $($uptime.Hours)h $($uptime.Minutes)m"
    totalProcesses = (Get-Process | Measure-Object).Count
    windowsProduct = $os.SerialNumber
}

$endpoint | ConvertTo-Json -Compress
