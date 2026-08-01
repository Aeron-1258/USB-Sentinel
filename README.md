# USB Device Control & Monitoring Framework

# ⚡ Live Production Deployment

The **USB Device Control & Monitoring Framework** is designed as a production-ready enterprise application that operates continuously after installation on a Windows endpoint.

Once installed, the application automatically starts with the operating system and continuously monitors USB device activity in real time without requiring manual intervention.

The application dynamically identifies the current endpoint and displays live information for that specific system. No manual configuration is required after installation.

The framework continuously performs the following operations:

• Detects USB device insertion and removal in real time.
• Identifies connected USB devices and displays their details.
• Applies the configured USB access policies automatically.
• Detects unauthorized USB devices.
• Maintains Allowlist and Blocklist policies.
• Records every USB connection and removal event.
• Audits file transfers involving USB storage devices.
• Tracks file copy, move, rename, modification, and deletion events.
• Generates real-time security alerts for policy violations and suspicious USB activity.
• Maintains complete audit logs with timestamps.
• Updates the dashboard automatically with the latest endpoint activity.
• Generates reports using the most recent endpoint information.
• Maintains device history and connection records.
• Provides continuous endpoint protection throughout system operation.

The application continues monitoring in the background even when the dashboard is not open, ensuring uninterrupted USB security monitoring and policy enforcement.

After deployment, each endpoint operates independently using its own live system information, USB activity, and security events. All dashboard metrics, audit logs, alerts, reports, and analytics are generated from actual endpoint activity.

The application is intended for continuous production use and provides real-time USB Device Control, Monitoring, File Auditing, Policy Enforcement, Threat Detection, and Security Reporting for enterprise environments.

---

## 🛠️ System Architecture & Quick Start

### 1. Development Mode Launcher (Runs Frontend + Live Backend)
```bash
python app.py
```

### 2. Windows Service Deployment (Runs 24/7 in Background)
Run as Administrator in PowerShell:
```powershell
.\backend\install_service.ps1
```

### 3. Dashboard Web Interface
Navigate to:
`http://localhost:5173/`

---

## 🔒 Enterprise Features Overview

- **Dynamic Endpoint Telemetry**: Resolves Hostname, Logged-in User, OS Build, CPU, RAM, MAC Address, and Uptime via WMI/CIM.
- **PnP Hardware Engine**: Hooks into Windows Plug-and-Play events to detect Storage, Keyboards, Mice, Webcams, and Hubs.
- **Real-Time File System Auditing**: Watches mounted USB drives (e.g. `E:\`) and computes authentic MD5 and SHA-256 hashes for every file movement.
- **Live On-Demand Scanning**: Triggers instant rescan prior to generating CSV/JSON compliance reports.
