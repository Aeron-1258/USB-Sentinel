import React, { useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useSearch } from "../../context/SearchContext";

export default function Header() {
  const { theme, toggle } = useTheme();
  const { query, setQuery } = useSearch();
  const inputRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="header">
      <div className="header-search">
        <div className="input-group" style={{ width: "440px" }}>
          <span className="material-symbols-rounded">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search devices, policies, or logs (Press '/' to focus)"
          />
          {query && (
            <button className="btn-icon" style={{ width: 28, height: 28 }} onClick={() => setQuery("")} title="Clear">
              <span className="material-symbols-rounded" style={{ fontSize: 18 }}>close</span>
            </button>
          )}
        </div>
      </div>

      <div className="header-actions">
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", borderRadius: 16, background: "var(--color-green-50)", color: "var(--color-green-600)", fontSize: 11, fontWeight: 600 }}>
          <span className="material-symbols-rounded pulse" style={{ fontSize: 10 }}>fiber_manual_record</span>
          LIVE
        </div>
        <button className="btn-icon" onClick={toggle} title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}>
          <span className="material-symbols-rounded">{theme === "light" ? "dark_mode" : "light_mode"}</span>
        </button>
        <button className="btn-icon">
          <span className="material-symbols-rounded">notifications</span>
        </button>
        <button className="btn-icon">
          <span className="material-symbols-rounded">apps</span>
        </button>
        <div className="user-profile">
          <div className="avatar">SA</div>
        </div>
      </div>
    </header>
  );
}
