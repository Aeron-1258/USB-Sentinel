import React from "react";

export default function RecentViolations() {
  const violations = [
    { id: "V-01", user: "jdoe@company.com", host: "WIN-DESK-04", rule: "Mass Storage Block" },
    { id: "V-02", user: "SYSTEM", host: "SRV-09", rule: "Unauthorized Device" },
  ];

  return (
    <div className="card" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div className="card-header" style={{ marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            className="material-symbols-rounded icon-filled"
            style={{ color: "var(--color-red-500)" }}
          >
            gpp_bad
          </span>
          <h2 className="heading-2" style={{ margin: 0, fontSize: "16px" }}>
            Recent Violations
          </h2>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {violations.map((v) => (
          <div
            key={v.id}
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "8px",
              borderLeft: "3px solid var(--color-red-500)",
              backgroundColor: "var(--color-surface-hover)",
            }}
          >
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-text-primary)" }}>
              {v.rule}
            </span>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "var(--color-text-secondary)",
                marginTop: "4px",
              }}
            >
              <span>{v.user}</span>
              <span>{v.host}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
