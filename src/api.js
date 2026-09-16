const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Rich Mock Data for Demo Mode Fallback
const DEMO_ENDPOINT = {
  hostname: "DEMO-ENDPOINT-01",
  computerName: "CORP-SEC-LAPTOP",
  user: "CORP\\sec_analyst",
  osVersion: "Windows 11 Enterprise (Build 22631)",
  osBuild: "22631",
  domain: "SECURITY.CORP.LOCAL",
  cpu: "13th Gen Intel(R) Core(TM) i7-13700H",
  ram: "32.0 GB",
  macAddress: "00:1A:2B:3C:4D:5E",
  localIp: "192.168.1.105",
  systemUuid: "UUID-DEMO-9482-1048-5910",
  agentVersion: "v2.4.0-demo",
  endpointId: "EP-DEMO-NODE",
  lastBootTime: "2026-08-01 08:00:00",
  uptime: "0d 13h 45m",
};

const DEMO_DEVICES = [
  {
    id: "DEV-0x0781-0x5581",
    name: "SanDisk Cruzer Secure 3.2",
    vendor: "SanDisk Corp",
    manufacturer: "Western Digital Technologies, Inc.",
    vid: "0x0781",
    pid: "0x5581",
    serial: "SN-04857204958A",
    class: "Mass Storage",
    hardwareId: "USB\\VID_0781&PID_5581&REV_0100",
    status: "Authorized",
    trustScore: 95,
    riskScore: 10,
    mountPoint: "E:\\",
    fileSystem: "exFAT",
    capacity: "64.0 GB",
    isSigned: true,
    isStorage: true,
    isHub: false,
    category: "Storage",
  },
  {
    id: "DEV-0x0930-0x6545",
    name: "Kingston DataTraveler Max",
    vendor: "Kingston Technology",
    manufacturer: "Kingston",
    vid: "0x0930",
    pid: "0x6545",
    serial: "SN-8492048201",
    class: "Mass Storage",
    hardwareId: "USB\\VID_0930&PID_6545&REV_0200",
    status: "Quarantined",
    trustScore: 42,
    riskScore: 78,
    mountPoint: "F:\\",
    fileSystem: "NTFS",
    capacity: "128.0 GB",
    isSigned: false,
    isStorage: true,
    isHub: false,
    category: "Storage",
  },
  {
    id: "DEV-0x046D-0xC52B",
    name: "Logitech USB Receiver",
    vendor: "Logitech",
    manufacturer: "Logitech Inc.",
    vid: "0x046D",
    pid: "0xC52B",
    serial: "SN-HID-LOGI-841",
    class: "HIDClass",
    hardwareId: "USB\\VID_046D&PID_C52B",
    status: "Authorized",
    trustScore: 98,
    riskScore: 2,
    mountPoint: "N/A",
    fileSystem: "N/A",
    capacity: "N/A",
    isSigned: true,
    isStorage: false,
    isHub: false,
    category: "Peripheral",
  },
];

const DEMO_AUDIT_LOGS = [
  {
    id: "AUD-9001",
    timestamp: "2026-08-01 21:10:12",
    endpoint: "DEMO-ENDPOINT-01",
    user: "sec_analyst",
    process: "explorer.exe (PID 4812)",
    action: "File Copied to USB",
    device: "SanDisk Cruzer",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    severity: "Low",
  },
  {
    id: "AUD-9002",
    timestamp: "2026-08-01 21:05:40",
    endpoint: "DEMO-ENDPOINT-01",
    user: "sec_analyst",
    process: "services.exe (PID 812)",
    action: "Driver Load Blocked",
    device: "Kingston DataTraveler",
    hash: "N/A",
    severity: "High",
  },
];

const DEMO_FILE_EVENTS = [
  {
    id: "FEV-101",
    timestamp: "2026-08-01 21:10:12",
    user: "sec_analyst",
    filename: "Q3_Financial_Audit.xlsx",
    action: "File Written",
    source: "C:\\Users\\Desktop\\Q3_Financial_Audit.xlsx",
    usbDevice: "SanDisk Cruzer (E:)",
    hash: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
  },
  {
    id: "FEV-102",
    timestamp: "2026-08-01 20:45:00",
    user: "sec_analyst",
    filename: "Customer_DB_Export.csv",
    action: "File Written",
    source: "C:\\Exports\\Customer_DB_Export.csv",
    usbDevice: "Kingston (F:)",
    hash: "4a0a19218e082a343a1b17e5333409af9d98f0f5f67a216e9195ba1a646c8209",
  },
];

