import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login({ onSuccess }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg, #f8fafc)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="card"
        style={{ width: 380, padding: 32, display: "flex", flexDirection: "column", gap: 16 }}
      >
        <div style={{ textAlign: "center" }}>
          <span
            className="material-symbols-rounded icon-filled"
            style={{ fontSize: 40, color: "var(--color-blue-500)" }}
          >
            admin_panel_settings
          </span>
          <h1 className="heading-1" style={{ margin: "8px 0 4px 0" }}>
            USB-Sentinel
          </h1>
          <p className="text-subtitle" style={{ margin: 0 }}>
            Sign in to SOC Console
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "var(--color-red-50, #fef2f2)",
              color: "var(--color-red-600)",
              padding: "8px 12px",
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <div>
          <label style={{ fontSize: 13, fontWeight: 600 }}>Username</label>
          <input
            className="input"
            style={{
              width: "100%",
              marginTop: 6,
              padding: "10px 12px",
              border: "1px solid var(--color-border-light)",
              borderRadius: 8,
            }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600 }}>Password</label>
          <input
            className="input"
            type="password"
            style={{
              width: "100%",
              marginTop: 6,
              padding: "10px 12px",
              border: "1px solid var(--color-border-light)",
              borderRadius: 8,
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ height: 40, justifyContent: "center" }}
        >
          {loading ? (
            <>
              <span className="material-symbols-rounded pulse">sync</span> Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>

        <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", textAlign: "center" }}>
          Demo: <b>admin / Admin@123</b> (admin) · <b>analyst / Analyst@123</b> (analyst)
          <br />
          Analyst can triage; only Admin manages policies.
        </div>
      </form>
    </div>
  );
}
