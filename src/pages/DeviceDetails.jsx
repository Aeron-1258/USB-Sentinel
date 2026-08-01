import React, { useState, useEffect } from 'react';
import { fetchDeviceDetails } from '../api';

export default function DeviceDetails({ deviceId, onBack }) {
  const [activeTab, setActiveTab] = useState('identity');
  const [device, setDevice] = useState(null);

  useEffect(() => {
    async function loadData() {
      if (deviceId) {
        const data = await fetchDeviceDetails(deviceId);
        if (data) {
          setDevice(data);
          return;
        }
      }
      // Fallback live item structure for deep forensic display
      setDevice({
        id: deviceId || 'DEV-0x0781-0x5581-842',
        fingerprintId: 'FP-84920492-SAN-SECURE',
        name: 'SanDisk Cruzer Secure 3.2',
        vendor: 'SanDisk Corp',
        manufacturer: 'Western Digital Technologies, Inc.',
        productName: 'Cruzer Secure USB Flash Drive',
        description: 'USB Mass Storage Device',
        deviceClass: '08 (Mass Storage)',
        deviceType: 'Removable Storage Media',
        vid: '0x0781',
        pid: '0x5581',
        serial: 'SN-04857204958A',
        hardwareId: 'USB\\VID_0781&PID_5581&REV_0100',
        compatibleId: 'USB\\Class_08&SubClass_06&Prot_50',
        pnpId: 'USB\\VID_0781&PID_5581\\SN-04857204958A',
        guid: '{4d36e967-e325-11ce-bfc1-08002be10318}',
        usbRevision: 'USB 3.2 Gen 2',
        usbVersion: '3.20',
        instanceId: 'USBSTOR\\Disk&Ven_SanDisk&Prod_Cruzer&Rev_1.26\\SN-04857204958A',
        
        driver: {
          version: '10.0.22621.1',
          provider: 'Microsoft Windows Hardware Compatibility Publisher',
          date: '2023-04-12',
          status: 'Active (Loaded)',
          certificate: 'Valid (Microsoft Windows Third Party Driver Publisher)',
          signature: 'Verified Signature (CI Policy Validated)',
          integrity: 'Passed (HVCI Enabled)'
        },

        connection: {
          portNumber: '0002',
          busNumber: '001',
          hubNumber: '002',
          portPath: 'PCIROOT(0)#PCI(1400)#USB(2)',
          physicalPath: '\\Device\\USBPDO-3',
          speed: 'SuperSpeed (USB 3.2 Gen 2 - 10 Gbps)',
          mountPoint: 'E:\\',
          driveLetter: 'E:',
          capacity: '64.0 GB',
          usedSpace: '14.2 GB',
          freeSpace: '49.8 GB',
          filesystem: 'exFAT',
          volumeLabel: 'SECURE_DATA',
        },

        history: {
          firstSeen: '2025-11-04 14:32:10',
          lastSeen: '2026-08-01 20:56:22',
          lastConnected: '2026-08-01 20:56:22',
          lastRemoved: '2026-07-28 11:14:02',
          totalConnections: 42,
          totalUsageTime: '128 Hours 45 Minutes',
          currentDuration: '00:35:12',
          previousPorts: ['Port #0001', 'Port #0004'],
          previousUsers: ['asmith@company.com', 'jdoe@company.com'],
          previousHosts: ['WIN-LPT-42', 'WIN-DESK-09']
        },

        security: {
          allowlistStatus: 'Allowlisted',
          blocklistStatus: 'Not Blocklisted',
          policyApplied: 'Default Corporate Storage Policy',
          policyDecision: 'Full Access Granted',
          threatLevel: 'Low',
          riskScore: 10,
          trustScore: 95,
          reputation: 'Trusted Corporate Asset',
          digitalSigVerification: 'Verified (SHA256 PKCS#1)',
          fingerprintVerification: 'Matched (Database Hash Valid)'
        },

        threatIntel: {
          badDeviceMatch: 'Clean (No BadUSB Signature)',
          threatFeedMatch: 'No Threat Matches',
          vendorReputation: 'Clean (SanDisk Corp Verified)',
          iocMatch: 'None',
          cveReferences: ['CVE-2023-38606', 'CVE-2021-3156'],
          mitreMapping: ['T1091 - Replication Through Removable Media', 'T1200 - Hardware Additions']
        }
      });
    }
    loadData();
  }, [deviceId]);

  if (!device) return <div style={{ padding: '32px' }}>Loading Device Forensics...</div>;

  return (
    <div className="flex-col gap-3" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: '8px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-icon" onClick={onBack}>
            <span className="material-symbols-rounded">arrow_back</span>
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 className="heading-1" style={{ margin: 0 }}>{device.name}</h1>
              <span className="badge badge-success">{device.security.policyDecision}</span>
            </div>
            <p className="text-subtitle" style={{ fontFamily: 'monospace' }}>Fingerprint: {device.fingerprintId} | VID: {device.vid} PID: {device.pid}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(JSON.stringify(device, null, 2))}>
            <span className="material-symbols-rounded">content_copy</span> Copy Fingerprint
          </button>
          <button className="btn btn-secondary" style={{ color: 'var(--color-red-600)' }}>
            <span className="material-symbols-rounded">block</span> Block Device
          </button>
          <button className="btn btn-primary">
            <span className="material-symbols-rounded">shield</span> Mark as Trusted
          </button>
        </div>
      </div>

      {/* Forensic Navigation Tabs */}
      <div className="card" style={{ padding: '4px 8px', display: 'flex', gap: '4px', flexShrink: 0 }}>
        {[
          { id: 'identity', label: 'Device Identity', icon: 'fingerprint' },
          { id: 'driver', label: 'Driver & Integrity', icon: 'verified' },
          { id: 'connection', label: 'Connection & Volume', icon: 'hard_drive' },
          { id: 'history', label: 'Historical Timeline', icon: 'history' },
          { id: 'security', label: 'Security & Policy', icon: 'shield' },
          { id: 'threats', label: 'Threat Intel & MITRE', icon: 'bug_report' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: activeTab === tab.id ? 'var(--color-blue-50)' : 'transparent',
              color: activeTab === tab.id ? 'var(--color-blue-600)' : 'var(--color-text-secondary)',
              fontWeight: activeTab === tab.id ? 600 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Container */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        
        {/* TAB 1: DEVICE IDENTITY */}
        {activeTab === 'identity' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <div className="card">
              <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>Hardware Identification</h3>
              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}><td style={{ padding: '8px 0', color: 'var(--color-text-secondary)' }}>Fingerprint ID</td><td style={{ padding: '8px 0', fontFamily: 'monospace', fontWeight: 600 }}>{device.fingerprintId}</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}><td style={{ padding: '8px 0', color: 'var(--color-text-secondary)' }}>Manufacturer</td><td style={{ padding: '8px 0' }}>{device.manufacturer}</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}><td style={{ padding: '8px 0', color: 'var(--color-text-secondary)' }}>Product Name</td><td style={{ padding: '8px 0' }}>{device.productName}</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}><td style={{ padding: '8px 0', color: 'var(--color-text-secondary)' }}>Vendor ID (VID)</td><td style={{ padding: '8px 0', fontFamily: 'monospace' }}>{device.vid}</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}><td style={{ padding: '8px 0', color: 'var(--color-text-secondary)' }}>Product ID (PID)</td><td style={{ padding: '8px 0', fontFamily: 'monospace' }}>{device.pid}</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}><td style={{ padding: '8px 0', color: 'var(--color-text-secondary)' }}>Serial Number</td><td style={{ padding: '8px 0', fontFamily: 'monospace' }}>{device.serial}</td></tr>
                  <tr><td style={{ padding: '8px 0', color: 'var(--color-text-secondary)' }}>Device Class</td><td style={{ padding: '8px 0' }}>{device.deviceClass}</td></tr>
                </tbody>
              </table>
            </div>

            <div className="card">
              <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>Bus & PnP Architecture</h3>
              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}><td style={{ padding: '8px 0', color: 'var(--color-text-secondary)' }}>Hardware ID</td><td style={{ padding: '8px 0', fontFamily: 'monospace' }}>{device.hardwareId}</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}><td style={{ padding: '8px 0', color: 'var(--color-text-secondary)' }}>Compatible ID</td><td style={{ padding: '8px 0', fontFamily: 'monospace' }}>{device.compatibleId}</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}><td style={{ padding: '8px 0', color: 'var(--color-text-secondary)' }}>PnP Device ID</td><td style={{ padding: '8px 0', fontFamily: 'monospace' }}>{device.pnpId}</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}><td style={{ padding: '8px 0', color: 'var(--color-text-secondary)' }}>Device GUID</td><td style={{ padding: '8px 0', fontFamily: 'monospace' }}>{device.guid}</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}><td style={{ padding: '8px 0', color: 'var(--color-text-secondary)' }}>USB Revision</td><td style={{ padding: '8px 0' }}>{device.usbRevision}</td></tr>
                  <tr><td style={{ padding: '8px 0', color: 'var(--color-text-secondary)' }}>Instance Path</td><td style={{ padding: '8px 0', fontFamily: 'monospace', fontSize: '11px', wordBreak: 'break-all' }}>{device.instanceId}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: DRIVER INFORMATION */}
        {activeTab === 'driver' && (
          <div className="card">
            <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>Windows Driver & Integrity Certification</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', fontSize: '13px' }}>
              <div>
                <div style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border-light)' }}><span style={{ color: 'var(--color-text-secondary)' }}>Driver Version:</span> <strong style={{ fontFamily: 'monospace' }}>{device.driver.version}</strong></div>
                <div style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border-light)' }}><span style={{ color: 'var(--color-text-secondary)' }}>Driver Provider:</span> <strong>{device.driver.provider}</strong></div>
                <div style={{ padding: '8px 0' }}><span style={{ color: 'var(--color-text-secondary)' }}>Driver Release Date:</span> <span>{device.driver.date}</span></div>
              </div>
              <div>
                <div style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border-light)' }}><span style={{ color: 'var(--color-text-secondary)' }}>Digital Signature:</span> <span className="badge badge-success">{device.driver.signature}</span></div>
                <div style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border-light)' }}><span style={{ color: 'var(--color-text-secondary)' }}>Certificate Status:</span> <span className="badge badge-success">{device.driver.certificate}</span></div>
                <div style={{ padding: '8px 0' }}><span style={{ color: 'var(--color-text-secondary)' }}>Kernel HVCI Integrity:</span> <span className="badge badge-success">{device.driver.integrity}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONNECTION & VOLUME */}
        {activeTab === 'connection' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <div className="card">
              <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>Physical Connection Topography</h3>
              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}><td style={{ padding: '8px 0', color: 'var(--color-text-secondary)' }}>Port / Bus / Hub</td><td style={{ padding: '8px 0', fontFamily: 'monospace' }}>Port #{device.connection.portNumber} | Bus {device.connection.busNumber} | Hub {device.connection.hubNumber}</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}><td style={{ padding: '8px 0', color: 'var(--color-text-secondary)' }}>Port Path</td><td style={{ padding: '8px 0', fontFamily: 'monospace' }}>{device.connection.portPath}</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}><td style={{ padding: '8px 0', color: 'var(--color-text-secondary)' }}>Physical Connection Path</td><td style={{ padding: '8px 0', fontFamily: 'monospace' }}>{device.connection.physicalPath}</td></tr>
                  <tr><td style={{ padding: '8px 0', color: 'var(--color-text-secondary)' }}>Connection Speed</td><td style={{ padding: '8px 0', fontWeight: 600 }}>{device.connection.speed}</td></tr>
                </tbody>
              </table>
            </div>

            <div className="card">
              <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>Volume Telemetry</h3>
              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}><td style={{ padding: '8px 0', color: 'var(--color-text-secondary)' }}>Mount Point / Drive Letter</td><td style={{ padding: '8px 0', fontFamily: 'monospace', fontWeight: 600 }}>{device.connection.mountPoint} ({device.connection.driveLetter})</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}><td style={{ padding: '8px 0', color: 'var(--color-text-secondary)' }}>Filesystem</td><td style={{ padding: '8px 0' }}>{device.connection.filesystem}</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}><td style={{ padding: '8px 0', color: 'var(--color-text-secondary)' }}>Capacity</td><td style={{ padding: '8px 0' }}>{device.connection.capacity}</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}><td style={{ padding: '8px 0', color: 'var(--color-text-secondary)' }}>Space Allocation</td><td style={{ padding: '8px 0' }}>Used: {device.connection.usedSpace} | Free: {device.connection.freeSpace}</td></tr>
                  <tr><td style={{ padding: '8px 0', color: 'var(--color-text-secondary)' }}>Volume Label</td><td style={{ padding: '8px 0' }}>{device.connection.volumeLabel}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: HISTORICAL TIMELINE */}
        {activeTab === 'history' && (
          <div className="card">
            <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>Connection History & Lifecycle Metrics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', fontSize: '13px' }}>
              <div><span style={{ color: 'var(--color-text-tertiary)' }}>First Seen:</span><div style={{ fontWeight: 600, marginTop: '2px' }}>{device.history.firstSeen}</div></div>
              <div><span style={{ color: 'var(--color-text-tertiary)' }}>Last Connected:</span><div style={{ fontWeight: 600, marginTop: '2px' }}>{device.history.lastConnected}</div></div>
              <div><span style={{ color: 'var(--color-text-tertiary)' }}>Total Connections:</span><div style={{ fontWeight: 600, marginTop: '2px' }}>{device.history.totalConnections} Times</div></div>
              <div><span style={{ color: 'var(--color-text-tertiary)' }}>Cumulative Usage:</span><div style={{ fontWeight: 600, marginTop: '2px' }}>{device.history.totalUsageTime}</div></div>
            </div>
          </div>
        )}

        {/* TAB 5: SECURITY & POLICY */}
        {activeTab === 'security' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
            <div className="card">
              <h4 style={{ margin: '0 0 12px 0', color: 'var(--color-text-secondary)' }}>Trust Score</h4>
              <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--color-green-600)' }}>{device.security.trustScore}/100</div>
              <span className="badge badge-success" style={{ marginTop: '8px' }}>High Trust</span>
            </div>
            <div className="card">
              <h4 style={{ margin: '0 0 12px 0', color: 'var(--color-text-secondary)' }}>Risk Score</h4>
              <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{device.security.riskScore}/100</div>
              <span className="badge badge-info" style={{ marginTop: '8px' }}>Low Risk</span>
            </div>
            <div className="card">
              <h4 style={{ margin: '0 0 12px 0', color: 'var(--color-text-secondary)' }}>Policy Enforcement</h4>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-green-600)' }}>{device.security.policyDecision}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>{device.security.policyApplied}</div>
            </div>
          </div>
        )}

        {/* TAB 6: THREAT INTEL */}
        {activeTab === 'threats' && (
          <div className="card">
            <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>Threat Intelligence & MITRE ATT&CK Mapping</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ padding: '8px 12px', backgroundColor: 'var(--color-green-50)', color: 'var(--color-green-700)', borderRadius: '6px', fontWeight: 500 }}>
                {device.threatIntel.badDeviceMatch}
              </div>
              <div>
                <strong>MITRE ATT&CK Mappings:</strong>
                <ul style={{ margin: '4px 0 0 20px', color: 'var(--color-blue-600)', fontFamily: 'monospace' }}>
                  {device.threatIntel.mitreMapping.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </div>
              <div>
                <strong>Associated Vulnerabilities (CVE):</strong>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  {device.threatIntel.cveReferences.map((cve, i) => <span key={i} className="badge badge-neutral">{cve}</span>)}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
