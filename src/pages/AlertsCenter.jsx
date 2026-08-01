import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { fetchAlerts } from '../api';

export default function AlertsCenter() {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const loadAlerts = async () => {
    const data = await fetchAlerts();
    setAlerts(data);
  };

  useEffect(() => {
    loadAlerts();
    const socket = io('http://localhost:3001');
    socket.on('alert_generated', (alert) => {
      setAlerts(prev => [alert, ...prev]);
    });
    return () => socket.disconnect();
  }, []);

  const handleAction = async (alertId, actionName) => {
    try {
      await fetch('http://localhost:3001/api/alerts/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId, action: actionName })
      });
      await loadAlerts();
      if (selectedAlert && selectedAlert.id === alertId) {
        setSelectedAlert(prev => ({ ...prev, status: actionName }));
      }
    } catch (e) {}
  };

  return (
    <div className="flex-col gap-3" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: '8px', flexShrink: 0 }}>
        <div>
          <h1 className="heading-1" style={{ margin: 0 }}>Alerts Center & Incident Triage</h1>
          <p className="text-subtitle">SOC analyst incident investigation queue and containment workflows</p>
        </div>
      </div>

      <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {alerts.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '48px', color: 'var(--color-green-500)', marginBottom: '12px' }}>check_circle</span>
              <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>All incidents triaged</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>No active USB security alerts require analyst attention.</div>
            </div>
          )}
          {alerts.map((alt) => (
            <div key={alt.id} style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-red-50)', color: 'var(--color-red-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-rounded">warning</span>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-text-primary)' }}>{alt.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    Device: {alt.device} ({alt.vid}:{alt.pid}) | User: {alt.user} | Status: <strong>{alt.status || 'Active'}</strong>
                  </div>
                  {alt.mitreTechnique && (
                    <div style={{ fontSize: '11px', color: 'var(--color-blue-600)', fontFamily: 'monospace', marginTop: '2px' }}>
                      {alt.mitreTechnique}
                    </div>
                  )}
                </div>
              </div>

              {/* Triage Action Menu */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="badge badge-danger">{alt.severity}</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => handleAction(alt.id, 'Acknowledged')}>
                    Acknowledge
                  </button>
                  <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px', color: 'var(--color-red-600)' }} onClick={() => handleAction(alt.id, 'Escalated')}>
                    Escalate
                  </button>
                  <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px', color: 'var(--color-green-600)' }} onClick={() => handleAction(alt.id, 'Closed')}>
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
