import React from "react";

export function IndicatorsPanel() {
  const iocs = [
    {
      type: "Hash (SHA256)",
      value: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    },
    { type: "File", value: "C:\\Windows\\Temp\\srv_update.ps1" },
    { type: "IP Address", value: "185.199.108.153" },
    { type: "Hardware ID", value: "USB\\VID_058F&PID_6387\\12345678" },
  ];

  return (
    <div className="card" style={{ flex: 1 }}>
      <div className="card-header" style={{ marginBottom: "16px" }}>
        <h2 className="heading-2" style={{ margin: 0, fontSize: "16px" }}>
          Indicators (IoCs)
        </h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {iocs.map((ioc, i) => (
          <div
            key={i}
            style={{
              padding: "8px",
              border: "1px solid var(--color-border-light)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                color: "var(--color-text-tertiary)",
                display: "block",
                textTransform: "uppercase",
              }}
            >
              {ioc.type}
            </span>
            <span
              style={{
                fontSize: "12px",
                fontFamily: "monospace",
                color: "var(--color-text-primary)",
                wordBreak: "break-all",
              }}
            >
              {ioc.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecommendationsCard() {
  return (
    <div
      className="card"
      style={{
        flex: 1,
        backgroundColor: "var(--color-blue-50)",
        border: "1px solid var(--color-blue-200)",
      }}
    >
      <div className="card-header" style={{ marginBottom: "12px" }}>
        <h2
          className="heading-2"
          style={{ margin: 0, fontSize: "16px", color: "var(--color-blue-800)" }}
        >
          Recommendations
        </h2>
      </div>
      <ul
        style={{
          margin: 0,
          paddingLeft: "20px",
          fontSize: "13px",
          color: "var(--color-blue-900)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <li>
          Isolate host <strong>WIN-DESK-04</strong> from the corporate network immediately.
        </li>
        <li>
          Add Hardware ID{" "}
          <code
            style={{
              backgroundColor: "rgba(255,255,255,0.5)",
              padding: "2px 4px",
              borderRadius: "4px",
            }}
          >
            VID_058F&PID_6387
          </code>{" "}
          to global blocklist.
        </li>
        <li>Initiate full EDR memory scan on adjacent hosts in the Finance subnet.</li>
        <li>
          Reset credentials for user <strong>asmith@company.com</strong>.
        </li>
      </ul>
      <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
        <button className="btn btn-primary" style={{ flex: 1 }}>
          Execute Playbook
        </button>
      </div>
    </div>
  );
}
