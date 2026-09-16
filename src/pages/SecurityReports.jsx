import React, { useState } from "react";
import { triggerLiveScan, fetchDevices, fetchAuditLogs, fetchEndpointInfo } from "../api";

export default function SecurityReports() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState("");

  const handleExport = async (format) => {
    setIsScanning(true);
    setScanStatus("Performing live Windows endpoint scan...");

    let scanRes;
    try {
      scanRes = await triggerLiveScan();
    } catch (e) {
      scanRes = { status: e.message };
    }

    if (scanRes && scanRes.error) {
      setScanStatus(`Scan failed: ${scanRes.error} — exporting cached data`);
    } else {
      setScanStatus(`Scan completed. Generating ${format.toUpperCase()} report...`);
    }

    const endpoint = await fetchEndpointInfo();
    const devices = await fetchDevices();
    const logs = await fetchAuditLogs();

    setTimeout(() => {
      if (format === "csv") {
        // Proper CSV generation for audit logs
        const headers = ["timestamp", "endpoint", "user", "action", "device", "severity"];
        const rows = logs.map((l) =>
          headers.map((h) => `"${String(l[h] ?? "").replace(/"/g, '""')}"`).join(",")
        );
        const csvContent = [headers.join(","), ...rows].join("\r\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `USB_Security_Report_${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } else {
        const reportData = {
          scanTime: new Date().toISOString(),
          endpoint: endpoint,
          connectedDevices: devices,
          auditSummary: logs,
        };
        const dataStr =
          "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `USB_Security_Report_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      }

      setIsScanning(false);
      setScanStatus("");
    }, 800);
  };

  return (
    <div
      className="flex-col gap-3"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div
        className="flex justify-between items-center"
        style={{ marginBottom: "8px", flexShrink: 0 }}
      >
        <div>
          <h1 className="heading-1" style={{ margin: 0 }}>
            Security Reports
          </h1>
          <p className="text-subtitle">
            On-demand compliance reports powered by live endpoint scanning
          </p>
        </div>
      </div>

      {isScanning && (
        <div
          style={{
            backgroundColor: "var(--color-blue-50)",
            border: "1px solid var(--color-blue-200)",
            borderRadius: "8px",
            padding: "16px",
            color: "var(--color-blue-800)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span className="material-symbols-rounded pulse">sync</span>
          <span style={{ fontSize: "13px", fontWeight: 600 }}>{scanStatus}</span>
        </div>
      )}

      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-3)" }}
      >
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 className="heading-3" style={{ margin: 0 }}>
            Executive USB Audit Report
          </h3>
          <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", margin: 0 }}>
            Comprehensive overview of connected USB hardware, driver signatures, and policy
            enforcement metrics.
          </p>
          <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
            <button
              className="btn btn-primary"
              onClick={() => handleExport("json")}
              disabled={isScanning}
            >
              <span className="material-symbols-rounded">download</span> Export JSON
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleExport("csv")}
              disabled={isScanning}
            >
              <span className="material-symbols-rounded">download</span> Export CSV
            </button>
          </div>
        </div>

        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 className="heading-3" style={{ margin: 0 }}>
            Forensic Data Loss Prevention Log
          </h3>
          <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", margin: 0 }}>
            Includes exact file transfer logs, source paths, user Security Identifiers (SIDs), and
            computed SHA-256 hashes.
          </p>
          <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
            <button
              className="btn btn-primary"
              onClick={() => handleExport("json")}
              disabled={isScanning}
            >
              <span className="material-symbols-rounded">download</span> Export JSON
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleExport("csv")}
              disabled={isScanning}
            >
              <span className="material-symbols-rounded">download</span> Export CSV
            </button>
          </div>
        </div>

        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 className="heading-3" style={{ margin: 0 }}>
            Threat & Incident History
          </h3>
          <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", margin: 0 }}>
            Detailed breakdown of unrecognized USB insertions, blocklist matches, and quarantine
            actions.
          </p>
          <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
            <button
              className="btn btn-primary"
              onClick={() => handleExport("json")}
              disabled={isScanning}
            >
              <span className="material-symbols-rounded">download</span> Export JSON
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleExport("csv")}
              disabled={isScanning}
            >
              <span className="material-symbols-rounded">download</span> Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
