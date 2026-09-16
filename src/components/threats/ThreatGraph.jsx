import React from "react";

export default function ThreatGraph() {
  return (
    <div
      className="card"
      style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "300px" }}
    >
      <div className="card-header" style={{ marginBottom: "16px" }}>
        <h2 className="heading-2" style={{ margin: 0, fontSize: "16px" }}>
          Threat Vector Graph
        </h2>
        <span className="badge badge-danger">Active Attack Detected</span>
      </div>

      <div
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        {/* CSS-based node graph */}
        <div
          style={{
            display: "flex",
            gap: "48px",
            alignItems: "center",
            position: "relative",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          {/* Node 1: External / Physical */}
          <div
            style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "var(--color-surface)",
                border: "2px solid var(--color-gray-400)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="material-symbols-rounded" style={{ color: "var(--color-gray-600)" }}>
                person
              </span>
            </div>
            <span style={{ fontSize: "12px", fontWeight: 600, marginTop: "8px" }}>Adversary</span>
          </div>

          {/* Line 1 */}
          <div
            style={{
              flex: 1,
              height: "2px",
              backgroundColor: "var(--color-red-500)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "var(--color-surface)",
                padding: "0 4px",
                fontSize: "10px",
                color: "var(--color-red-600)",
                fontWeight: 600,
              }}
            >
              T1091
            </div>
          </div>

          {/* Node 2: USB Device */}
          <div
            style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "var(--color-red-50)",
                border: "2px solid var(--color-red-500)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 12px rgba(217,48,37,0.4)",
              }}
            >
              <span className="material-symbols-rounded" style={{ color: "var(--color-red-600)" }}>
                usb
              </span>
            </div>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                marginTop: "8px",
                color: "var(--color-red-600)",
              }}
            >
              BadUSB
            </span>
            <span style={{ fontSize: "10px", color: "var(--color-text-secondary)" }}>
              VID_058F&PID_6387
            </span>
          </div>

          {/* Line 2 */}
          <div
            style={{
              flex: 1,
              height: "2px",
              backgroundColor: "var(--color-red-500)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "var(--color-surface)",
                padding: "0 4px",
                fontSize: "10px",
                color: "var(--color-red-600)",
                fontWeight: 600,
              }}
            >
              T1059.003
            </div>
          </div>

          {/* Node 3: Host */}
          <div
            style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "8px",
                backgroundColor: "var(--color-orange-50)",
                border: "2px solid var(--color-orange-500)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                className="material-symbols-rounded"
                style={{ color: "var(--color-orange-600)" }}
              >
                computer
              </span>
            </div>
            <span style={{ fontSize: "12px", fontWeight: 600, marginTop: "8px" }}>WIN-DESK-04</span>
            <span style={{ fontSize: "10px", color: "var(--color-orange-600)" }}>Compromised</span>
          </div>

          {/* Line 3 */}
          <div
            style={{
              flex: 1,
              height: "2px",
              borderTop: "2px dashed var(--color-orange-500)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "var(--color-surface)",
                padding: "0 4px",
                fontSize: "10px",
                color: "var(--color-orange-600)",
                fontWeight: 600,
              }}
            >
              T1048
            </div>
          </div>

          {/* Node 4: Exfiltration */}
          <div
            style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "var(--color-surface)",
                border: "2px solid var(--color-blue-500)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="material-symbols-rounded" style={{ color: "var(--color-blue-600)" }}>
                cloud_upload
              </span>
            </div>
            <span style={{ fontSize: "12px", fontWeight: 600, marginTop: "8px" }}>External C2</span>
            <span style={{ fontSize: "10px", color: "var(--color-text-secondary)" }}>Blocked</span>
          </div>
        </div>
      </div>
    </div>
  );
}
