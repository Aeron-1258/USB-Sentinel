# 🛡️ USB-Sentinel: Enterprise USB Device Control & Monitoring Framework

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Platform: Windows](https://img.shields.io/badge/Platform-Windows-0078D6.svg)](https://www.microsoft.com/windows)
[![UI: Material Design 3](https://img.shields.io/badge/Design-Material%20Design%203-757575.svg)](https://m3.material.io/)

**USB-Sentinel** is a production-ready, enterprise-grade **Endpoint USB Security & Data Loss Prevention (DLP) Platform**. It continuously monitors Windows Plug-and-Play (PnP) hardware events, enforces organizational storage policies, audits file movements with real-time SHA-256 cryptographic hashing, and provides SOC analysts with an interactive threat investigation dashboard.

---

## 🎯 What is the Use of this Project?

In enterprise environments, unauthorized USB storage devices pose critical security risks, including:
1. **Data Exfiltration (DLP)**: Employees copying sensitive corporate files to personal flash drives.
2. **Malware Delivery (BadUSB / Rubber Ducky)**: HID injection attacks masquerading as standard USB keyboards.
3. **Unsigned Driver Tampering**: Malicious hardware exploiting unverified kernel storage drivers.

### Key Capabilities:
- **Real-Time PnP Hardware Monitoring**: Hooks into Windows WMI/CIM interfaces to instantly detect USB insertion and removal.
- **Automated Policy Enforcement**: Supports Allowlist, Blocklist, Read-Only, and Quarantine policy decisions.
- **Cryptographic File Movement Auditing**: Computes authentic **MD5** and **SHA-256** checksums for every file copied or modified on removable media.
- **SOC Threat Intelligence & MITRE ATT&CK Mapping**: Maps rogue devices to MITRE techniques (`T1200`, `T1091`, `T1052.001`) and CVE references.
- **Dynamic System Telemetry**: Automatically resolves host Computer Name, Logged-in User, Windows Build, CPU, RAM, and MAC Address without hardcoded credentials.

---

## ⚡ Automatic Dual-Mode Operation

USB-Sentinel features an **Automatic Dual-Mode Architecture** designed for both enterprise production deployment and static portfolio demonstration:

```
                      +------------------------------------------+
                      |          USB-Sentinel Frontend           |
                      +------------------------------------------+
                                           |
                   Is Local Agent Service Running on Port 3001?
                                 /                  \
                                YES                  NO
                               /                      \
          +--------------------------+          +--------------------------+
          | 🟢 LIVE ENTERPRISE MODE   |          | ⚡ DEMO MODE (PREVIEW)   |
          | - Real Windows PnP Feed  |          | - Interactive Datasets   |
          | - Live SHA-256 Hashing   |          | - Full UI Workflows      |
          | - WMI Host Telemetry     |          | - Static / Web Preview   |
          +--------------------------+          +--------------------------+
```

### 1. 🟢 Live Enterprise Mode (Company Endpoint Deployment)
When installed on a company workstation with the local background service running:
- The frontend maintains a persistent WebSocket & REST connection to `http://localhost:3001`.
- Displays a green **`🟢 LIVE ENTERPRISE MODE`** badge.
- All hardware insertions, file transfers, and system telemetry represent **100% authentic, real-time operating system data**.

### 2. ⚡ Demo Mode (Static Web / Portfolio Preview)
When hosted statically (e.g., GitHub Pages, Vercel) or when the backend agent is not running:
- The system automatically detects the offline agent within 1.5 seconds.
- Displays an amber **`⚡ DEMO MODE (PREVIEW)`** badge.
- The dashboard, inventory, threat center, and DLP feeds remain **100% interactive and functional** using pre-configured security datasets.

---

## 🛠️ How to Deploy & Use USB-Sentinel

### Prerequisites
- **Operating System**: Windows 10 / Windows 11 / Windows Server
- **Runtime**: Node.js (v18+) & Python (v3.8+)
- **Privileges**: Administrator privileges (for persistent Windows Service installation)

---

### Option A: Development & Debugging Launcher (Recommended for Testing)

Run the Python orchestrator script from the project root. It will start both the local hardware monitoring engine and the web interface simultaneously:

```bash
# 1. Clone the repository
git clone https://github.com/Aeron-1258/USB-Sentinel.git
cd USB-Sentinel

# 2. Launch Development Mode
python app.py
```

Open your browser to: **`http://localhost:5173/`**

---

### Option B: 24/7 Production Background Service (Company Deployment)

To run the monitoring engine continuously in the background—even when the web dashboard is closed or no user is logged in:

1. Open **PowerShell as Administrator**.
2. Run the included service installer script:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
.\backend\install_service.ps1
```

3. To start the Web UI separately:
```bash
npm run dev
```

---

## 📊 Dashboard & SOC Console Features

| View | Purpose & Description |
| :--- | :--- |
| **Security Operations Center** | 15 core KPI metrics tracking connected devices, policy violations, active sessions, and security score. |
| **Live USB Monitoring** | Real-time hardware feed displaying PnP IDs, USB speed (10 Gbps), verified driver signatures, and quick action controls. |
| **Device Inventory** | Enterprise asset table with global search, multi-criteria filtering, and a sliding right-side forensic drawer. |
| **Data Loss Prevention (DLP)** | Live file transfer auditing capturing source paths, file sizes, Defender scan results, and computed SHA-256 hashes. |
| **Threat Intelligence** | BadUSB heuristics, Rubber Ducky detection, and direct MITRE ATT&CK Framework mapping. |
| **Incident Alerts Center** | SOC Analyst Triage queue supporting **Acknowledge**, **Escalate**, and **Close** containment workflows. |
| **Security Reports** | Triggers an instant on-demand live endpoint scan before exporting compliance reports in CSV or JSON formats. |

---

## 📜 License & Compliance

Distributed under the **MIT License**. Suitable for enterprise internal deployment, security auditing, and portfolio demonstrations.
