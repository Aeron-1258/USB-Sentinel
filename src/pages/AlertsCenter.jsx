import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { fetchAlerts, alertAction } from "../api";
import { toast } from "sonner";

export default function AlertsCenter() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("All");

  const loadAlerts = async () => {
    const data = await fetchAlerts();
    setAlerts(data);
  };

  useEffect(() => {
    loadAlerts();
    const socket = io(import.meta.env.VITE_WS_URL || "http://localhost:3001");
    socket.on("alert_generated", (alert) => {
      setAlerts((prev) => {
        if (prev.some((a) => a.id === alert.id)) return prev;
        return [alert, ...prev];
      });
      toast.error(alert.title, { description: `${alert.device} • ${alert.severity}` });
    });
    socket.on("alert_updated", (updated) => {
      setAlerts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    });
    return () => socket.disconnect();
  }, []);

  const handleAction = async (alertId, actionName) => {
    try {
      const res = await alertAction(alertId, actionName);
      setAlerts((prev) => prev.map((a) => (a.id === alertId ? res.alert || { ...a, status: actionName } : a)));
      toast.success(`${actionName}: ${alertId}`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const filtered = filter === "All" ? alerts : alerts.filter((a) => a.status === filter || a.severity === filter);
  const counts = {
    All: alerts.length,
    Active: alerts.filter((a) => a.status === "Active").length,
    Critical: alerts.filter((a) => a.severity === "Critical").length,
  };

  return (
    <div className="flex-col gap-3" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="flex justify-between items-center" style={{ marginBottom: "8px", flexShrink: 0 }}>
        <div>
          <h1 className="heading-1" style={{ margin: 0 }}>
            Alerts Center & Incident Triage
          </h1>
          <p className="text-subtitle">SOC analyst incident investigation queue and containment workflows</p>
        </div>
        <button className="btn btn-secondary" onClick={loadAlerts} style={{ height: 36 }}>
          <span className="material-symbols-rounded" style={{ fontSize: 18 }}>
            refresh
          </span>
          Refresh
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        {["All", "Active", "Critical"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn ${filter === f ? "btn-primary" : "btn-secondary"}`}
            style={{ height: 32, fontSize: 12 }}
          >
            {f} ({counts[f] ?? 0})
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--color-text-tertiary)", alignSelf: "center" }}>
          Live updates via WebSocket • {alerts.length} total
        </span>
      </div>

      <div className="card" style={{ flex: 1, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filtered.length === 0 && (
            <div style={{ padding: "48px", textAlign: "center", color: "var(--color-text-tertiary)" }}>
              <span className="material-symbols-rounded" style={{ fontSize: "48px", color: "var(--color-green-500)", marginBottom: "12px" }}>
                check_circle
              </span>
              <div style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>
                {filter === "All" ? "All incidents triaged" : `No ${filter} alerts`}
              </div>
              <div style={{ fontSize: "12px", marginTop: "4px" }}>No USB security alerts match this filter.</div>
            </div>
          )}
          {filtered.map((alt) => (
            <div
              key={alt.id}
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid var(--color-border-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                opacity: alt.status === "Closed" ? 0.6 : 1,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: alt.severity === "Critical" ? "var(--color-red-50)" : "var(--color-orange-50)",
                    color: alt.severity === "Critical" ? "var(--color-red-600)" : "var(--color-orange-600)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span className="material-symbols-rounded">warning</span>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--color-text-primary)" }}>{alt.title}</div>
                  <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", marginTop: "2px" }}>
                    Device: {alt.device} ({alt.vid}:{alt.pid}) | User: {alt.user} | Status: <strong>{alt.status || "Active"}</strong>
                    {alt.updatedAt && <span> • Updated: {new Date(alt.updatedAt).toLocaleString()}</span>}
                  </div>
                  {alt.mitreTechnique && (
                    <div style={{ fontSize: "11px", color: "var(--color-blue-600)", fontFamily: "monospace", marginTop: "2px" }}>
                      {alt.mitreTechnique} {alt.ruleTrigger && `• ${alt.ruleTrigger}`}
                    </div>
                  )}
                  <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginTop: "2px" }}>
                    {alt.timestamp} • ID: {alt.id}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span className={`badge ${alt.severity === "Critical" ? "badge-danger" : "badge-warning"}`}>{alt.severity}</span>
                <span className={`badge ${alt.status === "Closed" ? "badge-success" : alt.status === "Escalated" ? "badge-danger" : "badge-secondary"}`}>
                  {alt.status || "Active"}
                </span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: "4px 8px", fontSize: "12px" }}
                    onClick={() => handleAction(alt.id, "Acknowledged")}
                    disabled={alt.status === "Acknowledged"}
                  >
                    Acknowledge
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: "4px 8px", fontSize: "12px", color: "var(--color-red-600)" }}
                    onClick={() => handleAction(alt.id, "Escalated")}
                  >
                    Escalate
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: "4px 8px", fontSize: "12px", color: "var(--color-green-600)" }}
                    onClick={() => handleAction(alt.id, "Closed")}
                    disabled={alt.status === "Closed"}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
