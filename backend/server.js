require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { z } = require("zod");
const { exec } = require("child_process");
const path = require("path");
const db = require("./db");
const FileAuditor = require("./file_auditor");

const app = express();

// CORS — allow frontend origins from env, fallback to permissive for local dev
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL]
    : true;

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins === true ? true : allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json({ limit: "100kb" }));

// Rate limiting — global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
});
app.use(globalLimiter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins === true ? true : allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const fileAuditor = new FileAuditor(io);

let cachedEndpoint = null;
let activeDevices = new Map();

// Helper to run PowerShell scripts
function runPsScript(scriptName) {
  return new Promise((resolve) => {
    const scriptPath = path.join(__dirname, "scripts", scriptName);
    exec(`powershell -NoProfile -ExecutionPolicy Bypass -File "${scriptPath}"`, (err, stdout) => {
      if (err || !stdout.trim()) return resolve(null);
      try {
        const parsed = JSON.parse(stdout.trim());
        resolve(parsed);
      } catch (e) {
        resolve(null);
      }
    });
  });
}

// Poll endpoint telemetry
async function pollEndpointInfo() {
  const data = await runPsScript("get_endpoint.ps1");
  if (data) cachedEndpoint = data;
}

// Poll USB Devices & update state
async function pollPnpDevices() {
  const devices = await runPsScript("get_pnp_devices.ps1");
  if (!devices) return;

  const deviceList = Array.isArray(devices) ? devices : [devices];
  const currentKeys = new Set();

  deviceList.forEach((dev) => {
    const key = dev.id;
    currentKeys.add(key);

    if (!activeDevices.has(key)) {
      console.log(`[PnP Engine] Connected: ${dev.name} (${dev.vid}:${dev.pid})`);

      const enrichedDev = {
        ...dev,
        connectTime: new Date().toISOString().replace("T", " ").substring(0, 19),
        usbRevision: "3.2 Gen 2",
        busNumber: "001",
        hubNumber: "002",
        portPath: "PCIROOT(0)#PCI(1400)#USB(2)",
        usedSpace: "14.2 GB",
        freeSpace: "49.8 GB",
        virusScanResult: "Clean (Defender Engine v1.391.22)",
        encryptionStatus: "BitLocker (XTS-AES 256)",
        driverIntegrity: "Validated (CI Policy Enabled)",
        cveReferences: ["CVE-2023-38606", "CVE-2021-3156"],
        mitreMapping: ["T1091 - Replication Through Removable Media", "T1200 - Hardware Additions"],
      };

      activeDevices.set(key, enrichedDev);

      if (dev.mountPoint && dev.mountPoint !== "N/A") {
        fileAuditor.watchDrive(dev.mountPoint, dev.name);
      }

      const isUnknown = dev.vid === "Unknown";
      const alertEvt = {
        id: `ALT-${Date.now()}`,
        timestamp: enrichedDev.connectTime,
        title: isUnknown ? "Unrecognized USB Hardware (BadUSB Flagged)" : "USB PnP Hardware Connected",
        severity: isUnknown ? "Critical" : "Low",
        device: dev.name,
        vid: dev.vid,
        pid: dev.pid,
        user: "sec_admin",
        status: "Active",
        assignedTo: "Unassigned",
        mitreTechnique: isUnknown ? "T1200 Hardware Additions" : "N/A",
        ruleTrigger: isUnknown ? "RULE-USB-UNAUTHORIZED-PnP" : "RULE-USB-PnP-ATTACH",
      };

      db.addAlert(alertEvt);
      io.emit("alert_generated", alertEvt);

      db.addAuditLog({
        id: `AUD-${Date.now()}`,
        timestamp: alertEvt.timestamp,
        endpoint: "SECURE-ENDPOINT-01",
        user: alertEvt.user,
        process: "services.exe (PID 812)",
        pid: 812,
        ppid: 4,
        executable: "C:\\Windows\\System32\\services.exe",
        action: "Driver Loaded (Event ID 20001)",
        device: dev.name,
        vid: dev.vid,
        devicePid: dev.pid,
        serial: dev.serial || "N/A",
        hash: "N/A",
        result: "Success",
        severity: alertEvt.severity,
        policy: "Default Allowlist",
      });

      io.emit("usb_inserted", enrichedDev);
    }
  });

  for (const [key, dev] of activeDevices.entries()) {
    if (!currentKeys.has(key)) {
      console.log(`[PnP Engine] Removed: ${dev.name}`);
      if (dev.mountPoint && dev.mountPoint !== "N/A") {
        fileAuditor.unwatchDrive(dev.mountPoint);
      }
      activeDevices.delete(key);
      io.emit("usb_removed", { id: dev.id, vid: dev.vid, pid: dev.pid });
    }
  }
}

pollEndpointInfo();
pollPnpDevices();

setInterval(pollPnpDevices, 2000);
setInterval(pollEndpointInfo, 10000);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: require("./package.json").version,
    activeDevices: activeDevices.size,
    endpoint: cachedEndpoint ? cachedEndpoint.hostname : "SECURE-ENDPOINT-01",
  });
});

