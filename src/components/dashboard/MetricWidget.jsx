import React from "react";

export default function MetricWidget({ title, value, unit, trend, type = "default" }) {
  // Determine color based on trend and type
  const getTrendColor = () => {
    if (!trend) return "var(--color-text-secondary)";
    if (type === "inverse") {
      return trend > 0 ? "var(--color-red-500)" : "var(--color-green-500)";
    }
    return trend > 0 ? "var(--color-green-500)" : "var(--color-red-500)";
  };

  return (
    <div
      className="card"
      style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "4px" }}
    >
      <span
        style={{
          fontSize: "12px",
          fontWeight: 500,
          color: "var(--color-text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.02em",
        }}
      >
        {title}
      </span>
      <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
        <span style={{ fontSize: "24px", fontWeight: 600, color: "var(--color-text-primary)" }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: "14px", color: "var(--color-text-tertiary)" }}>{unit}</span>
        )}
        {trend !== undefined && (
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              color: getTrendColor(),
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: "14px" }}>
              {trend > 0 ? "arrow_upward" : trend < 0 ? "arrow_downward" : "horizontal_rule"}
            </span>
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
}
