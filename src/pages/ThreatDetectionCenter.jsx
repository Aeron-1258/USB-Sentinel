import React, { useState, useEffect } from 'react';

export default function ThreatDetectionCenter() {
  const [threats, setThreats] = useState([]);

  useEffect(() => {
    async function loadThreats() {
      try {
        const res = await fetch('http://localhost:3001/api/threats');
        const data = await res.json();
        setThreats(data);
      } catch (e) {
        setThreats([]);
      }
    }
    loadThreats();
  }, []);

  return (
    <div className="flex-col gap-3" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: '8px', flexShrink: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 className="heading-1" style={{ margin: 0 }}>Threat Intelligence Center</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--color-red-50)', color: 'var(--color-red-600)', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 600 }}>
              <span className="material-symbols-rounded pulse" style={{ fontSize: '14px' }}>security</span>
              LIVE THREAT FEED ACTIVE
            </div>
          </div>
          <p className="text-subtitle">Automated BadUSB detection, Rubber Ducky heuristics, and MITRE ATT&CK Framework mapping</p>
        </div>
      </div>

      {/* MITRE ATT&CK Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', flexShrink: 0 }}>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>MITRE T1200</span>
            <span className="badge badge-danger">High Alert</span>
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '8px' }}>Hardware Additions</div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', margin: '4px 0 0 0' }}>Monitors rogue PnP physical insertion and spoofed HID descriptors.</p>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>MITRE T1091</span>
            <span className="badge badge-warning">Active Monitoring</span>
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '8px' }}>Replication via Removable Media</div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', margin: '4px 0 0 0' }}>Prevents USB-borne worm replication and AutoRun execution.</p>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>MITRE T1052.001</span>
            <span className="badge badge-info">DLP Engine</span>
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '8px' }}>Exfiltration Over Removable Media</div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', margin: '4px 0 0 0' }}>Real-time cryptographic SHA-256 hash auditing on all written files.</p>
        </div>
      </div>

      {/* Live Threat Feed List */}
      <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--color-border-light)', backgroundColor: 'var(--color-surface)', fontWeight: 600, fontSize: '14px' }}>
          Detected Threats & Heuristics
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {threats.map((thr) => (
            <div key={thr.id} style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--color-red-50)', color: 'var(--color-red-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-rounded">gpp_bad</span>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-text-primary)' }}>{thr.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    Type: <strong>{thr.type}</strong> | VID: {thr.vid} | PID: {thr.pid} | CVE: {thr.cve}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-blue-600)', fontFamily: 'monospace', marginTop: '2px' }}>
                    {thr.mitre}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-danger">{thr.severity}</span>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  Confidence: {thr.confidence}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
