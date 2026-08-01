$ErrorActionPreference = "SilentlyContinue"

$cs = Get-CimInstance Win32_ComputerSystem
$os = Get-CimInstance Win32_OperatingSystem
$cpu = Get-CimInstance Win32_Processor | Select-Object -First 1
$net = Get-CimInstance Win32_NetworkAdapterConfiguration | Where-Object { $_.IPEnabled -eq $true } | Select-Object -First 1
$bios = Get-CimInstance Win32_BIOS

$uptime = (Get-Date) - $os.LastBootUpTime

$endpoint = [PSCustomObject]@{
    hostname       = "SECURE-ENDPOINT-01"
    computerName   = "SECURE-ENDPOINT-01"
    user           = "CORP\sec_admin"
    osVersion      = $os.Caption
    osBuild        = $os.BuildNumber
    domain         = $cs.Domain
    cpu            = $cpu.Name
    ram            = [math]::Round($cs.TotalPhysicalMemory / 1GB, 2).ToString() + " GB"
    bios           = $bios.SMBIOSBIOSVersion
    macAddress     = $net.MACAddress
    localIp        = ($net.IPAddress | Select-Object -First 1)
    systemUuid     = $bios.SerialNumber
    agentVersion   = "v2.4.0-production"
    endpointId     = "EP-SECURE-01"
    lastBootTime   = $os.LastBootUpTime.ToString("yyyy-MM-dd HH:mm:ss")
    uptime         = "$($uptime.Days)d $($uptime.Hours)h $($uptime.Minutes)m"
}

$endpoint | ConvertTo-Json -Compress
