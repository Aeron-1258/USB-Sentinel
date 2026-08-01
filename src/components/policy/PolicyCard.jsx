import React from 'react';

export default function PolicyCard({ device, selected, onSelect, onApprove, onEdit, onDelete }) {
  const getDeviceIcon = (type) => {
    switch (type) {
      case 'Storage': return 'usb';
      case 'HID': return 'keyboard';
      case 'Security': return 'security';
      default: return 'cable';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'var(--color-red-600)';
      case 'medium': return 'var(--color-orange-600)';
      case 'low': return 'var(--color-green-600)';
      default: return 'var(--color-text-secondary)';
    }
  };

  return (
    <div 
      className="card" 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '24px', 
        padding: '16px 24px',
        borderLeft: selected ? '4px solid var(--color-blue-500)' : '4px solid transparent',
        backgroundColor: selected ? 'var(--color-blue-50)' : 'var(--color-surface)',
        transition: 'all var(--transition-fast)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input 
          type="checkbox" 
          checked={selected} 
          onChange={(e) => onSelect(device.id, e.target.checked)}
          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
        />
      </div>

      <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: selected ? 'var(--color-surface)' : 'var(--color-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span className="material-symbols-rounded icon-filled" style={{ fontSize: '28px', color: 'var(--color-text-secondary)' }}>
          {getDeviceIcon(device.type)}
        </span>
      </div>

      <div style={{ flex: 1, minWidth: '200px' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{device.vendor}</h3>
        <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontFamily: 'monospace', marginTop: '4px' }}>{device.serial}</div>
      </div>

      <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Added By:</span>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{device.addedBy}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Time:</span>
          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{device.addedTime}</span>
        </div>
      </div>

      <div style={{ flex: 2 }}>
        <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', display: 'block', marginBottom: '4px' }}>Notes</span>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {device.notes}
        </p>
      </div>

      <div style={{ width: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginBottom: '4px' }}>Risk</span>
        <span style={{ fontSize: '13px', fontWeight: 600, color: getRiskColor(device.risk) }}>{device.risk}</span>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="btn-icon" title="Edit" onClick={() => onEdit(device.id)}>
          <span className="material-symbols-rounded" style={{ fontSize: '20px' }}>edit</span>
        </button>
        <button className="btn-icon" title="Approve / Move" onClick={() => onApprove(device.id)}>
          <span className="material-symbols-rounded" style={{ fontSize: '20px', color: 'var(--color-green-600)' }}>check_circle</span>
        </button>
        <button className="btn-icon" title="Delete" onClick={() => onDelete(device.id)}>
          <span className="material-symbols-rounded" style={{ fontSize: '20px', color: 'var(--color-red-600)' }}>delete</span>
        </button>
      </div>
    </div>
  );
}
