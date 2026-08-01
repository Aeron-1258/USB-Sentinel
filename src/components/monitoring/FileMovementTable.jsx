import React from 'react';

export default function FileMovementTable({ files }) {
  
  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf': return { icon: 'picture_as_pdf', color: 'var(--color-red-500)' };
      case 'doc':
      case 'docx': return { icon: 'description', color: 'var(--color-blue-500)' };
      case 'xls':
      case 'xlsx':
      case 'csv': return { icon: 'table_chart', color: 'var(--color-green-500)' };
      case 'zip':
      case 'tar': return { icon: 'folder_zip', color: 'var(--color-orange-500)' };
      case 'jpg':
      case 'png': return { icon: 'image', color: 'var(--color-blue-600)' };
      default: return { icon: 'draft', color: 'var(--color-gray-500)' };
    }
  };

  const getActionBadge = (action) => {
    switch (action) {
      case 'Copied': return 'badge-info';
      case 'Deleted': return 'badge-danger';
      case 'Modified': return 'badge-warning';
      case 'Renamed': return 'badge-neutral';
      default: return 'badge-neutral';
    }
  };

  const getRiskBadge = (risk) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'badge-danger';
      case 'medium': return 'badge-warning';
      case 'low': return 'badge-success';
      default: return 'badge-neutral';
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', whiteSpace: 'nowrap' }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--color-surface)', zIndex: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>File Name</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Action</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Risk</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>User</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Source &rarr; Destination</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>USB Device</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Size</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Timestamp</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Hash (MD5)</th>
            </tr>
          </thead>
          <tbody>
            {files.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-tertiary)' }}>
                  Listening for file events...
                </td>
              </tr>
            ) : (
              files.map((file) => {
                const { icon, color } = getFileIcon(file.filename);
                return (
                  <tr key={file.id} className="table-row" style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background-color var(--transition-fast)' }}>
                    <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="material-symbols-rounded icon-filled" style={{ color, fontSize: '20px' }}>{icon}</span>
                      <span style={{ fontWeight: 500, color: 'var(--color-text-primary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={file.filename}>
                        {file.filename}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${getActionBadge(file.action)}`}>{file.action}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${getRiskBadge(file.risk)}`}>{file.risk}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>{file.user}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px' }} title={`${file.source} -> ${file.destination}`}>
                        {file.source} <span style={{ color: 'var(--color-text-tertiary)' }}>&rarr;</span> {file.destination}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>{file.usb}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>{formatSize(file.size)}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>{file.timestamp}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-tertiary)', fontFamily: 'monospace', fontSize: '11px' }}>
                      {file.hash.substring(0, 12)}...
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Required hover style for table row */}
      <style>{`
        .table-row:hover { background-color: var(--color-surface-hover); }
      `}</style>
    </div>
  );
}
