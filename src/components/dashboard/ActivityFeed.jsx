import React, { useEffect, useRef } from "react";

export default function ActivityFeed({ logs }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      className="card"
      style={{
        height: "100%",
        minHeight: "300px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--color-gray-900)",
        color: "var(--color-green-500)",
        fontFamily: "monospace",
      }}
    >
      <div
        className="card-header"
        style={{
          marginBottom: "12px",
          borderBottom: "1px solid var(--color-gray-800)",
          paddingBottom: "8px",
        }}
      >
        <h2
          className="heading-2"
          style={{ margin: 0, fontSize: "14px", color: "var(--color-gray-300)" }}
        >
          Live Activity Stream (Terminal)
        </h2>
      </div>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          fontSize: "12px",
        }}
      >
        {logs.map((log, i) => (
          <div key={i} style={{ opacity: 1 - (logs.length - 1 - i) * 0.1 }}>
            <span style={{ color: "var(--color-gray-500)" }}>[{log.timestamp}]</span>{" "}
            <span
              style={{
                color:
                  log.level === "ERROR"
                    ? "var(--color-red-500)"
                    : log.level === "WARN"
                      ? "var(--color-orange-500)"
                      : "var(--color-blue-500)",
              }}
            >
              [{log.level}]
            </span>{" "}
            <span style={{ color: "var(--color-gray-300)" }}>{log.host}:</span> {log.message}
          </div>
        ))}
      </div>
    </div>
  );
}
