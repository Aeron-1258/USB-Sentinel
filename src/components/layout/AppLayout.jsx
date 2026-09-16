import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({ children, currentView, onNavigate, user, onLogout }) {
  return (
    <div className="app-container">
      <Sidebar currentView={currentView} onNavigate={onNavigate} user={user} onLogout={onLogout} />
      <div className="main-content">
        <Header />
        <main className="workspace">{children}</main>
      </div>
    </div>
  );
}
