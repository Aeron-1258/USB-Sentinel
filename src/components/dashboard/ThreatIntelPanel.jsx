import React from 'react';

export default function ThreatIntelPanel() {
  const intelFeeds = [
    { id: 'TI-01', source: 'CISA', indicator: 'VID_058F&PID_6387', type: 'BadUSB', risk: 'High' },
    { id: 'TI-02', source: 'Internal', indicator: 'RubberDucky_V2', type: 'Keystroke Inj.', risk: 'Critical' },
    { id: 'TI-03', source: 'CrowdStrike', indicator: 'VID_0951&PID_1666', type: 'Ransomware Vector', risk: 'High' },
  ];

  return (
    <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="card-header" style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-rounded icon-filled" style={{ color: 'var(--color-orange-500)' }}>radar</span>
          <h2 className="heading-2" style={{ margin: 0, fontSize: '16px' }}>Threat Intelligence</h2>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {intelFeeds.map(feed => (
          <div key={feed.id} style={{ padding: '8px', border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{feed.indicator}</span>
              <span className={`badge ${feed.risk === 'Critical' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '10px', padding: '0 4px' }}>
                {feed.risk}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
              <span>{feed.type}</span>
              <span>Source: {feed.source}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
