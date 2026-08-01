import React from 'react';

export default function DataTable() {
  const data = [
    { id: 'EVT-9021', device: 'SanDisk Ultra 64GB', user: 'jdoe@company.com', action: 'Write Blocked', time: '10:42 AM', status: 'Blocked' },
    { id: 'EVT-9020', device: 'YubiKey 5 NFC', user: 'asmith@company.com', action: 'Authentication', time: '10:15 AM', status: 'Authorized' },
    { id: 'EVT-9019', device: 'WD My Passport', user: 'mchen@company.com', action: 'Read Only', time: '09:30 AM', status: 'Monitored' },
    { id: 'EVT-9018', device: 'Unknown Mass Storage', user: 'SYSTEM', action: 'Device Attached', time: '09:01 AM', status: 'Quarantine' },
    { id: 'EVT-9017', device: 'Logitech Receiver', user: 'rlee@company.com', action: 'HID Allowed', time: '08:45 AM', status: 'Authorized' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Blocked': return 'badge-danger';
      case 'Authorized': return 'badge-success';
      case 'Quarantine': return 'badge-warning';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
      <div className="card-header" style={{ padding: 'var(--space-3)', margin: 0, borderBottom: '1px solid var(--color-border-light)' }}>
        <h2 className="heading-2" style={{ margin: 0 }}>Recent Activity Logs</h2>
        <button className="btn btn-secondary">
          <span className="material-symbols-rounded">filter_list</span>
          Filter
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg-base)', borderBottom: '1px solid var(--color-border-light)' }}>
              <th style={{ padding: '12px 24px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Event ID</th>
              <th style={{ padding: '12px 24px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Device</th>
              <th style={{ padding: '12px 24px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>User</th>
              <th style={{ padding: '12px 24px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Action</th>
              <th style={{ padding: '12px 24px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Time</th>
              <th style={{ padding: '12px 24px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Status</th>
              <th style={{ padding: '12px 24px', fontWeight: 600, color: 'var(--color-text-secondary)' }}></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background-color var(--transition-fast)' }} className="table-row">
                <td style={{ padding: '12px 24px', fontWeight: 500 }}>{row.id}</td>
                <td style={{ padding: '12px 24px' }}>{row.device}</td>
                <td style={{ padding: '12px 24px', color: 'var(--color-text-secondary)' }}>{row.user}</td>
                <td style={{ padding: '12px 24px' }}>{row.action}</td>
                <td style={{ padding: '12px 24px', color: 'var(--color-text-secondary)' }}>{row.time}</td>
                <td style={{ padding: '12px 24px' }}>
                  <span className={`badge ${getStatusBadge(row.status)}`}>{row.status}</span>
                </td>
                <td style={{ padding: '12px 24px', textAlign: 'right' }}>
                  <button className="btn-icon" style={{ width: '32px', height: '32px' }}>
                    <span className="material-symbols-rounded" style={{ fontSize: '20px' }}>more_vert</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Simple style block for hover effect to avoid adding to components.css just for table row hover */}
      <style>{`
        .table-row:hover { background-color: var(--color-surface-hover); }
      `}</style>
    </div>
  );
}
