import React from "react";
import { useTheme } from "../../context/ThemeContext";

export default function Header() {
  const { theme, toggle } = useTheme();
  return (
    <header className="header">
      <div className="header-search">
        <div className="input-group" style={{ width: "400px" }}>
          <span className="material-symbols-rounded">search</span>
          <input type="text" placeholder="Search devices, policies, or logs (Press '/' to focus)" />
        </div>
      </div>

      <div className="header-actions">
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
