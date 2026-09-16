import React, { useState } from "react";
import PolicyCard from "../components/policy/PolicyCard";

const initialAllowlist = [
  {
    id: "AL-1",
    type: "Security",
    vendor: "Yubico",
    serial: "YB-8921-009",
    addedBy: "admin@company.com",
    addedTime: "Oct 12, 2025",
    notes: "Standard issue security key for Engineering department.",
    risk: "Low",
  },
  {
    id: "AL-2",
    type: "HID",
    vendor: "Logitech",
    serial: "LOG-KBD-991",
    addedBy: "admin@company.com",
    addedTime: "Sep 05, 2025",
    notes: "Approved wireless receiver for standard keyboards.",
    risk: "Low",
  },
  {
    id: "AL-3",
    type: "Storage",
    vendor: "Kingston",
    serial: "KN-DT50-128",
    addedBy: "secops@company.com",
    addedTime: "Aug 22, 2025",
    notes: "Encrypted drive for authorized offline backups. Restricted to SOC team.",
    risk: "Medium",
  },
];

const initialBlocklist = [
  {
    id: "BL-1",
    type: "Storage",
    vendor: "SanDisk",
    serial: "SD-CRZ-001",
    addedBy: "SYSTEM",
    addedTime: "Today, 14:22",
    notes: "Blocked via automated Mass Storage Policy V3. Unauthorized data exfiltration risk.",
    risk: "High",
  },
  {
    id: "BL-2",
    type: "Unknown",
    vendor: "Generic",
    serial: "UNK-8829-FF",
    addedBy: "SYSTEM",
    addedTime: "Yesterday, 09:11",
    notes: "BadUSB signature detected. Quarantined indefinitely.",
    risk: "High",
  },
];

export default function PolicyManagement() {
  const [activeTab, setActiveTab] = useState("allowlist");
  const [allowlist, setAllowlist] = useState(initialAllowlist);
  const [blocklist, setBlocklist] = useState(initialBlocklist);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const currentList = activeTab === "allowlist" ? allowlist : blocklist;

  const filteredList = currentList.filter(
    (device) =>
      device.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.serial.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allSelected = filteredList.length > 0 && selectedIds.length === filteredList.length;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(filteredList.map((d) => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id, checked) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };

  const handleApprove = (id) => {
    // If in blocklist, move to allowlist
    if (activeTab === "blocklist") {
      const device = blocklist.find((d) => d.id === id);
      setBlocklist((prev) => prev.filter((d) => d.id !== id));
      setAllowlist((prev) => [
        {
          ...device,
          risk: "Low",
          notes: "Manually approved by admin.",
          addedBy: "admin@company.com",
        },
        ...prev,
      ]);
    } else {
      // Already in allowlist, maybe just a toast notification in a real app
      alert("Device is already in the allowlist.");
    }
  };

  const handleDelete = (id) => {
    if (activeTab === "allowlist") {
      setAllowlist((prev) => prev.filter((d) => d.id !== id));
    } else {
      setBlocklist((prev) => prev.filter((d) => d.id !== id));
    }
    setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
  };

  const handleBulkDelete = () => {
    if (activeTab === "allowlist") {
      setAllowlist((prev) => prev.filter((d) => !selectedIds.includes(d.id)));
    } else {
      setBlocklist((prev) => prev.filter((d) => !selectedIds.includes(d.id)));
    }
    setSelectedIds([]);
  };

  return (
    <div
      className="flex-col gap-3"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: "8px" }}>
        <div>
          <h1 className="heading-1" style={{ margin: 0 }}>
            Device Policy Management
          </h1>
          <p className="text-subtitle">Manage hardware access control lists and overrides</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--color-border-light)" }}>
        <button
          onClick={() => {
            setActiveTab("allowlist");
            setSelectedIds([]);
          }}
          style={{
            padding: "12px 24px",
            background: "none",
            border: "none",
            borderBottom:
              activeTab === "allowlist"
                ? "3px solid var(--color-blue-500)"
                : "3px solid transparent",
            color:
              activeTab === "allowlist" ? "var(--color-blue-600)" : "var(--color-text-secondary)",
            fontWeight: activeTab === "allowlist" ? 600 : 500,
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Allowlist ({allowlist.length})
        </button>
        <button
          onClick={() => {
            setActiveTab("blocklist");
            setSelectedIds([]);
          }}
          style={{
            padding: "12px 24px",
            background: "none",
            border: "none",
            borderBottom:
              activeTab === "blocklist"
                ? "3px solid var(--color-blue-500)"
                : "3px solid transparent",
            color:
              activeTab === "blocklist" ? "var(--color-blue-600)" : "var(--color-text-secondary)",
            fontWeight: activeTab === "blocklist" ? 600 : 500,
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Blocklist ({blocklist.length})
        </button>
      </div>

      {/* Toolbar */}
      <div
        className="card"
        style={{
          padding: "12px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
              title="Select All"
            />
            {selectedIds.length > 0 && (
              <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-blue-600)" }}>
                {selectedIds.length} selected
              </span>
            )}
          </div>

          {selectedIds.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "8px",
                borderLeft: "1px solid var(--color-border-light)",
                paddingLeft: "24px",
              }}
            >
              <button
                className="btn btn-secondary"
                style={{
                  height: "32px",
                  color: "var(--color-red-600)",
                  borderColor: "var(--color-red-200)",
                }}
                onClick={handleBulkDelete}
              >
                <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>
                  delete
                </span>
                Delete Selected
              </button>
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="input-group" style={{ width: "300px", height: "36px" }}>
            <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>
              search
            </span>
            <input
              type="text"
              placeholder="Search by vendor or serial..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary" style={{ height: "36px" }}>
            <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>
              filter_list
            </span>
            Filter
          </button>
          <button className="btn btn-secondary" style={{ height: "36px" }}>
            <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>
              download
            </span>
            Export
          </button>
        </div>
      </div>

      {/* List Area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          paddingRight: "8px",
          paddingTop: "8px",
        }}
      >
        {filteredList.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "64px", color: "var(--color-text-tertiary)" }}
          >
            <span
              className="material-symbols-rounded"
              style={{ fontSize: "48px", marginBottom: "16px" }}
            >
              policy
            </span>
            <p style={{ margin: 0, fontSize: "14px" }}>No policies found matching your criteria.</p>
          </div>
        ) : (
          filteredList.map((device) => (
            <PolicyCard
              key={device.id}
              device={device}
              selected={selectedIds.includes(device.id)}
              onSelect={handleSelect}
              onApprove={handleApprove}
              onDelete={handleDelete}
              onEdit={(id) => alert(`Edit dialog for ${id} would open here.`)}
            />
          ))
        )}
      </div>
    </div>
  );
}
