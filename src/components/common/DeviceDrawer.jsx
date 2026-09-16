import React from "react";

export default function DeviceDrawer({ device, onClose, onBlock, onAllow }) {
  if (!device) return null;
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", zIndex: 40, backdropFilter: "blur(2px)" }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: 420,
          height: "100vh",
          background: "var(--color-surface)",
          boxShadow: "var(--shadow-float)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          animation: "slideIn 0.24s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "var(--color-text-primary)" }}>{device.name}</div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", fontFamily: "monospace" }}>
              {device.vid}:{device.pid} • {device.serial}
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: "var(--color-text-tertiary)", textTransform: "uppercase", marginBottom: 12 }}>Forensic Identity</div>
            <div style={{ display: "grid", gap: 10, fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>Manufacturer</span><span style={{ fontWeight: 600 }}>{device.manufacturer || device.vendor}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>Class</span><span>{device.class}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>Category</span><span className="badge badge-info">{device.category}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>VID:PID</span><span style={{ fontFamily: "monospace" }}>{device.vid}:{device.pid}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>Hardware ID</span><span style={{ fontFamily: "monospace", fontSize: 11 }}>{device.hardwareId || device.id}</span></div>
            </div>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: "var(--color-text-tertiary)", textTransform: "uppercase", marginBottom: 12 }}>Connection</div>
            <div style={{ display: "grid", gap: 10, fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>Mount</span><span style={{ fontFamily: "monospace" }}>{device.mountPoint} ({device.fileSystem})</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>Capacity</span><span>{device.capacity}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>Port</span><span>{device.portPath || "PCIROOT(0)#PCI(1400)#USB(2)"}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>USB Revision</span><span>{device.usbRevision || "3.2 Gen 2"}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>Connect Time</span><span style={{ fontFamily: "monospace", fontSize: 11 }}>{device.connectTime || device.timestamp || "—"}</span></div>
            </div>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: "var(--color-text-tertiary)", textTransform: "uppercase", marginBottom: 12 }}>Security Posture</div>
            <div style={{ display: "grid", gap: 8, fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Driver Integrity</span><span className="badge badge-success">{device.driverIntegrity || "Validated"}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Encryption</span><span style={{ fontSize: 11 }}>{device.encryptionStatus || "BitLocker XTS-AES 256"}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Virus Scan</span><span className="badge badge-success">{device.virusScanResult || "Clean"}</span></div>
              {(device.mitreMapping || []).length > 0 && (
                <div style={{ marginTop: 4 }}>
                  <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 4 }}>MITRE</div>
                  {(device.mitreMapping || []).map((m) => (
                    <div key={m} style={{ fontFamily: "monospace", fontSize: 11, color: "var(--color-blue-600)" }}>{m}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: 16, borderTop: "1px solid var(--color-border-light)", display: "flex", gap: 8 }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => onAllow?.(device)}>
            <span className="material-symbols-rounded" style={{ fontSize: 18 }}>check_circle</span> Allow
          </button>
          <button className="btn" style={{ flex: 1, background: "var(--color-red-500)", color: "white" }} onClick={() => onBlock?.(device)}>
            <span className="material-symbols-rounded" style={{ fontSize: 18 }}>block</span> Block
          </button>
        </div>
      </div>
    </>
  );
}
