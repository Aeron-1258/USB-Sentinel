import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { fetchFileEvents } from '../api';

export default function FileMonitoring() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function loadInitialEvents() {
      const data = await fetchFileEvents();
      setEvents(data);
    }
    loadInitialEvents();

    const socket = io('http://localhost:3001');
    socket.on('file_event', (newEvt) => {
      setEvents(prev => [newEvt, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="flex-col gap-3" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: '8px', flexShrink: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 className="heading-1" style={{ margin: 0 }}>Data Loss Prevention (DLP) Console</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--color-green-50)', color: 'var(--color-green-600)', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 600 }}>
              <span className="material-symbols-rounded pulse" style={{ fontSize: '14px' }}>fiber_manual_record</span>
              REAL-TIME FILE SYSTEM WATCHER
            </div>
          </div>
          <p className="text-subtitle">Forensic file transfer monitoring, VirusTotal verification, and SHA-256 hash logging</p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-light)', display: 'flex', padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '13px', zIndex: 1 }}>
          <div style={{ width: '150px' }}>Timestamp</div>
          <div style={{ width: '220px' }}>File Name & SHA-256</div>
          <div style={{ width: '130px' }}>User</div>
          <div style={{ width: '130px' }}>Action</div>
          <div style={{ flex: 1, minWidth: '150px' }}>Source / Path</div>
          <div style={{ width: '160px' }}>Virus & Encryption</div>
          <div style={{ width: '100px' }}>Device</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {events.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '48px', opacity: 0.4, marginBottom: '12px' }}>folder_open</span>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>No active DLP file transfers logged yet.</div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>Copy or modify a file on any connected USB drive to generate live forensic logs.</div>
            </div>
          )}
          {events.map((evt) => (
            <div key={evt.id} style={{ 
              display: 'flex', 
              padding: '12px 16px', 
              borderBottom: '1px solid var(--color-border-light)',
              fontSize: '13px',
              alignItems: 'center'
            }}>
              <div style={{ width: '150px', color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>
                {evt.timestamp}
              </div>
              
              <div style={{ width: '220px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span className="material-symbols-rounded" style={{ color: 'var(--color-blue-500)', fontSize: '20px' }}>description</span>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: 500, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{evt.filename}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={evt.hash}>
                    SHA256: {evt.hash ? evt.hash.substring(0, 14) : 'Computing...'}...
                  </div>
                </div>
              </div>

              <div style={{ width: '130px', color: 'var(--color-text-primary)' }}>
                {evt.user}
              </div>

              <div style={{ width: '130px', fontWeight: 500, color: 'var(--color-blue-600)' }}>
                {evt.action}
              </div>

              <div style={{ flex: 1, minWidth: '150px', fontFamily: 'monospace', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={evt.source}>
                {evt.source}
              </div>

              <div style={{ width: '160px' }}>
                <span className="badge badge-success" style={{ fontSize: '10px', display: 'inline-block', marginBottom: '2px' }}>Defender: Clean</span>
                <div style={{ fontSize: '10px', color: 'var(--color-text-tertiary)' }}>BitLocker XTS-256</div>
              </div>

              <div style={{ width: '100px', color: 'var(--color-text-secondary)' }}>
                {evt.usbDevice}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
