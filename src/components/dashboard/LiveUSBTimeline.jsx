import React from "react";

export default function LiveUSBTimeline({ events }) {
  return (
    <div
      className="card"
      style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: "300px" }}
    >
      <div className="card-header" style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "var(--color-green-500)",
              boxShadow: "0 0 8px var(--color-green-500)",
            }}
          />
          <h2 className="heading-2" style={{ margin: 0, fontSize: "16px" }}>
            Live USB Feed
          </h2>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {events.map((event) => (
          <div
            key={event.id}
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
              padding: "8px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--color-surface-hover)",
            }}
          >
            <span
              className="material-symbols-rounded icon-filled"
              style={{
                color: event.action === "block" ? "var(--color-red-500)" : "var(--color-green-500)",
                fontSize: "20px",
              }}
            >
              {event.action === "block" ? "block" : "usb"}
            </span>
            <div style={{ flex: 1 }}>
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span
                  style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text-primary)" }}
                >
                  {event.device}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--color-text-tertiary)",
                    fontFamily: "monospace",
                  }}
                >
                  {event.time}
                </span>
              </div>
              <div
                style={{ fontSize: "12px", color: "var(--color-text-secondary)", marginTop: "2px" }}
              >
                {event.host} • {event.user}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
