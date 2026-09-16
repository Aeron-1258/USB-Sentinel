import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./components/dashboard/Dashboard";
import LiveMonitoring from "./pages/LiveMonitoring";
import DeviceDetails from "./pages/DeviceDetails";
import DeviceInventory from "./pages/DeviceInventory";
import PolicyManagement from "./pages/PolicyManagement";
import FileMonitoring from "./pages/FileMonitoring";
import ThreatDetectionCenter from "./pages/ThreatDetectionCenter";
import AlertsCenter from "./pages/AlertsCenter";
import AuditLogs from "./pages/AuditLogs";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import SecurityReports from "./pages/SecurityReports";
import Settings from "./pages/Settings";
import { Toaster } from "sonner";

function AppInner() {
  const { isAuthenticated, loading, logout, user } = useAuth();
  const [currentView, setCurrentView] = useState("dashboard");
  const [activeDeviceId, setActiveDeviceId] = useState(null);

  const handleNavigate = (view, deviceId = null) => {
    setCurrentView(view);
    if (deviceId) {
      setActiveDeviceId(deviceId);
    }
  };

  if (loading) {
    return (
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}
      >
        <span className="material-symbols-rounded pulse">sync</span> Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onSuccess={() => setCurrentView("dashboard")} />;
  }

  return (
    <>
      <AppLayout
        currentView={currentView}
        onNavigate={handleNavigate}
        user={user}
        onLogout={logout}
      >
        {currentView === "dashboard" && <Dashboard />}
        {currentView === "analytics" && <AnalyticsDashboard />}
        {currentView === "inventory" && (
          <DeviceInventory onDeviceClick={(id) => handleNavigate("device-details", id)} />
        )}
        {currentView === "monitoring" && (
          <LiveMonitoring onDeviceClick={(id) => handleNavigate("device-details", id)} />
        )}
        {currentView === "device-details" && (
          <DeviceDetails deviceId={activeDeviceId} onBack={() => handleNavigate("inventory")} />
        )}
        {currentView === "policy" && <PolicyManagement />}
        {currentView === "file-monitoring" && <FileMonitoring />}
        {currentView === "threats" && <ThreatDetectionCenter />}
        {currentView === "alerts" && <AlertsCenter />}
        {currentView === "audit-logs" && <AuditLogs />}
        {currentView === "reports" && <SecurityReports />}
        {currentView === "settings" && <Settings />}
      </AppLayout>
      <Toaster richColors position="top-right" />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
