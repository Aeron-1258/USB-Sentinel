import React from "react";

export function Skeleton({ height = 16, width = "100%", radius = 8, style }) {
  return (
    <div
      style={{
        height,
        width,
        borderRadius: radius,
        background: "linear-gradient(90deg, var(--color-gray-100) 25%, var(--color-gray-200) 37%, var(--color-gray-100) 63%)",
        backgroundSize: "400% 100%",
        animation: "shimmer 1.4s ease infinite",
        ...style,
      }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      <Skeleton height={14} width="60%" />
      <Skeleton height={28} width="40%" />
      <Skeleton height={12} width="80%" />
    </div>
  );
}
