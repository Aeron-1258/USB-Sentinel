import React, { useState, useEffect } from "react";
import { fetchAuditLogs } from "../api";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;

  useEffect(() => {
    async function loadLogs() {
      const data = await fetchAuditLogs();
      setLogs(data);
    }
    loadLogs();
    const interval = setInterval(loadLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter((log) =>
    Object.values(log).some(
      (val) =>
        val !== null &&
        val !== undefined &&
        val.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredLogs.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredLogs.slice(startIndex, startIndex + rowsPerPage);

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "Critical":
        return "badge-danger";
      case "High":
        return "badge-warning";
      case "Medium":
        return "badge-neutral";
      case "Low":
        return "badge-info";
      default:
        return "badge-neutral";
    }
  };

  return (
    <div
      className="flex-col gap-3"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div
        className="flex justify-between items-center"
        style={{ marginBottom: "8px", flexShrink: 0 }}
      >
        <div>
          <h1 className="heading-1" style={{ margin: 0 }}>
            System Audit Logs
          </h1>
          <p className="text-subtitle">
            Authentic Windows security event logs, PnP load events, and file movements
          </p>
        </div>
      </div>

      <div
        className="card"
        style={{
          padding: "12px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div className="input-group" style={{ width: "400px", height: "36px" }}>
          <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>
            search
          </span>
          <input
            type="text"
            placeholder="Search Hashes, PIDs, Users, or Endpoints..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div
        className="card"
        style={{
          flex: 1,
          padding: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 1, overflow: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: "13px",
              whiteSpace: "nowrap",
            }}
          >
            <thead
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "var(--color-surface)",
                zIndex: 1,
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <tr style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                <th
                  style={{
                    padding: "12px 16px",
                    fontWeight: 600,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Timestamp
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    fontWeight: 600,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Endpoint
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    fontWeight: 600,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  User
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    fontWeight: 600,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Action
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    fontWeight: 600,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Process
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    fontWeight: 600,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Hash (SHA-256)
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    fontWeight: 600,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Device
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    fontWeight: 600,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Severity
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      padding: "32px",
                      textAlign: "center",
                      color: "var(--color-text-tertiary)",
                    }}
                  >
                    No audit events recorded yet. Connect a USB device or modify files to log
                    activity.
                  </td>
                </tr>
              )}
              {currentRows.map((log) => (
                <tr key={log.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                  <td
                    style={{
                      padding: "12px 16px",
                      color: "var(--color-text-secondary)",
                      fontFamily: "monospace",
                    }}
                  >
                    {log.timestamp}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      color: "var(--color-text-primary)",
                      fontFamily: "monospace",
                    }}
                  >
                    {log.endpoint}
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--color-text-primary)" }}>
                    {log.user}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      color: "var(--color-text-primary)",
                      fontWeight: 500,
                    }}
                  >
                    {log.action}
                  </td>
                  <td style={{ padding: "12px 16px", fontFamily: "monospace" }}>
                    {log.process} ({log.pid})
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontFamily: "monospace",
                      color: "var(--color-text-tertiary)",
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={log.hash}
                  >
                    {log.hash}
                  </td>
                  <td style={{ padding: "12px 16px" }}>{log.device}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span className={`badge ${getSeverityBadge(log.severity)}`}>
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div
          style={{
            borderTop: "1px solid var(--color-border-light)",
            padding: "12px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "var(--color-surface)",
          }}
        >
          <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
            Showing {filteredLogs.length > 0 ? startIndex + 1 : 0} to{" "}
            {Math.min(startIndex + rowsPerPage, filteredLogs.length)} of {filteredLogs.length}{" "}
            entries
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              className="btn-icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <span className="material-symbols-rounded">chevron_left</span>
            </button>
            <span style={{ fontSize: "13px", fontWeight: 500 }}>
              {currentPage} / {totalPages || 1}
            </span>
            <button
              className="btn-icon"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <span className="material-symbols-rounded">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
