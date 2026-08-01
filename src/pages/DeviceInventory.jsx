import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { fetchDevices, triggerLiveScan } from '../api';

export default function DeviceInventory({ onDeviceClick }) {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null); // For Right-Side Drawer
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastScanTime, setLastScanTime] = useState(new Date().toLocaleTimeString());
  const [isScanning, setIsScanning] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);
  
  const rowsPerPage = 10;

  const loadInventory = async () => {
    const data = await fetchDevices();
    setDevices(data);
    setLastScanTime(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    loadInventory();

    // Listen for live PnP insertions and removals via WebSocket
    const socket = io('http://localhost:3001');

    socket.on('initial_devices', (data) => {
      setDevices(data);
      setLastScanTime(new Date().toLocaleTimeString());
    });

    socket.on('usb_inserted', (newDevice) => {
      setDevices(prev => {
        const exists = prev.some(d => d.id === newDevice.id);
        if (exists) return prev.map(d => d.id === newDevice.id ? newDevice : d);
        return [newDevice, ...prev];
      });
      setHighlightedId(newDevice.id);
      setTimeout(() => setHighlightedId(null), 4000); // Highlight for 4s
      setLastScanTime(new Date().toLocaleTimeString());
    });

    socket.on('usb_removed', (payload) => {
      setDevices(prev => prev.filter(d => !(d.vid === payload.vid && d.pid === payload.pid)));
      setLastScanTime(new Date().toLocaleTimeString());
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleManualRefresh = async () => {
    setIsScanning(true);
    await triggerLiveScan();
    await loadInventory();
    setIsScanning(false);
  };

  const handleExportCSV = () => {
    const headers = ["Device Name,Manufacturer,Class,VID,PID,Serial,HardwareID,Status,TrustScore,RiskScore,MountPoint\n"];
    const rows = filteredDevices.map(d => 
      `"${d.name}","${d.manufacturer || 'Generic'}","${d.class || 'USB'}","${d.vid}","${d.pid}","${d.serial}","${d.hardwareId || ''}","${d.status || 'OK'}","${d.trustScore || 90}","${d.riskScore || 10}","${d.mountPoint || 'N/A'}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Device_Inventory_${Date.now()}.csv`);
    a.click();
  };

  // Filter Logic
  const filteredDevices = devices.filter(dev => {
    const matchesSearch = Object.values(dev).some(val => 
      val !== null && val !== undefined && val.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesClass = classFilter === 'All' || dev.class === classFilter;
    const matchesStatus = statusFilter === 'All' || (dev.status || 'Connected') === statusFilter;
    const matchesRisk = riskFilter === 'All' || (dev.riskScore > 50 ? 'High' : 'Low') === riskFilter;

    return matchesSearch && matchesClass && matchesStatus && matchesRisk;
  });

  // Sorting
  const sortedDevices = [...filteredDevices].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedDevices.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = sortedDevices.slice(startIndex, startIndex + rowsPerPage);

  // Summary Metrics
  const totalCount = devices.length;
  const connectedCount = devices.filter(d => d.status !== 'Disconnected').length;
  const blockedCount = devices.filter(d => d.status === 'Blocked').length;
  const allowlistedCount = devices.filter(d => d.status === 'Authorized' || !d.status).length;
  const highRiskCount = devices.filter(d => d.riskScore > 50 || d.vid === 'Unknown').length;
  const quarantinedCount = devices.filter(d => d.status === 'Quarantined').length;
  const unknownCount = devices.filter(d => d.vid === 'Unknown').length;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Connected': case 'Authorized': case 'OK': return 'badge-success';
      case 'Disconnected': return 'badge-neutral';
      case 'Blocked': return 'badge-danger';
      case 'Read Only': return 'badge-warning';
      case 'Quarantined': return 'badge-purple';
      case 'Unknown': return 'badge-warning';
      default: return 'badge-success';
    }
  };

  const getRiskBadge = (riskScore) => {
    if (riskScore >= 75) return <span className="badge badge-danger">Critical</span>;
    if (riskScore >= 50) return <span className="badge badge-warning">High</span>;
    if (riskScore >= 25) return <span className="badge badge-neutral">Medium</span>;
    return <span className="badge badge-info">Low</span>;
  };

  return (
    <div className="flex-col gap-3" style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      
      {/* 1. PAGE HEADER */}
      <div className="flex justify-between items-center" style={{ marginBottom: '4px', flexShrink: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 className="heading-1" style={{ margin: 0 }}>Device Inventory</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--color-green-50)', color: 'var(--color-green-600)', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 600 }}>
              <span className="material-symbols-rounded pulse" style={{ fontSize: '14px' }}>fiber_manual_record</span>
              LIVE PnP FEED
            </div>
          </div>
          <p className="text-subtitle" style={{ margin: '2px 0 0 0' }}>Real-time inventory of all USB and Plug-and-Play devices connected to this endpoint.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
            Last Scan: <strong style={{ color: 'var(--color-text-secondary)' }}>{lastScanTime}</strong>
          </div>
          <button className="btn btn-secondary" onClick={handleManualRefresh} disabled={isScanning}>
            <span className={`material-symbols-rounded ${isScanning ? 'pulse' : ''}`} style={{ fontSize: '18px' }}>refresh</span> Refresh
          </button>
          <button className="btn btn-primary" onClick={handleExportCSV}>
            <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>download</span> Export CSV
          </button>
        </div>
      </div>

      {/* 2. SUMMARY CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 'var(--space-2)', flexShrink: 0 }}>
        <div className="card" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Total</div>
          <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>{totalCount}</div>
        </div>
        <div className="card" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-green-600)', fontWeight: 600, textTransform: 'uppercase' }}>Connected</div>
          <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px', color: 'var(--color-green-600)' }}>{connectedCount}</div>
        </div>
        <div className="card" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-blue-600)', fontWeight: 600, textTransform: 'uppercase' }}>Allowlisted</div>
          <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>{allowlistedCount}</div>
        </div>
        <div className="card" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-red-600)', fontWeight: 600, textTransform: 'uppercase' }}>Blocked</div>
          <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px', color: 'var(--color-red-600)' }}>{blockedCount}</div>
        </div>
        <div className="card" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-orange-600)', fontWeight: 600, textTransform: 'uppercase' }}>High Risk</div>
          <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px', color: 'var(--color-orange-600)' }}>{highRiskCount}</div>
        </div>
        <div className="card" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-purple-600)', fontWeight: 600, textTransform: 'uppercase' }}>Quarantined</div>
          <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px', color: 'var(--color-purple-600)' }}>{quarantinedCount}</div>
        </div>
        <div className="card" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-yellow-600)', fontWeight: 600, textTransform: 'uppercase' }}>Unknown</div>
          <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>{unknownCount}</div>
        </div>
      </div>

      {/* 3. SEARCH & FILTER TOOLBAR */}
      <div className="card" style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, gap: '12px' }}>
        <div className="input-group" style={{ width: '320px', height: '36px' }}>
          <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>search</span>
          <input 
            type="text" 
            placeholder="Search Name, VID, PID, Serial, Class..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select 
            value={classFilter} 
            onChange={(e) => setClassFilter(e.target.value)}
            style={{ height: '36px', padding: '0 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: '12px' }}
          >
            <option value="All">All Classes</option>
            <option value="USB">USB</option>
            <option value="Mass Storage">Mass Storage</option>
            <option value="HIDClass">HID (Keyboard/Mouse)</option>
            <option value="Bluetooth">Bluetooth</option>
          </select>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ height: '36px', padding: '0 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: '12px' }}
          >
            <option value="All">All Statuses</option>
            <option value="Connected">Connected / OK</option>
            <option value="Blocked">Blocked</option>
            <option value="Quarantined">Quarantined</option>
            <option value="Read Only">Read Only</option>
          </select>

          <select 
            value={riskFilter} 
            onChange={(e) => setRiskFilter(e.target.value)}
            style={{ height: '36px', padding: '0 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: '12px' }}
          >
            <option value="All">All Risk Levels</option>
            <option value="Low">Low Risk</option>
            <option value="High">High / Critical Risk</option>
          </select>
        </div>
      </div>

      {/* 4. ENTERPRISE ASSET INVENTORY TABLE */}
      <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', whiteSpace: 'nowrap' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--color-surface)', zIndex: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Device</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Manufacturer</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Class</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Hardware ID (VID:PID)</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Serial Number</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Trust Score</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Risk Level</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                    <span className="material-symbols-rounded" style={{ fontSize: '48px', opacity: 0.4, marginBottom: '12px' }}>usb_off</span>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>No USB devices detected.</div>
                    <div style={{ fontSize: '13px', marginTop: '4px' }}>Plug in a physical USB device to see real-time endpoint telemetry.</div>
                    <button className="btn btn-secondary" style={{ marginTop: '16px' }} onClick={handleManualRefresh}>
                      <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>refresh</span> Refresh Inventory
                    </button>
                  </td>
                </tr>
              )}
              {currentRows.map(dev => {
                const isHighlighted = dev.id === highlightedId;
                const trustScore = dev.trustScore || 90;
                const riskScore = dev.riskScore || (dev.vid === 'Unknown' ? 75 : 10);
                const status = dev.status || 'OK';

                return (
                  <tr 
                    key={dev.id} 
                    style={{ 
                      borderBottom: '1px solid var(--color-border-light)',
                      backgroundColor: isHighlighted ? 'var(--color-blue-50)' : 'transparent',
                      transition: 'background-color 0.5s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedDevice(dev)}
                  >
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="material-symbols-rounded" style={{ color: 'var(--color-blue-500)' }}>usb</span>
                        <div>
                          <div style={{ fontWeight: 600 }}>{dev.name}</div>
                          {dev.mountPoint && dev.mountPoint !== 'N/A' && (
                            <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontFamily: 'monospace' }}>Mount: {dev.mountPoint}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>{dev.manufacturer || 'Generic'}</td>
                    <td style={{ padding: '12px 16px' }}>{dev.class || 'USB'}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 500 }}>{dev.vid}:{dev.pid}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: 'var(--color-text-secondary)', fontSize: '12px' }}>{dev.serial}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${getStatusBadgeClass(status)}`}>{status}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '50px', height: '6px', backgroundColor: 'var(--color-border-light)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${trustScore}%`, height: '100%', backgroundColor: trustScore >= 80 ? 'var(--color-green-500)' : trustScore >= 50 ? 'var(--color-orange-500)' : 'var(--color-red-500)' }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>{trustScore}/100</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {getRiskBadge(riskScore)}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button className="btn-icon" title="View Drawer Details" onClick={() => setSelectedDevice(dev)}>
                          <span className="material-symbols-rounded">info</span>
                        </button>
                        <button className="btn-icon" title="Copy Hardware ID" onClick={() => navigator.clipboard.writeText(dev.hardwareId || `${dev.vid}:${dev.pid}`)}>
                          <span className="material-symbols-rounded">content_copy</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div style={{ borderTop: '1px solid var(--color-border-light)', padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-surface)', flexShrink: 0 }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            Showing {sortedDevices.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + rowsPerPage, sortedDevices.length)} of {sortedDevices.length} assets
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="btn-icon" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
              <span className="material-symbols-rounded">chevron_left</span>
            </button>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>{currentPage} / {totalPages || 1}</span>
            <button className="btn-icon" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}>
              <span className="material-symbols-rounded">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. RIGHT-SIDE DEVICE DETAILS DRAWER */}
      {selectedDevice && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '440px',
          height: '100%',
          backgroundColor: 'var(--color-surface)',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid var(--color-border)',
          transition: 'transform 0.3s ease'
        }}>
          {/* Drawer Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="material-symbols-rounded" style={{ color: 'var(--color-blue-600)', fontSize: '24px' }}>usb</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Asset Forensics Drawer</h3>
                <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontFamily: 'monospace' }}>{selectedDevice.id}</span>
              </div>
            </div>
            <button className="btn-icon" onClick={() => setSelectedDevice(null)}>
              <span className="material-symbols-rounded">close</span>
            </button>
          </div>

          {/* Drawer Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Asset Title Block */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--color-blue-50)', color: 'var(--color-blue-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-rounded" style={{ fontSize: '28px' }}>hard_drive</span>
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{selectedDevice.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{selectedDevice.manufacturer || 'Generic Manufacturer'}</div>
              </div>
            </div>

            {/* Quick Status Chips */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className={`badge ${getStatusBadgeClass(selectedDevice.status || 'OK')}`}>{selectedDevice.status || 'OK'}</span>
              <span className="badge badge-neutral">Class: {selectedDevice.class || 'USB'}</span>
              {selectedDevice.vid === 'Unknown' ? <span className="badge badge-danger">Unrecognized</span> : <span className="badge badge-success">Signed Driver</span>}
            </div>

            {/* Hardware Telemetry Table */}
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hardware Fingerprint</h4>
              <div className="card" style={{ padding: '12px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Vendor ID (VID):</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{selectedDevice.vid}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Product ID (PID):</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{selectedDevice.pid}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Serial Number:</span>
                  <span style={{ fontFamily: 'monospace', color: 'var(--color-text-tertiary)' }}>{selectedDevice.serial}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>PnP Instance ID:</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '10px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={selectedDevice.hardwareId}>
                    {selectedDevice.hardwareId}
                  </span>
                </div>
              </div>
            </div>

            {/* Volume Telemetry */}
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Volume Telemetry</h4>
              <div className="card" style={{ padding: '12px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Mount Point:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{selectedDevice.mountPoint || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Filesystem:</span>
                  <span>{selectedDevice.fileSystem || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Capacity:</span>
                  <span>{selectedDevice.capacity || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Policy Actions */}
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Policy Enforcement</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary" style={{ flex: 1, color: 'var(--color-green-600)' }}>
                  <span className="material-symbols-rounded" style={{ fontSize: '16px' }}>check_circle</span> Allowlist
                </button>
                <button className="btn btn-secondary" style={{ flex: 1, color: 'var(--color-red-600)' }}>
                  <span className="material-symbols-rounded" style={{ fontSize: '16px' }}>block</span> Block
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
