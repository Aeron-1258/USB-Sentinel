import React, { useState, useEffect } from 'react';

export default function DeviceCard({ device, onAction, onClick }) {
  const [isNew, setIsNew] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsNew(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (device.removing) {
      setIsRemoving(true);
    }
  }, [device.removing]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Authorized': return 'var(--color-green-500)';
      case 'Blocked': return 'var(--color-red-500)';
      case 'Quarantine': return 'var(--color-orange-500)';
      default: return 'var(--color-blue-500)';
    }
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'Storage': return 'usb';
      case 'HID': return 'keyboard';
      case 'Security': return 'security';
      default: return 'cable';
    }
  };

  return (
    <div 
      className={`card ${isNew ? 'device-card-enter' : ''} ${isRemoving ? 'device-card-exit' : ''}`}
      style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
      onClick={() => onClick && onClick(device.id)}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: getStatusColor(device.status) }} />

      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-rounded icon-filled" style={{ fontSize: '28px', color: 'var(--color-text-secondary)' }}>
            {getDeviceIcon(device.type)}
          </span>
        </div>
        
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{device.product}</h3>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{device.vendor}</div>
        </div>
        
        <div className={`badge ${device.status === 'Authorized' ? 'badge-success' : device.status === 'Blocked' ? 'badge-danger' : 'badge-warning'}`}>
          {device.status}
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
        <div>
          <span style={{ color: 'var(--color-text-tertiary)' }}>Serial Number</span>
          <div style={{ fontWeight: 500, fontFamily: 'monospace' }}>{device.serial}</div>
        </div>
        <div>
          <span style={{ color: 'var(--color-text-tertiary)' }}>Connection Time</span>
          <div style={{ fontWeight: 500 }}>{device.time}</div>
        </div>
        <div>
          <span style={{ color: 'var(--color-text-tertiary)' }}>Health</span>
          <div style={{ fontWeight: 500, color: 'var(--color-green-600)' }}>{device.health}%</div>
        </div>
        <div>
          <span style={{ color: 'var(--color-text-tertiary)' }}>Host</span>
          <div style={{ fontWeight: 500 }}>{device.host}</div>
        </div>
      </div>
      
      <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', borderTop: '1px solid var(--color-border-light)', paddingTop: '16px' }}>
        <button 
          className="btn" 
          style={{ flex: 1, backgroundColor: 'var(--color-green-50)', color: 'var(--color-green-700)' }}
          onClick={(e) => { e.stopPropagation(); onAction(device.id, 'Allow'); }}
        >
          Allow
        </button>
        <button 
          className="btn" 
          style={{ flex: 1, backgroundColor: 'var(--color-red-50)', color: 'var(--color-red-700)' }}
          onClick={(e) => { e.stopPropagation(); onAction(device.id, 'Block'); }}
        >
          Block
        </button>
        <button 
          className="btn" 
          style={{ flex: 1, backgroundColor: 'var(--color-orange-50)', color: 'var(--color-orange-700)' }}
          onClick={(e) => { e.stopPropagation(); onAction(device.id, 'Isolate'); }}
        >
          Isolate
        </button>
      </div>
    </div>
  );
}