const DEMO_ALERTS = [
  {
    id: "ALT-501",
    timestamp: "2026-08-01 21:05:40",
    title: "Unrecognized USB Storage Device Attached",
    severity: "Critical",
    device: "Kingston DataTraveler",
    vid: "0x0930",
    pid: "0x6545",
    user: "sec_analyst",
    status: "Active",
    mitreTechnique: "T1200 Hardware Additions",
  },
];

let activeMode = "UNKNOWN";

export async function checkMode() {
  try {
    const res = await fetch(`${BASE_URL}/endpoint`, {
      method: "GET",
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      activeMode = "LIVE";
      return "LIVE";
    }
  } catch (e) {}
  activeMode = "DEMO";
  return "DEMO";
}

export function getActiveMode() {
  return activeMode;
}

export async function fetchEndpointInfo() {
  try {
    const res = await fetch(`${BASE_URL}/endpoint`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      activeMode = "LIVE";
      return await res.json();
    }
  } catch (e) {}
  activeMode = "DEMO";
  return DEMO_ENDPOINT;
}

export async function fetchDevices() {
  try {
    const res = await fetch(`${BASE_URL}/devices`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      activeMode = "LIVE";
      return await res.json();
    }
  } catch (e) {}
  activeMode = "DEMO";
  return DEMO_DEVICES;
}

export async function fetchDeviceDetails(id) {
  try {
    const res = await fetch(`${BASE_URL}/devices/${id}`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) return await res.json();
  } catch (e) {}
  return DEMO_DEVICES.find((d) => d.id === id) || DEMO_DEVICES[0];
}

export async function fetchAuditLogs() {
  try {
    const res = await fetch(`${BASE_URL}/audit-logs`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) return await res.json();
  } catch (e) {}
  return DEMO_AUDIT_LOGS;
}

export async function fetchFileEvents() {
  try {
    const res = await fetch(`${BASE_URL}/file-events`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) return await res.json();
  } catch (e) {}
  return DEMO_FILE_EVENTS;
}

export async function fetchAlerts() {
  try {
    const res = await fetch(`${BASE_URL}/alerts`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) return await res.json();
  } catch (e) {}
  return DEMO_ALERTS;
}

export async function alertAction(alertId, action, analystNote) {
  const res = await fetch(`${BASE_URL}/alerts/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ alertId, action, analystNote }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Action failed");
  return data;
}

export async function fetchPolicies(type) {
  const qs = type ? `?type=${type}` : "";
  const res = await fetch(`${BASE_URL}/policies${qs}`);
  if (!res.ok) throw new Error((await res.json()).error || "Failed to fetch policies");
  return await res.json();
}

export async function createPolicy(payload) {
  const res = await fetch(`${BASE_URL}/policies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Create failed");
  return data;
}

export async function deletePolicy(id) {
  const res = await fetch(`${BASE_URL}/policies/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error((await res.json()).error || "Delete failed");
  return await res.json();
}

export async function fetchMetrics() {
  try {
    const res = await fetch(`${BASE_URL}/metrics`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) return await res.json();
  } catch (e) {}
  return {
    totalDevices: 3,
    totalStorageDevices: 2,
    totalPeripherals: 1,
    totalHubs: 0,
    quarantinedCount: 1,
    spoofAttempts: 1,
    unsignedDrivers: 1,
    avgTrustScore: 78,
    onlineAgents: 1,
    endpointStatus: "Protected (Demo Mode)",
    activeSessions: 2,
    totalSessions: 3,
    policyViolations: 1,
    malwareAlerts: 0,
    threatFeedMatches: 1,
  };
}

export async function triggerLiveScan() {
  try {
    const res = await fetch(`${BASE_URL}/scan`, {
      method: "POST",
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return { status: "Demo scan completed", timestamp: new Date().toISOString() };
}
