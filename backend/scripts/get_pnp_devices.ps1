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

# 2. Fetch General USB PnP Devices (Keyboards, Mice, Webcams, Hubs, Adapters)
$pnpDevices = Get-PnpDevice -Class USB, HIDClass, Bluetooth -Status OK | Where-Object { $_.InstanceId -like "*USB*" }

$deviceList = @()

foreach ($pnp in $pnpDevices) {
    # Extract VID and PID
    $vid = "Unknown"
    $pid = "Unknown"
    if ($pnp.InstanceId -match "VID_([0-9A-F]{4})") { $vid = "0x" + $matches[1] }
    if ($pnp.InstanceId -match "PID_([0-9A-F]{4})") { $pid = "0x" + $matches[1] }
    
    # Check if matched with disk
    $matchedDisk = $diskList | Where-Object { $_.pnpDeviceID -eq $pnp.InstanceId }
    
    $deviceList += [PSCustomObject]@{
        id            = $pnp.InstanceId
        name          = if ($pnp.FriendlyName) { $pnp.FriendlyName } else { $pnp.Name }
        class         = $pnp.Class
        manufacturer  = $pnp.Manufacturer
        vid           = $vid
        pid           = $pid
        serial        = if ($matchedDisk) { $matchedDisk.serial } else { "SN-" + $pnp.InstanceId.GetHashCode().ToString("X") }
        status        = $pnp.Status
        hardwareId    = $pnp.InstanceId
        mountPoint    = if ($matchedDisk) { $matchedDisk.mountPoint } else { "N/A" }
        fileSystem    = if ($matchedDisk) { $matchedDisk.fileSystem } else { "N/A" }
        capacity      = if ($matchedDisk) { $matchedDisk.size } else { "N/A" }
    }
}

$deviceList | ConvertTo-Json -Compress
