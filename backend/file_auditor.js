const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const db = require("./db");

// Calculates real MD5 and SHA-256 hashes of any file
function computeHashes(filePath) {
  try {
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      return { md5: "N/A", sha256: "N/A" };
    }
    const buffer = fs.readFileSync(filePath);
    const md5 = crypto.createHash("md5").update(buffer).digest("hex");
    const sha256 = crypto.createHash("sha256").update(buffer).digest("hex");
    return { md5, sha256 };
  } catch (e) {
    return { md5: "N/A", sha256: "N/A" };
  }
}

class FileAuditor {
  constructor(io) {
    this.io = io;
    this.watchers = new Map();
  }

  // Watch drive letter (e.g. E:\)
  watchDrive(drivePath, deviceName) {
    if (this.watchers.has(drivePath) || !fs.existsSync(drivePath)) return;

    console.log(`[FileAuditor] Starting real-time watcher on removable drive ${drivePath}`);

    try {
      const watcher = fs.watch(drivePath, { recursive: true }, (eventType, filename) => {
        if (!filename) return;

        const fullPath = path.join(drivePath, filename);

        // Skip hidden files or system volume info
        if (filename.includes("System Volume Information") || filename.startsWith(".")) return;

        let stats = { size: 0 };
        try {
          if (fs.existsSync(fullPath)) {
            stats = fs.statSync(fullPath);
          }
        } catch (e) {}

        const hashes =
          eventType !== "rename" ? computeHashes(fullPath) : { md5: "N/A", sha256: "N/A" };

        const fileEvt = {
          id: `FEV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
          user: "sec_admin",
          filename: filename,
          action: eventType === "rename" ? "File Renamed / Moved" : "File Modified / Written",
          source: fullPath,
          destination: drivePath,
          size: `${(stats.size / 1024).toFixed(1)} KB`,
          usbDevice: deviceName,
          hash: hashes.sha256,
          md5: hashes.md5,
          policyAction: "Logged",
        };

        // Save to DB and emit to frontend via WebSocket
        db.addFileEvent(fileEvt);
        this.io.emit("file_event", fileEvt);

        // Also record as system audit log
        db.addAuditLog({
          id: `AUD-${Date.now()}`,
          timestamp: fileEvt.timestamp,
          endpoint: "SECURE-ENDPOINT-01",
          user: "sec_admin",
          process: "explorer.exe",
          pid: 4812,
          ppid: 1024,
          executable: "C:\\Windows\\explorer.exe",
          action: fileEvt.action,
          device: deviceName,
          vid: "0xUSB",
          devicePid: "0xDEV",
          serial: "SN-LIVE",
          hash: hashes.sha256,
          result: "Success",
          severity: "Low",
          policy: "Audit Mode",
        });
      });

      this.watchers.set(drivePath, watcher);
    } catch (err) {
      console.error(`[FileAuditor] Could not watch ${drivePath}:`, err.message);
    }
  }

  unwatchDrive(drivePath) {
    if (this.watchers.has(drivePath)) {
      this.watchers.get(drivePath).close();
      this.watchers.delete(drivePath);
      console.log(`[FileAuditor] Stopped watching drive ${drivePath}`);
    }
  }
}

module.exports = FileAuditor;
