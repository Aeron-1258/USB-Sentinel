import React, { useState } from 'react';

// Custom CSS Toggle Switch Component
const Toggle = ({ checked, onChange, label }) => (
  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '12px' }}>
    <div style={{ position: 'relative', width: '40px', height: '24px' }}>
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange} 
        style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} 
      />
      <div style={{ 
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
        backgroundColor: checked ? 'var(--color-blue-500)' : 'var(--color-border)', 
        borderRadius: '12px', transition: '0.4s' 
      }}>
        <div style={{ 
          position: 'absolute', 
          height: '18px', width: '18px', 
          left: checked ? '18px' : '3px', 
          bottom: '3px', 
          backgroundColor: 'white', 
          borderRadius: '50%', 
          transition: '0.3s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
        }} />
      </div>
    </div>
    {label && <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{label}</span>}
  </label>
);

export default function Settings() {
  const [activeCategory, setActiveCategory] = useState('USB Policy');

  const categories = [
    { id: 'General', icon: 'settings' },
    { id: 'USB Policy', icon: 'policy' },
    { id: 'Notifications', icon: 'notifications' },
    { id: 'Email', icon: 'mail' },
    { id: 'Dark Mode', icon: 'dark_mode' },
    { id: 'Backup', icon: 'backup' },
    { id: 'Database', icon: 'database' },
    { id: 'Logs', icon: 'receipt_long' },
    { id: 'Security', icon: 'security' },
    { id: 'API', icon: 'api' },
  ];

  // Mock State for Settings
  const [usbSettings, setUsbSettings] = useState({ autoQuarantine: true, strictMode: false });
  const [notifySettings, setNotifySettings] = useState({ email: true, sms: false, slack: true });
  const [secSettings, setSecSettings] = useState({ mfa: true, sessionTimeout: '30' });

  const renderContent = () => {
    switch (activeCategory) {
      case 'USB Policy':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            <div>
              <h2 className="heading-2" style={{ borderBottom: '1px solid var(--color-border-light)', paddingBottom: '12px', marginBottom: '24px' }}>Global Enforcement</h2>
              
              <div style={{ display: 'grid', gap: '24px', maxWidth: '600px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>Default Action for Unknown Devices</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>What happens when a device without a recognized hardware ID is inserted.</div>
                  </div>
                  <select className="input-group" style={{ width: '150px', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                    <option>Block</option>
                    <option>Allow</option>
                    <option>Prompt User</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>Auto-Quarantine Threats</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Automatically isolate hosts if BadUSB signatures are detected.</div>
                  </div>
                  <Toggle checked={usbSettings.autoQuarantine} onChange={(e) => setUsbSettings({...usbSettings, autoQuarantine: e.target.checked})} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>Strict Mode (Whitelist Only)</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Deny all devices implicitly unless explicitly added to the global allowlist.</div>
                  </div>
                  <Toggle checked={usbSettings.strictMode} onChange={(e) => setUsbSettings({...usbSettings, strictMode: e.target.checked})} />
                </div>
              </div>
            </div>

            <div>
              <h2 className="heading-2" style={{ borderBottom: '1px solid var(--color-border-light)', paddingBottom: '12px', marginBottom: '24px' }}>Exceptions</h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Manage organizational unit (OU) exceptions in the Policy Management tab.</p>
              <button className="btn btn-secondary">Go to Policy Management</button>
            </div>

          </div>
        );

      case 'Notifications':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <h2 className="heading-2" style={{ borderBottom: '1px solid var(--color-border-light)', paddingBottom: '12px', marginBottom: '24px' }}>Alert Channels</h2>
              
              <div style={{ display: 'grid', gap: '24px', maxWidth: '600px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>Email Alerts</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Send critical alerts to SOC distribution list.</div>
                  </div>
                  <Toggle checked={notifySettings.email} onChange={(e) => setNotifySettings({...notifySettings, email: e.target.checked})} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>SMS Alerts</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Send text messages to on-call administrators for high-severity incidents.</div>
                  </div>
                  <Toggle checked={notifySettings.sms} onChange={(e) => setNotifySettings({...notifySettings, sms: e.target.checked})} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>Slack Integration</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Pipe audit logs and alerts into #soc-alerts channel.</div>
                  </div>
                  <Toggle checked={notifySettings.slack} onChange={(e) => setNotifySettings({...notifySettings, slack: e.target.checked})} />
                </div>
              </div>
            </div>
          </div>
        );

      case 'Dark Mode':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <h2 className="heading-2" style={{ borderBottom: '1px solid var(--color-border-light)', paddingBottom: '12px', marginBottom: '24px' }}>Theme & Appearance</h2>
              <div style={{ display: 'grid', gap: '24px', maxWidth: '600px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>Permanent Enterprise SOC Dark Mode</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Light mode is disabled to comply with 24/7 Security Operations Center low-light guidelines.</div>
                  </div>
                  <span className="badge badge-success">Enforced</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Security':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <h2 className="heading-2" style={{ borderBottom: '1px solid var(--color-border-light)', paddingBottom: '12px', marginBottom: '24px' }}>Dashboard Security</h2>
              
              <div style={{ display: 'grid', gap: '24px', maxWidth: '600px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>Enforce Multi-Factor Authentication (MFA)</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Require all analysts to use MFA when accessing this dashboard.</div>
                  </div>
                  <Toggle checked={secSettings.mfa} onChange={(e) => setSecSettings({...secSettings, mfa: e.target.checked})} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>Session Idle Timeout (Minutes)</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Automatically log out users after a period of inactivity.</div>
                  </div>
                  <input 
                    type="number" 
                    value={secSettings.sessionTimeout} 
                    onChange={(e) => setSecSettings({...secSettings, sessionTimeout: e.target.value})}
                    style={{ width: '80px', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)' }} 
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 className="heading-2" style={{ borderBottom: '1px solid var(--color-border-light)', paddingBottom: '12px' }}>{activeCategory} Settings</h2>
            <p style={{ color: 'var(--color-text-tertiary)', fontSize: '14px' }}>Configuration options for {activeCategory} are available in the enterprise edition.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex-col gap-3" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: '8px', flexShrink: 0 }}>
        <div>
          <h1 className="heading-1" style={{ margin: 0 }}>System Settings</h1>
          <p className="text-subtitle">Manage global configuration and organizational policies</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary">Discard Changes</button>
          <button className="btn btn-primary">Save Settings</button>
        </div>
      </div>

      {/* Master-Detail Layout */}
      <div className="card" style={{ flex: 1, padding: 0, display: 'flex', overflow: 'hidden' }}>
        
        {/* Left Pane (Master Navigation) */}
        <div style={{ 
          width: '260px', 
          borderRight: '1px solid var(--color-border-light)', 
          backgroundColor: 'var(--color-surface-hover)',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 0',
          overflowY: 'auto'
        }}>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                border: 'none',
                background: 'none',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                backgroundColor: activeCategory === cat.id ? 'var(--color-blue-50)' : 'transparent',
                color: activeCategory === cat.id ? 'var(--color-blue-700)' : 'var(--color-text-secondary)',
                borderRight: activeCategory === cat.id ? '3px solid var(--color-blue-500)' : '3px solid transparent',
                fontWeight: activeCategory === cat.id ? 600 : 500,
                fontSize: '14px',
                transition: 'background-color 0.2s ease'
              }}
            >
              <span className="material-symbols-rounded" style={{ fontSize: '20px' }}>{cat.icon}</span>
              {cat.id}
            </button>
          ))}
        </div>

        {/* Right Pane (Detail Configuration) */}
        <div style={{ flex: 1, padding: '40px 48px', overflowY: 'auto', backgroundColor: 'var(--color-surface)' }}>
          {renderContent()}
        </div>

      </div>

    </div>
  );
}
