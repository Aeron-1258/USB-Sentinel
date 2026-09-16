import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { fetchDevices, getActiveMode } from "../api";

export default function LiveMonitoring({ onDeviceClick }) {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [mode, setMode] = useState("CHECKING"); // 'LIVE' or 'DEMO'
  const [highlightedId, setHighlightedId] = useState(null);
  const [eventCount, setEventCount] = useState(0);

  const loadData = async () => {
    const data = await fetchDevices();
    setDevices(data);
    setMode(getActiveMode());
  };

  useEffect(() => {
    loadData();

    // Socket.IO connection attempt
    const socket = io("http://localhost:3001", {
      reconnectionAttempts: 2,
      timeout: 3000,
    });

    socket.on("connect", () => {
      setMode("LIVE");
    });

    socket.on("connect_error", () => {
      setMode("DEMO");
    });

    socket.on("initial_devices", (data) => {
      setDevices(data);
      setMode("LIVE");
    });

    socket.on("usb_inserted", (device) => {
      setDevices((prev) => [device, ...prev.filter((d) => d.id !== device.id)]);
      setHighlightedId(device.id);
      setEventCount((c) => c + 1);
      setTimeout(() => setHighlightedId(null), 4000);
    });

    socket.on("usb_removed", (payload) => {
      setDevices((prev) => prev.filter((d) => !(d.vid === payload.vid && d.pid === payload.pid)));
      setEventCount((c) => c + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const isStorageDevice = (d) =>
    d.isStorage === true || d.category === "Storage" || (d.mountPoint && d.mountPoint !== "N/A");
  const totalConnected = devices.length;
  const storageDevices = devices.filter(isStorageDevice);
  const peripheralCount = devices.filter(
    (d) =>
      !isStorageDevice(d) &&
      (d.category === "Peripheral" || d.class === "HIDClass" || d.class === "Bluetooth")
  ).length;
  const hubCount = devices.filter((d) => d.isHub || d.category === "Hub").length;
  const storageCount = storageDevices.length;
  const authorizedCount = devices.filter((d) => d.status === "Authorized" || !d.status).length;
  const blockedCount = devices.filter((d) => d.status === "Blocked").length;
  const unknownCount = devices.filter((d) => d.vid === "Unknown").length;
  const highRiskCount = devices.filter((d) => d.riskScore > 50 || d.vid === "Unknown").length;
  const quarantinedCount = devices.filter((d) => d.status === "Quarantined").length;
  const overallSecurityScore = totalConnected > 0 ? (highRiskCount > 0 ? 78 : 98) : 100;

  const getStatusBadge = (status) => {
    switch (status) {
      case "Authorized":
      case "OK":
        return <span className="badge badge-success">Authorized</span>;
      case "Blocked":
        return <span className="badge badge-danger">Blocked</span>;
      case "Quarantined":
        return <span className="badge badge-purple">Quarantined</span>;
      case "Read Only":
        return <span className="badge badge-warning">Read-Only</span>;
      default:
        return <span className="badge badge-success">Connected</span>;
    }
  };

  const getSignatureBadge = (isSigned, vid) => {
    if (vid === "Unknown") return <span className="badge badge-danger">Unverified / Unsigned</span>;
    if (isSigned !== false) return <span className="badge badge-success">Verified Signature</span>;
    return <span className="badge badge-warning">Unsigned Driver</span>;
  };

  return (
    <div
      className="flex-col gap-3"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 1. PAGE HEADER WITH DUAL MODE BADGE */}
      <div
        className="flex justify-between items-center"
        style={{ marginBottom: "4px", flexShrink: 0 }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h1 className="heading-1" style={{ margin: 0 }}>
              Live USB Monitoring
            </h1>
            {mode === "LIVE" ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "var(--color-green-50)",
                  color: "var(--color-green-600)",
                  padding: "4px 12px",
                  borderRadius: "16px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                <span className="material-symbols-rounded pulse" style={{ fontSize: "14px" }}>
                  fiber_manual_record
                </span>
                LIVE ENTERPRISE MODE
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "var(--color-yellow-50)",
                  color: "var(--color-yellow-700)",
                  padding: "4px 12px",
                  borderRadius: "16px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                <span className="material-symbols-rounded" style={{ fontSize: "14px" }}>
                  play_circle
                </span>
                DEMO MODE (PREVIEW)
              </div>
            )}
          </div>
          <p className="text-subtitle" style={{ margin: "2px 0 0 0" }}>
            Real-time PnP hardware telemetry, forensic connection analysis, and instant security
            enforcement.
          </p>
        </div>
      </div>

      {/* 2. SUMMARY CARDS — Storage is the DLP-relevant count */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gap: "var(--space-2)",
          flexShrink: 0,
        }}
      >
        <div
          className="card"
          style={{
            padding: "12px 14px",
            borderLeft:
              storageCount === 0
                ? "3px solid var(--color-green-500)"
                : "3px solid var(--color-blue-500)",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "var(--color-text-tertiary)",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Removable Storage
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              marginTop: "4px",
              color: storageCount > 0 ? "var(--color-blue-600)" : "var(--color-green-600)",
            }}
          >
            {storageCount}
          </div>
          <div
            style={{ fontSize: "10px", color: "var(--color-text-tertiary)", marginTop: "2px" }}
            title="Total PnP includes all USB peripherals; Storage = removable drives only."
          >
            Total PnP: {totalConnected}
            {hubCount
              ? ` (${peripheralCount} periph + ${hubCount} hubs)`
              : ` (${peripheralCount} periph)`}
          </div>
        </div>
        <div className="card" style={{ padding: "12px 14px" }}>
          <div
            style={{
              fontSize: "11px",
              color: "var(--color-green-600)",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Authorized
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              marginTop: "4px",
              color: "var(--color-green-600)",
            }}
          >
            {authorizedCount}
          </div>
        </div>
        <div className="card" style={{ padding: "12px 14px" }}>
          <div
            style={{
              fontSize: "11px",
              color: "var(--color-red-600)",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Blocked
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              marginTop: "4px",
              color: "var(--color-red-600)",
            }}
          >
            {blockedCount}
          </div>
        </div>
        <div className="card" style={{ padding: "12px 14px" }}>
          <div
            style={{
              fontSize: "11px",
              color: "var(--color-yellow-600)",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Unknown
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              marginTop: "4px",
              color: "var(--color-yellow-600)",
            }}
          >
            {unknownCount}
          </div>
        </div>
        <div className="card" style={{ padding: "12px 14px" }}>
          <div
            style={{
              fontSize: "11px",
              color: "var(--color-orange-600)",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            High Risk
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              marginTop: "4px",
              color: "var(--color-orange-600)",
            }}
          >
            {highRiskCount}
          </div>
        </div>
        <div className="card" style={{ padding: "12px 14px" }}>
          <div
            style={{
              fontSize: "11px",
              color: "var(--color-purple-600)",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Quarantined
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              marginTop: "4px",
              color: "var(--color-purple-600)",
            }}
          >
            {quarantinedCount}
          </div>
        </div>
        <div className="card" style={{ padding: "12px 14px" }}>
          <div
            style={{
              fontSize: "11px",
              color: "var(--color-text-tertiary)",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Live Events
          </div>
          <div style={{ fontSize: "20px", fontWeight: 700, marginTop: "4px" }}>{eventCount}</div>
        </div>
        <div className="card" style={{ padding: "12px 14px" }}>
          <div
            style={{
              fontSize: "11px",
              color: "var(--color-green-600)",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Security Score
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              marginTop: "4px",
              color: "var(--color-green-600)",
            }}
          >
            {overallSecurityScore}/100
          </div>
        </div>
      </div>

      {/* 3. MONITORING ASSET FEED TABLE */}
      <div
        className="card"
        style={{
          flex: 1,
          padding: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            backgroundColor: "var(--color-surface)",
            borderBottom: "1px solid var(--color-border-light)",
            display: "flex",
            padding: "12px 16px",
            fontWeight: 600,
            color: "var(--color-text-secondary)",
            fontSize: "13px",
            zIndex: 1,
          }}
        >
          <div style={{ width: "220px" }}>Device Asset & Class</div>
          <div style={{ width: "140px" }}>Hardware ID (VID:PID)</div>
          <div style={{ flex: 1 }}>Forensic Connection Panel</div>
          <div style={{ width: "160px" }}>Signature & Trust</div>
          <div style={{ width: "140px" }}>Security Status</div>
          <div style={{ width: "140px", textAlign: "right" }}>Quick Actions</div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {devices.map((dev) => {
            const isHighlighted = dev.id === highlightedId;
            const mountPoint = dev.mountPoint || dev.connection?.mountPoint || "N/A";
            const fileSystem = dev.fileSystem || dev.connection?.filesystem || "N/A";
            const capacity = dev.capacity || dev.connection?.capacity || "N/A";
            const trustScore = dev.trustScore || 90;

            return (
              <div
                key={dev.id}
                style={{
                  display: "flex",
                  padding: "16px",
                  borderBottom: "1px solid var(--color-border-light)",
                  fontSize: "13px",
                  alignItems: "center",
                  backgroundColor: isHighlighted ? "var(--color-blue-50)" : "transparent",
                  transition: "background-color 0.5s ease",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedDevice(dev)}
              >
                <div style={{ width: "220px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      backgroundColor: "var(--color-blue-50)",
                      color: "var(--color-blue-600)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span className="material-symbols-rounded">usb</span>
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        color: "var(--color-text-primary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {dev.name}
                      <span
                        style={{
                          fontSize: "9px",
                          padding: "2px 6px",
                          borderRadius: "10px",
                          fontWeight: 700,
                          backgroundColor:
                            dev.isStorage || dev.category === "Storage"
                              ? "var(--color-blue-50)"
                              : dev.category === "Hub"
                                ? "var(--color-yellow-50)"
                                : "var(--color-green-50)",
                          color:
                            dev.isStorage || dev.category === "Storage"
                              ? "var(--color-blue-600)"
                              : dev.category === "Hub"
                                ? "var(--color-yellow-700)"
                                : "var(--color-text-secondary)",
                          border: "1px solid var(--color-border-light)",
                        }}
                      >
                        {dev.category ||
                          (dev.isStorage || dev.mountPoint !== "N/A" ? "Storage" : "Peripheral")}
                      </span>
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>
                      {dev.manufacturer || dev.vendor || "Generic"} • {dev.class || "USB"}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--color-text-tertiary)",
                        fontFamily: "monospace",
                      }}
                    >
                      {dev.serial}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    width: "140px",
                    fontFamily: "monospace",
                    color: "var(--color-text-secondary)",
                    fontSize: "12px",
                  }}
                >
                  <div>VID: {dev.vid}</div>
                  <div>PID: {dev.pid}</div>
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      color: "var(--color-text-secondary)",
                      fontSize: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>
                        hard_drive
                      </span>
                      {mountPoint} ({fileSystem})
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>
                        sd_storage
                      </span>
                      {capacity}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>
                        speed
                      </span>
                      SuperSpeed (USB 3.0)
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--color-text-tertiary)",
                      marginTop: "4px",
                    }}
                  >
                    First Seen: {dev.timestamp || "Just now"} | Port: #0002.Hub_#0001
                  </div>
                </div>

                <div style={{ width: "160px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "4px",
                    }}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "6px",
                        backgroundColor: "var(--color-border-light)",
                        borderRadius: "3px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${trustScore}%`,
                          height: "100%",
                          backgroundColor:
                            trustScore >= 80
                              ? "var(--color-green-500)"
                              : trustScore >= 50
                                ? "var(--color-orange-500)"
                                : "var(--color-red-500)",
                        }}
                      />
                    </div>
                    <span style={{ fontWeight: 600, fontSize: "12px" }}>{trustScore}/100</span>
                  </div>
                  {getSignatureBadge(dev.isSigned, dev.vid)}
                </div>

                <div style={{ width: "140px" }}>{getStatusBadge(dev.status || "Authorized")}</div>

                <div
                  style={{
                    width: "140px",
                    display: "flex",
                    gap: "4px",
                    justifyContent: "flex-end",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="btn-icon"
                    title="👁 View Details"
                    onClick={() => setSelectedDevice(dev)}
                  >
                    <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>
                      visibility
                    </span>
                  </button>
                  <button
                    className="btn-icon"
                    style={{ color: "var(--color-green-600)" }}
                    title="✅ Allow Device"
                  >
                    <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>
                      check_circle
                    </span>
                  </button>
                  <button
                    className="btn-icon"
                    style={{ color: "var(--color-red-600)" }}
                    title="🚫 Block Device"
                  >
                    <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>
                      block
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
