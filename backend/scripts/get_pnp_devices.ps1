$ErrorActionPreference = "SilentlyContinue"

# 1. Fetch USB Disk Drives & Volumes
$usbDisks = Get-CimInstance Win32_DiskDrive | Where-Object { $_.InterfaceType -eq 'USB' }
$diskList = @()

foreach ($disk in $usbDisks) {
    $mountPoint = "N/A"
    $volumeLabel = "N/A"
    $fileSystem = "N/A"
    
    $partitions = Get-CimAssociatedInstance -InputObject $disk -ResultClassName Win32_DiskPartition
    foreach ($part in $partitions) {
        $logicalDisks = Get-CimAssociatedInstance -InputObject $part -ResultClassName Win32_LogicalDisk
        foreach ($ld in $logicalDisks) {
            $mountPoint = $ld.DeviceID + "\"
            $volumeLabel = $ld.VolumeName
            $fileSystem = $ld.FileSystem
        }
    }

    $diskList += [PSCustomObject]@{
        deviceID     = $disk.DeviceID
        pnpDeviceID  = $disk.PNPDeviceID
        name         = $disk.Model
        vendor       = if ($disk.Model) { $disk.Model.Split(' ')[0] } else { "Generic USB" }
        serial       = $disk.SerialNumber
        size         = if ($disk.Size) { [math]::Round($disk.Size / 1GB, 1).ToString() + " GB" } else { "N/A" }
        mountPoint   = $mountPoint
        volumeLabel  = $volumeLabel
        fileSystem   = $fileSystem
        class        = "Mass Storage"
    }
}

# 2. Fetch General USB PnP Devices (Keyboards, Mice, Webcams, Hubs, Adapters + Storage)
# FIX: Added USBSTOR and DiskDrive classes so thumb-drives / external SSDs are not missed.
# FIX: Renamed $pid -> $pidVal because $PID is a reserved automatic variable (process ID).
# NOTE: Hubs / Host Controllers are now tagged separately so the frontend can show
#       "Removable Storage: 0" vs "Total USB Peripherals: N" instead of confusing counts.
$pnpDevices = Get-PnpDevice -Class USB, USBSTOR, DiskDrive, HIDClass, Bluetooth -Status OK -ErrorAction SilentlyContinue | Where-Object { $_.InstanceId -like "*USB*" -or $_.InstanceId -like "*STOR*" } | Where-Object { $_.InstanceId -notlike "*ROOT_HUB*" -and $_.InstanceId -notlike "*USB\\HUB*" }

$deviceList = @()

foreach ($pnp in $pnpDevices) {
    # Extract VID and PID - use different variable names to avoid $PID collision
    $vidVal = "Unknown"
    $pidVal = "Unknown"
    if ($pnp.InstanceId -match "VID_([0-9A-F]{4})") { $vidVal = "0x" + $matches[1] }
    if ($pnp.InstanceId -match "PID_([0-9A-F]{4})") { $pidVal = "0x" + $matches[1] }
    
    # Check if matched with disk (match by PNPDeviceID or by serial/model fallback)
    $matchedDisk = $diskList | Where-Object { $_.pnpDeviceID -eq $pnp.InstanceId }
    # Fallback: also match via InstanceId substring for USBSTOR devices where IDs differ slightly
    if (-not $matchedDisk -and $pnp.InstanceId -like "*STOR*") {
        $matchedDisk = $diskList | Where-Object { $pnp.InstanceId -like "*$($_.serial)*" } | Select-Object -First 1
    }
    
    $isHub = $pnp.Name -like "*Hub*" -or $pnp.Name -like "*Host Controller*" -or $pnp.InstanceId -like "*HUB*"
    $isStorage = $false
    if ($matchedDisk) {
        # Only true removable storage with a mounted volume counts as storage
        if ($matchedDisk.mountPoint -ne "N/A") { $isStorage = $true }
        # USBSTOR/DiskDrive STOR entries that matched a USB disk are storage even if transiently unmounted
        if ($pnp.Class -in @('USBSTOR','DiskDrive')) { $isStorage = $true }
    }
    $category = if ($isStorage) { "Storage" } elseif ($isHub) { "Hub" } else { "Peripheral" }

    $deviceList += [PSCustomObject]@{
        id            = $pnp.InstanceId
        name          = if ($pnp.FriendlyName) { $pnp.FriendlyName } else { $pnp.Name }
        class         = $pnp.Class
        manufacturer  = $pnp.Manufacturer
        vid           = $vidVal
        pid           = $pidVal
        serial        = if ($matchedDisk) { $matchedDisk.serial } else { "SN-" + $pnp.InstanceId.GetHashCode().ToString("X") }
        status        = $pnp.Status
        hardwareId    = $pnp.InstanceId
        mountPoint    = if ($matchedDisk) { $matchedDisk.mountPoint } else { "N/A" }
        fileSystem    = if ($matchedDisk) { $matchedDisk.fileSystem } else { "N/A" }
        capacity      = if ($matchedDisk) { $matchedDisk.size } else { "N/A" }
        isStorage     = $isStorage
        isHub         = $isHub
        category      = $category
    }
}

# 3. Add orphan disk drives that had no PnP match (direct USB mass storage not exposed as USB class)
foreach ($disk in $diskList) {
    $alreadyAdded = $deviceList | Where-Object { $_.mountPoint -eq $disk.mountPoint -and $disk.mountPoint -ne "N/A" }
    if (-not $alreadyAdded) {
        # Try to parse VID/PID from PNPDeviceID for orphan disks
        $vidVal = "Unknown"
        $pidVal = "Unknown"
        if ($disk.pnpDeviceID -match "VEN_([^&]+)") { $vidVal = $matches[1] }
        if ($disk.pnpDeviceID -match "PROD_([^&]+)") { $pidVal = $matches[1] }
        if ($disk.pnpDeviceID -match "VID_([0-9A-F]{4})") { $vidVal = "0x" + $matches[1] }
        if ($disk.pnpDeviceID -match "PID_([0-9A-F]{4})") { $pidVal = "0x" + $matches[1] }

        $deviceList += [PSCustomObject]@{
            id            = $disk.pnpDeviceID
            name          = $disk.name
            class         = $disk.class
            manufacturer  = $disk.vendor
            vid           = $vidVal
            pid           = $pidVal
            serial        = $disk.serial
            status        = "OK"
            hardwareId    = $disk.pnpDeviceID
            mountPoint    = $disk.mountPoint
            fileSystem    = $disk.fileSystem
            capacity      = $disk.size
            isStorage     = $true
            isHub         = $false
            category      = "Storage"
        }
    }
}

$deviceList | ConvertTo-Json -Compress
