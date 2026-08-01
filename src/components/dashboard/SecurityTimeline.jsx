import React from 'react';

export default function SecurityTimeline() {
  const events = [
    { id: 1, type: 'critical', title: 'Unauthorized Mass Storage Detected', time: '10:42 AM', desc: 'SanDisk Ultra 64GB blocked on WIN-DESK-04.' },
    { id: 2, type: 'info', title: 'Policy Update Deployed', time: '09:00 AM', desc: 'Global USB read-only policy v2.4 applied to Engineering group.' },
    { id: 3, type: 'warning', title: 'Multiple Failed Authentications', time: 'Yesterday', desc: 'Unrecognized YubiKey attempted 5 logins on SRV-09.' },
    { id: 4, type: 'success', title: 'Weekly Audit Completed', time: 'Yesterday', desc: 'No compliance violations found in Executive group.' },
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'critical': return 'var(--color-red-500)';
      case 'warning': return 'var(--color-orange-500)';
      case 'success': return 'var(--color-green-500)';
      default: return 'var(--color-blue-500)';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'critical': return 'block';
      case 'warning': return 'warning';
      case 'success': return 'check_circle';
      default: return 'info';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="heading-2" style={{ margin: 0 }}>Security Timeline</h2>
        <button className="btn-icon">
          <span className="material-symbols-rounded">more_vert</span>
        </button>
      </div>
      
      <div style={{ paddingLeft: '8px', marginTop: '16px' }}>
        {events.map((event, index) => (
          <div key={event.id} style={{ display: 'flex', gap: '16px', marginBottom: index === events.length - 1 ? 0 : '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div 
                style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  backgroundColor: `var(--color-${event.type === 'critical' ? 'red' : event.type === 'warning' ? 'orange' : event.type === 'success' ? 'green' : 'blue'}-50)`,
                  color: getTypeColor(event.type),
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <span className="material-symbols-rounded icon-filled" style={{ fontSize: '18px' }}>
                  {getTypeIcon(event.type)}
                </span>
              </div>
              {index !== events.length - 1 && (
                <div style={{ width: '2px', flex: 1, backgroundColor: 'var(--color-border-light)', margin: '4px 0' }}></div>
              )}
            </div>
            
            <div style={{ flex: 1, paddingBottom: index === events.length - 1 ? 0 : '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <h4 style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                  {event.title}
                </h4>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                  {event.time}
                </span>
              </div>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                {event.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