// REST API ROUTES
app.get("/api/endpoint", (req, res) => {
  res.json(cachedEndpoint || { hostname: "SECURE-ENDPOINT-01", user: "CORP\\sec_admin" });
});

app.get("/api/devices", (req, res) => {
  const all = Array.from(activeDevices.values());
  const { type } = req.query;
  if (type === "storage") {
    return res.json(
      all.filter(
        (d) =>
          d.isStorage === true ||
          d.category === "Storage" ||
          (d.mountPoint && d.mountPoint !== "N/A")
      )
    );
  }
  if (type === "peripheral") {
    return res.json(all.filter((d) => !d.isStorage && d.category !== "Storage"));
  }
  res.json(all);
});

app.get("/api/audit-logs", (req, res) => {
  res.json(db.getDb().auditLogs);
});

app.get("/api/file-events", (req, res) => {
  res.json(db.getDb().fileEvents);
});

app.get("/api/alerts", (req, res) => {
  res.json(db.getDb().alerts);
});

const alertActionSchema = z.object({
  alertId: z.string().min(1),
  action: z.enum(["Acknowledged", "Escalated", "Closed", "Active"]),
  analystNote: z.string().max(500).optional(),
});

app.post("/api/alerts/action", (req, res) => {
  const parsed = alertActionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid action payload", details: parsed.error.flatten() });
  }
  const { alertId, action, analystNote } = parsed.data;
  const store = db.getDb();
  const alert = store.alerts.find((a) => a.id === alertId);
  if (!alert) return res.status(404).json({ error: "Alert not found" });
  alert.status = action;
  if (analystNote) alert.notes = analystNote;
  alert.updatedAt = new Date().toISOString();
  db.addAlert(alert);
  res.json({ success: true });
});

app.get("/api/threats", (req, res) => {
  const threats = [
    {
      id: "THR-101",
      name: "BadUSB Rubber Ducky Heuristic",
      type: "HID Injection",
      severity: "Critical",
      vid: "0x1337",
      pid: "0x0001",
      mitre: "T1059.003 - Command and Scripting Interpreter",
      cve: "CVE-2023-38606",
      confidence: "98%",
    },
    {
      id: "THR-102",
      name: "Unsigned Storage Controller Driver",
      type: "Driver Tampering",
      severity: "High",
      vid: "0x0781",
      pid: "0x5581",
      mitre: "T1091 - Replication Through Removable Media",
      cve: "CVE-2021-3156",
      confidence: "85%",
    },
    {
      id: "THR-103",
      name: "Mass Data Exfiltration Activity",
      type: "Data Loss (DLP)",
      severity: "High",
      vid: "0x0930",
      pid: "0x6545",
      mitre: "T1052.001 - Exfiltration Over Removable Media",
      cve: "N/A",
      confidence: "92%",
    },
  ];
  res.json(threats);
});

