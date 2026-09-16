# 🛡️ USB-Sentinel: Enterprise USB Device Control & Monitoring Framework

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Platform: Windows](https://img.shields.io/badge/Platform-Windows-0078D6.svg)](https://www.microsoft.com/windows)
[![UI: Material Design 3](https://img.shields.io/badge/Design-Material%20Design%203-757575.svg)](https://m3.material.io/)
[![Backend: Node.js + Express + Socket.IO](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20%7C%20Socket.IO-339933.svg)](https://nodejs.org/)
[![Frontend: React 19 + Vite](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite-61DAFB.svg)](https://react.dev/)

**USB-Sentinel** is a production-ready, enterprise-grade **Endpoint USB Security & Data Loss Prevention (DLP) Platform**. It continuously monitors Windows Plug-and-Play (PnP) hardware events, enforces organizational storage policies, audits file movements with real-time **SHA-256 + MD5** cryptographic hashing, and provides SOC analysts with an interactive threat investigation dashboard.

---

## 🎯 What is the Use of this Project?

In enterprise environments, unauthorized USB storage devices pose critical security risks, including:
1. **Data Exfiltration (DLP)**: Employees copying sensitive corporate files to personal flash drives.
2. **Malware Delivery (BadUSB / Rubber Ducky)**: HID injection attacks masquerading as standard USB keyboards.
3. **Unsigned Driver Tampering**: Malicious hardware exploiting unverified kernel storage drivers.

### Key Capabilities:
- **Real-Time PnP Hardware Monitoring** (`backend/scripts/get_pnp_devices.ps1:1`): Hooks into Windows WMI/CIM + `Get-PnpDevice` (USB, USBSTOR, DiskDrive, HIDClass, Bluetooth) to instantly detect insertion/removal. Enriched with VID/PID parsing, mount-point resolution, and Storage/Peripheral/Hub categorization.
- **Automated Policy Enforcement**: Allowlist, Blocklist, Read-Only, and Quarantine decisions with SOC alert generation (`backend/server.js:62`).
- **Cryptographic File Movement Auditing** (`backend/file_auditor.js:7`): Computes authentic **MD5** and **SHA-256** checksums for every file copied or modified on removable media via `fs.watch(recursive:true)`.
- **SOC Threat Intelligence & MITRE ATT&CK Mapping**: Maps rogue devices to MITRE techniques (`T1200`, `T1091`, `T1052.001`) and CVE references (`CVE-2023-38606`, `CVE-2021-3156`).
- **Dynamic System Telemetry** (`backend/scripts/get_endpoint.ps1`): Automatically resolves host Computer Name, Logged-in User, Windows Build, CPU, RAM, MAC Address, Local IP, and uptime without hardcoded credentials.
- **Live WebSocket Feed**: `Socket.IO` pushes `usb_inserted`, `usb_removed`, `file_event`, and `alert_generated` to `src/pages/LiveMonitoring.jsx:40` in real time.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Windows Endpoint (Host)                        │
│  ┌─────────────────────┐      ┌──────────────────────────────┐   │
│  │  PnP Hardware Bus   │─────▶│  get_pnp_devices.ps1         │   │
│  │  (USBSTOR/DiskDrive)│      │  get_endpoint.ps1            │   │
│  └─────────────────────┘      └────────────┬─────────────────┘   │
│                                            │ polling 2s / 10s    │
│  ┌─────────────────────┐      ┌────────────▼─────────────────┐   │
│  │  Removable Drive    │─────▶│  backend/server.js (3001)    │   │
│  │  E:\ / F:\          │ fs.watch│  Express + Socket.IO       │   │
│  └─────────────────────┘      │  file_auditor.js (SHA256)    │   │
│                               └────────────┬─────────────────┘   │
│                                            │ REST + WebSocket    │
│  ┌─────────────────────────────────────────▼──────────────────┐  │
│  │  Frontend (Vite :5173)  React 19 + api.js Live Backend   │  │
│  │  Dashboard / LiveMonitoring / DLP / Threat / Alerts        │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Backend Persistence Layer
| Component | File | Purpose |
|---|---|---|
| **Service Wrapper** | `backend/service_wrapper.ps1:1` | Auto-restart loop, kills stale `node` on `:3001`, logs to `backend/service.log`, survives crashes |
| **Admin Installer** | `backend/install_service.ps1:58` | Registers **Scheduled Task (SYSTEM)** at Logon+Startup + **Windows Service** (`USBEnterpriseMonitor`) with `sc.exe` recovery + optional NSSM |
| **Non-Admin Fallback** | `backend/install_service.ps1:79` | Creates `Startup\USB-Sentinel-Backend.lnk` + `HKCU\...\Run` + `backend/start_hidden.cmd` — no admin required |
| **Frontend Wrapper** | `start_frontend.ps1:1` | Hidden Vite dev server with auto-restart loop, logs to `frontend.log` |
| **Orchestrator** | `app.py:38` | Dev launcher that starts backend (`npm start`) + frontend (`npm run dev`) in parallel threads |

---

## ⚡ Live Enterprise Operation

USB-Sentinel runs exclusively in **Live Enterprise Mode** — a real-time, hardware-backed security platform for Windows endpoints:

```
                      +------------------------------------------+
                      |          USB-Sentinel Frontend           |
                      +------------------------------------------+
                                           |
                          Local Agent Service on Port 3001
                                           |
                          +--------------------------+
                          | 🟢 LIVE ENTERPRISE MODE   |
                          | - Real Windows PnP Feed  |
                          | - Live SHA-256 Hashing   |
                          | - WMI Host Telemetry     |
                          +--------------------------+
```

When the local background service is running (`http://localhost:3001` via `src/api.js:104`):
- Frontend maintains a persistent **WebSocket + REST** connection to `http://localhost:3001`.
- Displays green **`🟢 LIVE ENTERPRISE MODE`** badge (`src/pages/LiveMonitoring.jsx:94`).
- All hardware insertions, file transfers, and system telemetry represent **100% authentic, real-time operating system data**.

No mock or simulated data is used — the platform requires the backend agent to be active.

---

## 🛠️ How to Deploy & Use USB-Sentinel

### Prerequisites
- **OS**: Windows 10 / 11 / Server (PowerShell 5.1+)
- **Runtime**: Node.js v18+ (`node --version`), Python 3.8+ (only for `app.py` dev launcher)
- **Ports**: `3001` (backend), `5173` (frontend Vite)
- **Privileges**: Administrator *optional* — installer auto-adapts (see Option B)

### Install Dependencies
```bash
git clone https://github.com/Aeron-1258/USB-Sentinel.git
cd USB-Sentinel
npm install
cd backend && npm install && cd ..
```

---

### Option A: Development & Debugging Launcher (Recommended for Testing)

Run the Python orchestrator from the project root — starts both engines simultaneously:

```bash
python app.py
# or
py app.py
```

- Backend: `http://localhost:3001/api/devices`
- Frontend: `http://localhost:5173/`
- Logs stream to terminal with `[BACKEND]` / `[FRONTEND]` prefixes (`app.py:7`).

**Manual alternative (two terminals):**
```bash
# Terminal 1 - Backend
cd backend
npm start          # node server.js

# Terminal 2 - Frontend
npm run dev
```

---

### Option B: 24/7 Production Background Service (Company Deployment)

Persistent monitoring that survives reboots, logouts, and dashboard closure.

#### B1 — With Administrator (Full Enterprise)
```powershell
# PowerShell as Administrator
Set-ExecutionPolicy Bypass -Scope Process -Force
.\backend\install_service.ps1
```

What it does (`backend/install_service.ps1:30`):
1. Creates `backend/service_wrapper.ps1` — hidden infinite loop with crash recovery + `service.log`
2. Registers **Scheduled Task** `USB-Sentinel-Backend` as `SYSTEM` (AtLogOn + AtStartup, auto-restart on failure)
3. Installs **Windows Service** `USBEnterpriseMonitor` (NSSM if available, else native `sc.exe` + `New-Service` with failure recovery `restart/5000`)
4. Starts both immediately and verifies `http://localhost:3001/api/devices`

Verify:
```powershell
Get-ScheduledTask -TaskName "USB-Sentinel-Backend"
Get-Service -Name "USBEnterpriseMonitor"
Get-Content .\backend\service.log -Tail 20
Invoke-RestMethod http://localhost:3001/api/devices | ConvertTo-Json
```

#### B2 — Without Administrator (User-Level Fallback)
Same command **without** admin — automatically falls back to:
- `backend/start_hidden.cmd` launcher
- `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\USB-Sentinel-Backend.lnk`
- `HKCU:\Software\Microsoft\Windows\CurrentVersion\Run` → `USB-Sentinel-Backend`

It starts hidden in background and auto-launches on every user logon. To get full SYSTEM-level coverage later, re-run as Administrator.

#### Frontend Hidden Background (Optional)
```powershell
# Start Vite UI hidden in background (auto-restart)
powershell -WindowStyle Hidden -File .\start_frontend.ps1
# or double-click: start_frontend_hidden.cmd
Get-Content .\frontend.log -Tail 20
```

---

### Option C: Production Build
```bash
npm run build        # outputs to dist/
npm run preview      # preview production build
```

---

## 📊 Dashboard & SOC Console Features

| View | Purpose & Description |
| :--- | :--- |
| **Security Operations Center** (`src/components/dashboard/Dashboard.jsx:54`) | 15 KPI cards: Removable Storage (with Total PnP + peripheral/hub breakdown), Authorized/Blocked/Unknown/High Risk/Critical/Quarantined/Read-Only, Live Events, Active Sessions, Policy Violations, Security Score, Threat Feed, File Transfers, Malware Alerts + Dynamic Host Telemetry grid |
| **Live USB Monitoring** (`src/pages/LiveMonitoring.jsx:86`) | Real-time feed with 8 summary cards, forensic table (Asset & Class, VID:PID, mount/filesystem/capacity, trust bar, signature badge), WebSocket highlighting, and quick Allow/Block actions |
| **Device Inventory** | Asset table with global search, multi-criteria filtering, and sliding forensic drawer |
| **Data Loss Prevention (DLP)** | Live `file_event` stream capturing source paths, sizes, MD5/SHA-256 (`backend/file_auditor.js:7`), Defender scan results |
| **Threat Intelligence** | BadUSB heuristics, Rubber Ducky detection, MITRE ATT&CK + CVE mapping (`backend/server.js:187`) |
| **Incident Alerts Center** | Triage queue with **Acknowledge / Escalate / Close** workflows (`POST /api/alerts/action`) |
| **Security Reports** | On-demand `POST /api/scan` live endpoint scan before CSV/JSON export |

---

## 🔌 REST & WebSocket API

Base URL: `http://localhost:3001`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/endpoint` | Host telemetry (hostname, user, OS, CPU, RAM, MAC, IP) |
| `GET` | `/api/devices` | All PnP devices (`?type=storage` / `?type=peripheral`) |
| `GET` | `/api/audit-logs` | System audit logs (Event ID 20001 driver loads, etc.) |
| `GET` | `/api/file-events` | File transfer events with SHA-256 |
| `GET` | `/api/alerts` | SOC alerts |
| `POST` | `/api/alerts/action` | `{alertId, action, analystNote}` — triage |
| `GET` | `/api/threats` | Threat feed (BadUSB, unsigned driver, exfiltration) |
| `GET` | `/api/metrics` | Aggregated SOC metrics for Dashboard |
| `POST` | `/api/scan` | Trigger live `pollEndpointInfo` + `pollPnpDevices` |
| `WS` | `ws://localhost:3001` | Events: `initial_devices`, `usb_inserted`, `usb_removed`, `file_event`, `alert_generated` |

---

## 📁 Project Structure

```
USB-Sentinel/
├── app.py                        # Dev orchestrator (backend + frontend threads)
├── package.json                  # Frontend: React 19, Vite, Recharts, socket.io-client
├── vite.config.js
├── start_frontend.ps1            # Hidden frontend wrapper (auto-restart)
├── start_frontend_hidden.cmd     # Click-to-launch frontend hidden
├── src/
│   ├── api.js                    # Live backend API client (REST + WebSocket)
│   ├── pages/LiveMonitoring.jsx  # Real-time PnP feed + Socket.IO
│   └── components/dashboard/     # SOC 15-card telemetry
├── backend/
│   ├── server.js                 # Express + Socket.IO polling engine (2s/10s)
│   ├── file_auditor.js           # fs.watch + MD5/SHA256 hashing
│   ├── db.js                     # audit_store.json (500 logs / 200 alerts cap)
│   ├── audit_store.json
│   ├── service_wrapper.ps1       # (generated) hidden node loop + port 3001 guard
│   ├── start_hidden.cmd          # (generated) task launcher
│   ├── service.log               # Runtime logs
│   ├── install_service.ps1       # Admin (SYSTEM) vs Non-Admin installer
│   └── scripts/
│       ├── get_pnp_devices.ps1   # USB/USBSTOR/DiskDrive/HID/Bluetooth enumerator
│       └── get_endpoint.ps1      # Host telemetry (COMPUTERNAME, CIM, uptime)
└── public/
```

---

## 🆕 What's New (Latest Update)

> **Commit `5e8abd2` — Backend monitoring, service wrapper and frontend integration**

- **Fixed `install_service.ps1`**: Enterprise installer — Scheduled Task (SYSTEM, AtLogOn+AtStartup, auto-restart) + native Windows Service with `sc.exe` recovery; non-admin fallback via Startup LNK + HKCU Run; hidden `service_wrapper.ps1` with stale `:3001` guard and crash-restart loop (`backend/install_service.ps1:30`).
- **Enhanced PnP Detection** (`backend/scripts/get_pnp_devices.ps1:41`): Now queries `USB, USBSTOR, DiskDrive, HIDClass, Bluetooth`, fixes `$PID` reserved-variable collision (`$pidVal`), tags `isStorage/isHub/category` correctly, and recovers orphan `Win32_DiskDrive` volumes missing from PnP.
- **Improved Metrics** (`backend/server.js:199`): Separates `totalDevices` (all PnP) vs `totalStorageDevices` (DLP-relevant removable drives) vs `totalPeripherals/totalHubs`; frontend cards now show `Removable Storage: N / Total PnP: M (periph + hubs)` to avoid confusion.
- **File Auditor Fix** (`backend/file_auditor.js:83`): Renamed `pid` → `devicePid` to avoid collision with process PID in audit logs.
- **Frontend Hardening** (`src/api.js:104`, `src/pages/LiveMonitoring.jsx:22`): Live backend connectivity checks, Socket.IO `connect`/`connect_error` handling, `isStorageDevice()` helper for consistent Storage vs Peripheral counting.
- **Background Launchers**: Added `start_frontend.ps1` + `start_frontend_hidden.cmd` and `backend/service_wrapper.ps1` + `backend/start_hidden.cmd` for hidden auto-restart operation.

---

## 🔧 Troubleshooting

| Issue | Fix |
|---|---|
| `PORT 3001 already in use` | Wrapper auto-kills stale node via `Get-NetTCPConnection -LocalPort 3001` (`backend/service_wrapper.ps1:6`). Manual: `Get-NetTCPConnection -LocalPort 3001 \| % {Stop-Process $_.OwningProcess -Force}` |
| Backend not reachable | Check `http://localhost:3001/api/devices` in browser; if OK, firewall is blocking `fetch` — allow `node.exe` through Defender Firewall |
| `No devices show` but USB plugged | Run `powershell -File .\backend\scripts\get_pnp_devices.ps1` manually; if empty, run PowerShell as Admin (WMI needs elevation for some classes) |
| `file_event` not firing | Ensure drive has letter (E:\, F:\) and is not BitLocker-locked; check `backend/service.log` for `[FileAuditor] Starting watcher` |
| Service fails to start | View `backend/service.log`; check `Get-WinEvent -LogName System \| ? Message -like "*USBEnterpriseMonitor*"` |

---

## 📜 License & Compliance

Distributed under the **MIT License**. Suitable for enterprise internal deployment and security auditing.
