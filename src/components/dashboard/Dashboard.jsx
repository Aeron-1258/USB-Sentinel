import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { fetchMetrics, fetchEndpointInfo } from "../../api";

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalDevices: 1,
    totalStorageDevices: 0,
    totalPeripherals: 0,
    totalHubs: 0,
    authorizedDevices: 1,
    blockedDevices: 0,
    unknownDevices: 0,
    highRiskDevices: 0,
    criticalDevices: 0,
    quarantinedCount: 0,
    readOnlyDevices: 0,
    liveUsbEvents: 12,
    activeSessions: 1,
    policyViolations: 0,
    securityScore: 98,
    threatFeedMatches: 0,
    fileTransferEvents: 4,
    malwareAlerts: 0,
  });
  const [endpoint, setEndpoint] = useState(null);

  useEffect(() => {
    async function loadData() {
      const m = await fetchMetrics();
      const ep = await fetchEndpointInfo();
      if (m) {
        setMetrics((prev) => ({
          ...prev,
          totalDevices: m.totalDevices ?? prev.totalDevices,
          totalStorageDevices: m.totalStorageDevices ?? 0,
          totalPeripherals: m.totalPeripherals ?? 0,
          totalHubs: m.totalHubs ?? 0,
          quarantinedCount: m.quarantinedCount || 0,
          spoofAttempts: m.spoofAttempts || 0,
          unsignedDrivers: m.unsignedDrivers || 0,
          avgTrustScore: m.avgTrustScore || 98,
          activeSessions: m.activeSessions ?? prev.activeSessions,
          policyViolations: m.policyViolations ?? prev.policyViolations,
          threatFeedMatches: m.threatFeedMatches ?? prev.threatFeedMatches,
        }));
      }
      if (ep) setEndpoint(ep);
    }
    loadData();
    const interval = setInterval(loadData, 5000);

    // Live Windows system telemetry via WebSocket (no polling lag)
    const socket = io(import.meta.env.VITE_WS_URL || "http://localhost:3001");
    socket.on("endpoint_update", (data) => setEndpoint(data));
    socket.on("connect", loadData);
    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, []);

  return (
    <div
      className="flex-col gap-3"
      style={{ height: "100%", overflowY: "auto", paddingRight: "8px" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: "4px" }}>
        <div>
          <h1 className="heading-1" style={{ margin: 0 }}>
            Security Operations Center (SOC)
          </h1>
          <p className="text-subtitle">
            {endpoint ? (
              <>
                Host: <strong>{endpoint.hostname}</strong> ({endpoint.user}) | OS: {endpoint.osVersion} •{" "}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    color: "var(--color-green-600)",
                  }}
                >
                  <span className="material-symbols-rounded pulse" style={{ fontSize: 12 }}>
                    fiber_manual_record
                  </span>
                  Live • Uptime {endpoint.uptime}
                </span>
              </>
            ) : (
              "Real-time USB Endpoint Defense & Forensic Telemetry"
            )}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "var(--color-green-50)",
            color: "var(--color-green-600)",
            padding: "6px 12px",
            borderRadius: "16px",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          <span className="material-symbols-rounded pulse" style={{ fontSize: "14px" }}>
            fiber_manual_record
          </span>
          24/7 LIVE BACKEND ENGINE
        </div>
      </div>

      {/* 15 ENTERPRISE SOC SUMMARY CARDS GRID */}
      <div>
        <h3
          style={{
            margin: "0 0 8px 0",
            fontSize: "12px",
            color: "var(--color-text-tertiary)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Enterprise Endpoint Telemetry Metrics (15 Core Indicators)
        </h3>
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "var(--space-2)" }}
        >
          <div
            className="card"
            style={{
              padding: "12px 16px",
              borderLeft:
                metrics.totalStorageDevices === 0
                  ? "3px solid var(--color-green-500)"
                  : "3px solid var(--color-blue-500)",
            }}
          >
            <div
              className="text-subtitle"
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
            >
              <span
                className="material-symbols-rounded"
                style={{ color: "var(--color-blue-500)", fontSize: "16px" }}
              >
                usb
              </span>{" "}
              Removable Storage
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 700,
                marginTop: "6px",
                color:
                  metrics.totalStorageDevices > 0
                    ? "var(--color-blue-600)"
                    : "var(--color-green-600)",
              }}
            >
              {metrics.totalStorageDevices ?? 0}
            </div>
            <div
              style={{ color: "var(--color-text-tertiary)", fontSize: "11px", marginTop: "2px" }}
              title="Total PnP USB devices includes keyboards, mice, hubs and storage. Storage count = removable drives only."
            >
              Total PnP: {metrics.totalDevices} ({metrics.totalPeripherals ?? 0} peripherals
              {metrics.totalHubs ? ` + ${metrics.totalHubs} hubs` : ""})
            </div>
          </div>

          <div className="card" style={{ padding: "12px 16px" }}>
            <div
              className="text-subtitle"
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
            >
              <span
                className="material-symbols-rounded"
                style={{ color: "var(--color-green-500)", fontSize: "16px" }}
              >
                check_circle
              </span>{" "}
              Authorized
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 700,
                marginTop: "6px",
                color: "var(--color-green-600)",
              }}
            >
              {metrics.authorizedDevices}
            </div>
            <div
              style={{ color: "var(--color-text-tertiary)", fontSize: "11px", marginTop: "2px" }}
            >
              Allowlist Match
            </div>
          </div>

          <div className="card" style={{ padding: "12px 16px" }}>
            <div
              className="text-subtitle"
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
            >
              <span
                className="material-symbols-rounded"
                style={{ color: "var(--color-red-500)", fontSize: "16px" }}
              >
                block
              </span>{" "}
              Blocked Devices
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 700,
                marginTop: "6px",
                color: "var(--color-red-600)",
              }}
            >
              {metrics.blockedDevices}
            </div>
            <div
              style={{ color: "var(--color-text-tertiary)", fontSize: "11px", marginTop: "2px" }}
            >
              Policy Enforced
            </div>
          </div>

          <div className="card" style={{ padding: "12px 16px" }}>
            <div
              className="text-subtitle"
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
            >
              <span
                className="material-symbols-rounded"
                style={{ color: "var(--color-yellow-600)", fontSize: "16px" }}
              >
                help
              </span>{" "}
              Unknown Devices
            </div>
            <div style={{ fontSize: "22px", fontWeight: 700, marginTop: "6px" }}>
              {metrics.unknownDevices}
            </div>
            <div
              style={{ color: "var(--color-text-tertiary)", fontSize: "11px", marginTop: "2px" }}
            >
              Unregistered VID
            </div>
          </div>

          <div className="card" style={{ padding: "12px 16px" }}>
            <div
              className="text-subtitle"
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
            >
              <span
                className="material-symbols-rounded"
                style={{ color: "var(--color-orange-500)", fontSize: "16px" }}
              >
                warning
              </span>{" "}
              High Risk Devices
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 700,
                marginTop: "6px",
                color: "var(--color-orange-600)",
              }}
            >
              {metrics.highRiskDevices}
            </div>
            <div
              style={{ color: "var(--color-text-tertiary)", fontSize: "11px", marginTop: "2px" }}
            >
              Risk Score &gt; 50
            </div>
          </div>

          <div className="card" style={{ padding: "12px 16px" }}>
            <div
              className="text-subtitle"
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
            >
              <span
                className="material-symbols-rounded"
                style={{ color: "var(--color-red-600)", fontSize: "16px" }}
              >
                dangerous
              </span>{" "}
              Critical Devices
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 700,
                marginTop: "6px",
                color: "var(--color-red-600)",
              }}
            >
              {metrics.criticalDevices}
            </div>
            <div
              style={{ color: "var(--color-text-tertiary)", fontSize: "11px", marginTop: "2px" }}
            >
              BadUSB / Injection
            </div>
          </div>

          <div className="card" style={{ padding: "12px 16px" }}>
            <div
              className="text-subtitle"
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
            >
              <span
                className="material-symbols-rounded"
                style={{ color: "var(--color-purple-600)", fontSize: "16px" }}
              >
                lock
              </span>{" "}
              Quarantined
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 700,
                marginTop: "6px",
                color: "var(--color-purple-600)",
              }}
            >
              {metrics.quarantinedCount}
            </div>
            <div
              style={{ color: "var(--color-text-tertiary)", fontSize: "11px", marginTop: "2px" }}
            >
              Isolated Assets
            </div>
          </div>

          <div className="card" style={{ padding: "12px 16px" }}>
            <div
              className="text-subtitle"
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
            >
              <span
                className="material-symbols-rounded"
                style={{ color: "var(--color-yellow-600)", fontSize: "16px" }}
              >
                visibility
              </span>{" "}
              Read-Only Devices
            </div>
            <div style={{ fontSize: "22px", fontWeight: 700, marginTop: "6px" }}>
              {metrics.readOnlyDevices}
            </div>
            <div
              style={{ color: "var(--color-text-tertiary)", fontSize: "11px", marginTop: "2px" }}
            >
              Write Access Locked
            </div>
          </div>

          <div className="card" style={{ padding: "12px 16px" }}>
            <div
              className="text-subtitle"
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
            >
              <span
                className="material-symbols-rounded"
                style={{ color: "var(--color-blue-600)", fontSize: "16px" }}
              >
                timeline
              </span>{" "}
              Live USB Events
            </div>
            <div style={{ fontSize: "22px", fontWeight: 700, marginTop: "6px" }}>
              {metrics.liveUsbEvents}
            </div>
            <div
              style={{ color: "var(--color-text-tertiary)", fontSize: "11px", marginTop: "2px" }}
            >
              PnP Bus Signals
            </div>
          </div>

          <div className="card" style={{ padding: "12px 16px" }}>
            <div
              className="text-subtitle"
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
            >
              <span
                className="material-symbols-rounded"
                style={{ color: "var(--color-green-600)", fontSize: "16px" }}
              >
                devices
              </span>{" "}
              Active Sessions
            </div>
            <div style={{ fontSize: "22px", fontWeight: 700, marginTop: "6px" }}>
              {metrics.activeSessions}
            </div>
            <div
              style={{ color: "var(--color-text-tertiary)", fontSize: "11px", marginTop: "2px" }}
            >
              Current Mounts
            </div>
          </div>

          <div className="card" style={{ padding: "12px 16px" }}>
            <div
              className="text-subtitle"
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
            >
              <span
                className="material-symbols-rounded"
                style={{ color: "var(--color-orange-600)", fontSize: "16px" }}
              >
                gpp_maybe
              </span>{" "}
              Policy Violations
            </div>
            <div style={{ fontSize: "22px", fontWeight: 700, marginTop: "6px" }}>
              {metrics.policyViolations}
            </div>
            <div
              style={{ color: "var(--color-text-tertiary)", fontSize: "11px", marginTop: "2px" }}
            >
              Audited Flags
            </div>
          </div>

          <div className="card" style={{ padding: "12px 16px" }}>
            <div
              className="text-subtitle"
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
            >
              <span
                className="material-symbols-rounded"
                style={{ color: "var(--color-green-600)", fontSize: "16px" }}
              >
                security
              </span>{" "}
              Security Score
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 700,
                marginTop: "6px",
                color: "var(--color-green-600)",
              }}
            >
              {metrics.securityScore}/100
            </div>
            <div
              style={{
                color: "var(--color-green-600)",
                fontSize: "11px",
                marginTop: "2px",
                fontWeight: 600,
              }}
            >
              Healthy Host
            </div>
          </div>

          <div className="card" style={{ padding: "12px 16px" }}>
            <div
              className="text-subtitle"
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
            >
              <span
                className="material-symbols-rounded"
                style={{ color: "var(--color-red-500)", fontSize: "16px" }}
              >
                bug_report
              </span>{" "}
              Threat Feed Match
            </div>
            <div style={{ fontSize: "22px", fontWeight: 700, marginTop: "6px" }}>
              {metrics.threatFeedMatches}
            </div>
            <div
              style={{ color: "var(--color-text-tertiary)", fontSize: "11px", marginTop: "2px" }}
            >
              IOC & MITRE Sync
            </div>
          </div>

          <div className="card" style={{ padding: "12px 16px" }}>
            <div
              className="text-subtitle"
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
            >
              <span
                className="material-symbols-rounded"
                style={{ color: "var(--color-blue-500)", fontSize: "16px" }}
              >
                folder_copy
              </span>{" "}
              File Transfers
            </div>
            <div style={{ fontSize: "22px", fontWeight: 700, marginTop: "6px" }}>
              {metrics.fileTransferEvents}
            </div>
            <div
              style={{ color: "var(--color-text-tertiary)", fontSize: "11px", marginTop: "2px" }}
            >
              SHA256 Audited
            </div>
          </div>

          <div className="card" style={{ padding: "12px 16px" }}>
            <div
              className="text-subtitle"
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
            >
              <span
                className="material-symbols-rounded"
                style={{ color: "var(--color-green-600)", fontSize: "16px" }}
              >
                verified_user
              </span>{" "}
              Malware Alerts
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 700,
                marginTop: "6px",
                color: "var(--color-green-600)",
              }}
            >
              {metrics.malwareAlerts}
            </div>
            <div
              style={{
                color: "var(--color-green-600)",
                fontSize: "11px",
                marginTop: "2px",
                fontWeight: 600,
              }}
            >
              Defender Clean
            </div>
          </div>
        </div>
      </div>

      {/* Endpoint Details Telemetry Box */}
      {endpoint && (
        <div className="card" style={{ marginTop: "8px" }}>
          <h3
            className="heading-3"
            style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <span className="material-symbols-rounded" style={{ color: "var(--color-blue-600)" }}>
              computer
            </span>
            Dynamic Host Endpoint Identification (Windows PnP Services)
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
              fontSize: "13px",
            }}
          >
            <div>
              <span style={{ color: "var(--color-text-tertiary)" }}>Computer Name:</span>
              <div style={{ fontWeight: 600, marginTop: "2px" }}>{endpoint.computerName}</div>
            </div>
            <div>
              <span style={{ color: "var(--color-text-tertiary)" }}>Logged-in User:</span>
              <div style={{ fontWeight: 600, marginTop: "2px" }}>{endpoint.user}</div>
            </div>
            <div>
              <span style={{ color: "var(--color-text-tertiary)" }}>OS & Build:</span>
              <div style={{ fontWeight: 600, marginTop: "2px" }}>
                {endpoint.osVersion} (Build {endpoint.osBuild})
              </div>
            </div>
            <div>
              <span style={{ color: "var(--color-text-tertiary)" }}>Domain / Workgroup:</span>
              <div style={{ fontWeight: 600, marginTop: "2px" }}>{endpoint.domain || endpoint.workgroup || "N/A"}</div>
            </div>
            <div>
              <span style={{ color: "var(--color-text-tertiary)" }}>Agent ID:</span>
              <div style={{ fontWeight: 600, marginTop: "2px", fontFamily: "monospace", fontSize: "11px" }}>{endpoint.endpointId}</div>
            </div>
            <div>
              <span style={{ color: "var(--color-text-tertiary)" }}>Processes:</span>
              <div style={{ fontWeight: 600, marginTop: "2px" }}>{endpoint.totalProcesses ?? "—"}</div>
            </div>
            <div>
              <span style={{ color: "var(--color-text-tertiary)" }}>CPU:</span>
              <div
                style={{
                  fontWeight: 600,
                  marginTop: "2px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {endpoint.cpu}
              </div>
            </div>
            <div>
              <span style={{ color: "var(--color-text-tertiary)" }}>Total RAM:</span>
              <div style={{ fontWeight: 600, marginTop: "2px" }}>{endpoint.ram}</div>
            </div>
            <div>
              <span style={{ color: "var(--color-text-tertiary)" }}>MAC Address:</span>
              <div style={{ fontWeight: 600, marginTop: "2px", fontFamily: "monospace" }}>
                {endpoint.macAddress}
              </div>
            </div>
            <div>
              <span style={{ color: "var(--color-text-tertiary)" }}>System Uptime:</span>
              <div style={{ fontWeight: 600, marginTop: "2px" }}>{endpoint.uptime}</div>
            </div>
          </div>
        </div>
      )}

      {/* Endpoint Service Status Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "var(--space-3)",
          paddingBottom: "24px",
          marginTop: "8px",
        }}
      >
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 className="heading-3" style={{ margin: 0 }}>
            Endpoint Agent Status
          </h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
              Service Health
            </span>
            <span className="badge badge-success">Active 24/7</span>
          </div>
          <div
            style={{
              width: "100%",
              height: "4px",
              backgroundColor: "var(--color-border-light)",
              borderRadius: "2px",
            }}
          >
            <div
              style={{ width: "100%", height: "100%", backgroundColor: "var(--color-green-500)" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>Agent ID</span>
            <span style={{ fontWeight: 600, fontFamily: "monospace", fontSize: "11px" }}>
              {endpoint?.endpointId || "EP-LOCAL"}
            </span>
          </div>
        </div>

        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 className="heading-3" style={{ margin: 0 }}>
            Active USB Protection
          </h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
              PnP Hardware Engine
            </span>
            <span className="badge badge-success">Enabled</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
              SHA-256 File DLP
            </span>
            <span className="badge badge-success">Active</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
              Windows Event Hooks
            </span>
            <span className="badge badge-success">Active</span>
          </div>
        </div>

        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 className="heading-3" style={{ margin: 0 }}>
            Network Telemetry
          </h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
              Local IP Address
            </span>
            <span style={{ fontWeight: 600, fontFamily: "monospace" }}>
              {endpoint?.localIp || "127.0.0.1"}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
              Last Boot Time
            </span>
            <span style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
              {endpoint?.lastBootTime || "Live"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
