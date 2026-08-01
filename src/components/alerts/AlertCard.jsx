import React from 'react';

export default function AlertCard({ alert, onAction }) {
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'var(--color-red-600)';
      case 'high': return 'var(--color-orange-500)';
      case 'medium': return 'var(--color-yellow-500)';
      case 'low': return 'var(--color-blue-500)';
      default: return 'var(--color-gray-400)';
    }
  };
  
  const getSeverityIcon = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'warning';
      case 'high': return 'error';
      case 'medium': return 'info';
      case 'low': return 'notifications';
      default: return 'notifications';
    }
  };

  return (
    <div className="card" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      position: 'relative',
      overflow: 'hidden',
      borderLeft: `4px solid ${getSeverityColor(alert.severity)}`,
      padding: '20px 24px',
      gap: '16px'
    }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="material-symbols-rounded icon-filled" style={{ color: getSeverityColor(alert.severity), fontSize: '24px' }}>
            {getSeverityIcon(alert.severity)}
          </span>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {alert.title}
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', fontFamily: 'monospace' }}>{alert.time}</span>
          <span className={`badge ${alert.status === 'Resolved' ? 'badge-success' : alert.status === 'Unread' ? 'badge-danger' : 'badge-neutral'}`}>
            {alert.status}
          </span>
        </div>
      </div>

      {/* Body */}
      <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
        {alert.description}
      </p>

      {/* Metadata Grid */}
      <div style={{ display: 'flex', gap: '32px', backgroundColor: 'var(--color-surface-hover)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-light)' }}>
        <div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', display: 'block', marginBottom: '2px' }}>Target Device</span>
          <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'monospace' }}>{alert.device}</span>
        </div>
        <div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', display: 'block', marginBottom: '2px' }}>User Context</span>
          <span style={{ fontSize: '13px', fontWeight: 500 }}>{alert.user}</span>
        </div>
        <div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', display: 'block', marginBottom: '2px' }}>Severity</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: getSeverityColor(alert.severity) }}>{alert.severity.toUpperCase()}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
        <button className="btn btn-primary" onClick={() => onAction(alert.id, 'Investigate')}>
          <span className="material-symbols-rounded">search</span> Investigate
        </button>
        <button className="btn btn-secondary" onClick={() => onAction(alert.id, 'Assign')}>
          <span className="material-symbols-rounded">person_add</span> Assign
        </button>
        <button className="btn btn-secondary" onClick={() => onAction(alert.id, 'Mark Resolved')} style={{ color: 'var(--color-green-600)', borderColor: 'var(--color-green-200)' }}>
          <span className="material-symbols-rounded">check_circle</span> Mark Resolved
        </button>
        <div style={{ flex: 1 }} />
        <button className="btn btn-secondary" onClick={() => onAction(alert.id, 'Dismiss')} style={{ color: 'var(--color-text-tertiary)' }}>
          Dismiss
        </button>
      </div>

    </div>
  );
}
