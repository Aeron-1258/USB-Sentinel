$ErrorActionPreference = "SilentlyContinue"

# Get all USB disk drives
$usbDrives = Get-CimInstance Win32_DiskDrive | Where-Object { $_.InterfaceType -eq 'USB' }

$results = @()

foreach ($drive in $usbDrives) {
    # Get associated partitions
    $partitions = Get-CimAssociatedInstance -InputObject $drive -ResultClassName Win32_DiskPartition
    
    $mountPoint = "Unknown"
    $volumeLabel = "Unknown"
    $fileSystem = "Unknown"
    
    foreach ($part in $partitions) {
        # Get associated logical disks
        $logicalDisks = Get-CimAssociatedInstance -InputObject $part -ResultClassName Win32_LogicalDisk
        foreach ($ld in $logicalDisks) {
            $mountPoint = $ld.DeviceID + "\"
            $volumeLabel = $ld.VolumeName
            $fileSystem = $ld.FileSystem
        }
    }
    
    $results += [PSCustomObject]@{
        DeviceID = $drive.DeviceID
        PNPDeviceID = $drive.PNPDeviceID
        Model = $drive.Model
        SerialNumber = $drive.SerialNumber
        Size = $drive.Size
        MountPoint = $mountPoint
        VolumeLabel = $volumeLabel
        FileSystem = $fileSystem
    }
}

$results | ConvertTo-Json -Compress
