import React from "react";

export default function Sidebar({ currentView, onNavigate, user, onLogout }) {
  const navItems = [
    { id: "dashboard", icon: "dashboard", label: "Dashboard" },
    { id: "analytics", icon: "insights", label: "Analytics" },
    { id: "inventory", icon: "usb", label: "Device Inventory" },
    { id: "policy", icon: "policy", label: "Policies" },
    { id: "monitoring", icon: "monitoring", label: "Real-time Monitoring" },
    { id: "file-monitoring", icon: "folder_open", label: "File Movement" },
    { id: "threats", icon: "gpp_bad", label: "Threat Intelligence" },
    { id: "alerts", icon: "notifications_active", label: "Alerts Center" },
    { id: "audit-logs", icon: "description", label: "Audit Logs" },
    { id: "reports", icon: "summarize", label: "Security Reports" },
    { id: "settings", icon: "settings", label: "Settings" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span
          className="material-symbols-rounded icon-filled"
          style={{ color: "var(--color-blue-500)", fontSize: 28 }}
        >
          admin_panel_settings
        </span>
        <span className="brand-title" style={{ fontSize: "var(--font-size-lg)" }}>
          USB Control
        </span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <a
              href={`#${item.id}`}
              key={item.id}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.id);
              }}
            >
              <span className={`material-symbols-rounded ${isActive ? "icon-filled" : ""}`}>
                {item.icon}
              </span>
              {item.label}
              {item.id === "alerts" && (
                <span
                  style={{
                    marginLeft: "auto",
                    backgroundColor: "var(--color-red-500)",
                    color: "white",
                    borderRadius: "12px",
                    padding: "2px 6px",
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                >
                  3
                </span>
              )}
            </a>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {user && (
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--color-border-light)" }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{user.username}</div>
            <div
              style={{
                fontSize: 11,
                color: "var(--color-text-tertiary)",
                textTransform: "uppercase",
              }}
            >
              {user.role}
            </div>
            <button
              className="btn btn-secondary"
              onClick={onLogout}
              style={{ width: "100%", marginTop: 8, height: 32, fontSize: 12 }}
            >
              <span className="material-symbols-rounded" style={{ fontSize: 16 }}>
                logout
              </span>
              Sign out
            </button>
          </div>
        )}
        <div className="nav-item">
          <span className="material-symbols-rounded">help</span>
          Support
        </div>
      </div>
    </aside>
  );
}
