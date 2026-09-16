import React, { useState, useEffect } from "react";
import PolicyCard from "../components/policy/PolicyCard";
import { fetchPolicies, createPolicy, deletePolicy } from "../api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export default function PolicyManagement() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [activeTab, setActiveTab] = useState("allowlist");
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formVid, setFormVid] = useState("");
  const [formPid, setFormPid] = useState("");
  const [formVendor, setFormVendor] = useState("");
  const [formType, setFormType] = useState("Allowlist");

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchPolicies();
      setPolicies(data);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const allowlist = policies.filter((p) => p.type === "Allowlist");
  const blocklist = policies.filter((p) => p.type === "Blocklist");
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

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!isAdmin) return toast.error("Only admin can create policies");
    try {
      await createPolicy({ vid: formVid, pid: formPid, vendor: formVendor, type: formType });
      toast.success(`Policy ${formVid}:${formPid} → ${formType}`);
      setFormVid("");
      setFormPid("");
      setFormVendor("");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return toast.error("Only admin can delete");
    try {
      await deletePolicy(id);
      toast.success("Policy removed");
      setPolicies((prev) => prev.filter((p) => p.id !== id));
      setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      try {
        await deletePolicy(id);
      } catch (_) {}
    }
    toast.success(`Deleted ${selectedIds.length} policies`);
    load();
    setSelectedIds([]);
  };

  const handleApprove = async (id) => {
    toast.info("Approve flow: delete from Blocklist and re-create as Allowlist — use form above");
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

      {/* Create Policy — admin only */}
      <form
        onSubmit={handleCreate}
        className="card"
        style={{
          padding: "12px 16px",
          display: "flex",
          gap: 12,
          alignItems: "end",
          flexWrap: "wrap",
        }}
      >
        <div>
          <label style={{ fontSize: 11, fontWeight: 600 }}>VID</label>
          <input
            placeholder="0x0781"
            value={formVid}
            onChange={(e) => setFormVid(e.target.value)}
            pattern="0x[0-9A-Fa-f]{4}"
            required
            style={{
              display: "block",
              marginTop: 4,
              padding: "8px 10px",
              border: "1px solid var(--color-border-light)",
              borderRadius: 8,
              width: 110,
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600 }}>PID</label>
          <input
            placeholder="0x5581"
            value={formPid}
            onChange={(e) => setFormPid(e.target.value)}
            pattern="0x[0-9A-Fa-f]{4}"
            required
            style={{
              display: "block",
              marginTop: 4,
              padding: "8px 10px",
              border: "1px solid var(--color-border-light)",
              borderRadius: 8,
              width: 110,
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600 }}>Vendor</label>
          <input
            placeholder="SanDisk"
            value={formVendor}
            onChange={(e) => setFormVendor(e.target.value)}
            style={{
              display: "block",
              marginTop: 4,
              padding: "8px 10px",
              border: "1px solid var(--color-border-light)",
              borderRadius: 8,
              width: 140,
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600 }}>Type</label>
          <select
            value={formType}
            onChange={(e) => setFormType(e.target.value)}
            style={{
              display: "block",
              marginTop: 4,
              padding: "8px 10px",
              border: "1px solid var(--color-border-light)",
              borderRadius: 8,
            }}
          >
            <option value="Allowlist">Allowlist</option>
            <option value="Blocklist">Blocklist</option>
          </select>
        </div>
        <button
          className="btn btn-primary"
          type="submit"
          disabled={!isAdmin}
          style={{ height: 36 }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 18 }}>
            add
          </span>
          {isAdmin ? "Add Policy" : "Admin only"}
        </button>
        {!isAdmin && (
          <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>
            Analyst role is read-only
          </span>
        )}
        {loading && <span style={{ fontSize: 12 }}>Loading...</span>}
      </form>

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
              device={{
                ...device,
                vendor: device.vendor || device.vid,
                serial: device.serial || `${device.vid}:${device.pid}`,
                addedBy: device.createdBy || device.addedBy,
                addedTime: device.createdAt || device.addedTime,
                notes: device.reason || device.notes,
                risk: device.type === "Blocklist" ? "High" : "Low",
              }}
              selected={selectedIds.includes(device.id)}
              onSelect={handleSelect}
              onApprove={handleApprove}
              onDelete={handleDelete}
              onEdit={() => toast.info("Edit via delete + re-create")}
            />
          ))
        )}
      </div>
    </div>
  );
}
