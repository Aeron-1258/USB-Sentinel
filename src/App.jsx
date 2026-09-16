import React, { useState } from "react";
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

function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [activeDeviceId, setActiveDeviceId] = useState(null);

  const handleNavigate = (view, deviceId = null) => {
    setCurrentView(view);
    if (deviceId) {
      setActiveDeviceId(deviceId);
    }
  };

  return (
    <AppLayout currentView={currentView} onNavigate={handleNavigate}>
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
  );
}

export default App;
