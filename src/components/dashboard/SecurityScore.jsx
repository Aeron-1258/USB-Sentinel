import React from "react";

export default function SecurityScore({ score }) {
  // Simple color mapping based on score
  const color =
    score > 90
      ? "var(--color-green-500)"
      : score > 70
        ? "var(--color-orange-500)"
        : "var(--color-red-500)";

  return (
    <div
      className="card"
      style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px" }}
    >
      <div
        style={{
          position: "relative",
          width: "64px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Simple CSS-based circular gauge simulation */}
        <svg
          viewBox="0 0 36 36"
          style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
        >
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="var(--color-border-light)"
            strokeWidth="4"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeDasharray={`${score}, 100`}
            strokeLinecap="round"
          />
        </svg>
        <span
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "var(--color-text-primary)",
            zIndex: 1,
          }}
        >
          {score}
        </span>
      </div>
      <div>
        <h3
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--color-text-primary)",
            margin: 0,
          }}
        >
          Security Posture
        </h3>
        <p style={{ fontSize: "12px", color: "var(--color-text-secondary)", margin: "2px 0 0 0" }}>
          Overall environment health
        </p>
      </div>
    </div>
  );
}