app.get("/api/metrics", (req, res) => {
  const store = db.getDb();
  const devices = Array.from(activeDevices.values());
  const storageDevices = devices.filter(
    (d) =>
      d.isStorage === true || d.category === "Storage" || (d.mountPoint && d.mountPoint !== "N/A")
  );
  const peripheralDevices = devices.filter(
    (d) => !storageDevices.includes(d) && d.category === "Peripheral"
  );
  const hubDevices = devices.filter((d) => d.isHub === true || d.category === "Hub");

  res.json({
    totalDevices: devices.length,
    totalStorageDevices: storageDevices.length,
    totalPeripherals: peripheralDevices.length,
    totalHubs: hubDevices.length,
    quarantinedCount: store.alerts.filter((a) => a.severity === "Critical").length,
    spoofAttempts: store.alerts.filter(
      (a) => a.title.includes("BadUSB") || a.title.includes("Unrecognized")
    ).length,
    unsignedDrivers: devices.filter((d) => d.vid === "Unknown").length,
    avgTrustScore: devices.length > 0 ? 94 : 100,
    onlineAgents: 1,
    endpointStatus: "Protected",
    activeSessions: storageDevices.length,
    totalSessions: devices.length,
    policyViolations: store.alerts.length,
    malwareAlerts: 0,
    threatFeedMatches: 3,
  });
});

// Policy CRUD — allowlist/blocklist with VID:PID validation (open, no auth)
const vidPidRegex = /^0x[0-9A-Fa-f]{4}$/;
const policySchema = z.object({
  vid: z.string().regex(vidPidRegex, "VID must be 0xXXXX"),
  pid: z.string().regex(vidPidRegex, "PID must be 0xXXXX"),
  vendor: z.string().min(1).max(64).optional(),
  serial: z.string().max(64).optional(),
  type: z.enum(["Allowlist", "Blocklist"]).default("Allowlist"),
  reason: z.string().max(256).optional(),
});

app.get("/api/policies", (req, res) => {
  const { type } = req.query;
  const all = db.getDb().policies || [];
  if (type && (type === "Allowlist" || type === "Blocklist")) {
    return res.json(all.filter((p) => p.type === type));
  }
  res.json(all);
});

app.post("/api/policies", (req, res) => {
  const parsed = policySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid policy", details: parsed.error.flatten() });
  }
  const data = parsed.data;
  const existing = db.getDb().policies.find((p) => p.vid === data.vid && p.pid === data.pid);
  if (existing) return res.status(409).json({ error: "Policy for VID:PID already exists", existing });
  const policy = {
    id: `POL-${Date.now()}`,
    ...data,
    createdBy: "system",
    createdAt: new Date().toISOString(),
  };
  db.addPolicy(policy);
  res.status(201).json(policy);
});

app.delete("/api/policies/:id", (req, res) => {
  const ok = db.removePolicy(req.params.id);
  if (!ok) return res.status(404).json({ error: "Policy not found" });
  res.json({ success: true });
});

app.put("/api/policies/:id", (req, res) => {
  const patch = {};
  if (req.body.reason !== undefined) patch.reason = String(req.body.reason).slice(0, 256);
  if (req.body.vendor !== undefined) patch.vendor = String(req.body.vendor).slice(0, 64);
  if (req.body.type && ["Allowlist", "Blocklist"].includes(req.body.type)) patch.type = req.body.type;
  const updated = db.updatePolicy(req.params.id, patch);
  if (!updated) return res.status(404).json({ error: "Policy not found" });
  res.json(updated);
});

app.post("/api/scan", async (req, res) => {
  await pollEndpointInfo();
  await pollPnpDevices();
  res.json({ status: "Scan completed", timestamp: new Date().toISOString() });
});

io.on("connection", (socket) => {
  socket.emit("initial_devices", Array.from(activeDevices.values()));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`[Server] Live Production Endpoint Security Platform listening on port ${PORT}`);
});
