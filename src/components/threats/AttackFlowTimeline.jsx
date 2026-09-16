import React from "react";

export default function AttackFlowTimeline() {
  const steps = [
    {
      time: "09:12:04",
      title: "Malicious USB Inserted",
      desc: "Device recognized as standard HID Keyboard (VID_058F PID_6387).",
      type: "critical",
    },
    {
      time: "09:12:06",
      title: "Rapid Keystroke Injection",
      desc: "142 WPM detected. Payload executing in hidden PowerShell instance.",
      type: "warning",
    },
    {
      time: "09:12:08",
      title: "File System Enumeration",
      desc: "Recursive read on C:\\Users\\*\\Documents\\Finance",
      type: "warning",
    },
    {
      time: "09:12:15",
      title: "Data Staging",
      desc: "Creation of encrypted archive temp_data.zip (14MB).",
      type: "critical",
    },
    {
      time: "09:12:18",
      title: "Exfiltration Attempt Blocked",
      desc: "Network policy dropped outbound connection to 185.199.x.x:443.",
      type: "success",
    },
  ];

  return (
    <div className="card" style={{ flex: 1.5 }}>
      <div className="card-header" style={{ marginBottom: "16px" }}>
        <h2 className="heading-2" style={{ margin: 0, fontSize: "16px" }}>
          Attack Flow Timeline
        </h2>
        <span className="badge badge-neutral">Incident INC-9902</span>
      </div>

      <div style={{ paddingLeft: "8px", display: "flex", flexDirection: "column", gap: "0" }}>
        {steps.map((step, index) => (
          <div key={index} style={{ display: "flex", gap: "16px", position: "relative" }}>
            {/* Timeline Line */}
            {index !== steps.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  left: "7px",
                  top: "24px",
                  bottom: "-8px",
                  width: "2px",
                  backgroundColor: "var(--color-border-light)",
                  zIndex: 0,
                }}
              />
            )}

            {/* Timeline Dot */}
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                zIndex: 1,
                marginTop: "4px",
                backgroundColor:
                  step.type === "critical"
                    ? "var(--color-red-500)"
                    : step.type === "warning"
                      ? "var(--color-orange-500)"
                      : "var(--color-green-500)",
                border: "3px solid var(--color-surface)",
                boxShadow: "0 0 0 1px var(--color-border-light)",
              }}
            />

            <div style={{ flex: 1, paddingBottom: index === steps.length - 1 ? 0 : "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: "4px",
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                  }}
                >
                  {step.title}
                </h4>
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--color-text-tertiary)",
                    fontFamily: "monospace",
                  }}
                >
                  {step.time}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--color-text-secondary)" }}>
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
