import React from "react";

export default function MitreMatrix() {
  const techniques = [
    {
      tactic: "Initial Access",
      id: "T1091",
      name: "Replication Through Removable Media",
      status: "detected",
    },
    {
      tactic: "Execution",
      id: "T1059.003",
      name: "Command and Scripting Interpreter: Windows Command Shell",
      status: "detected",
    },
    {
      tactic: "Persistence",
      id: "T1547.001",
      name: "Registry Run Keys / Startup Folder",
      status: "mitigated",
    },
    { tactic: "Collection", id: "T1119", name: "Automated Collection", status: "detected" },
    {
      tactic: "Exfiltration",
      id: "T1048",
      name: "Exfiltration Over Alternative Protocol",
      status: "blocked",
    },
  ];

  return (
    <div className="card" style={{ flex: 1 }}>
      <div className="card-header" style={{ marginBottom: "16px" }}>
        <h2 className="heading-2" style={{ margin: 0, fontSize: "16px" }}>
          MITRE ATT&CK Mapping
        </h2>
        <a
          href="#"
          style={{
            fontSize: "12px",
            color: "var(--color-blue-500)",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          View Matrix &rarr;
        </a>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {techniques.map((tech) => (
          <div
            key={tech.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px",
              border: "1px solid var(--color-border-light)",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--color-surface-hover)",
            }}
          >
            <div
              style={{
                width: "4px",
                height: "24px",
                backgroundColor:
                  tech.status === "detected"
                    ? "var(--color-red-500)"
                    : tech.status === "blocked"
                      ? "var(--color-blue-500)"
                      : "var(--color-green-500)",
                borderRadius: "2px",
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span
                  style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text-primary)" }}
                >
                  {tech.name}
                </span>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "11px",
                    color: "var(--color-text-tertiary)",
                  }}
                >
                  {tech.id}
                </span>
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--color-text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                  marginTop: "2px",
                }}
              >
                {tech.tactic}
              </div>
            </div>
            <span
              className={`badge ${tech.status === "detected" ? "badge-danger" : tech.status === "blocked" ? "badge-info" : "badge-success"}`}
            >
              {tech.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
