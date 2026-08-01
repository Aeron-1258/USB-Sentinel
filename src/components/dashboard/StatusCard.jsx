import React from 'react';

export default function StatusCard({ title, value, change, changeType, icon, color }) {
  const isPositive = changeType === 'positive';
  const isNegative = changeType === 'negative';
  
  return (
    <div className="card status-card">
      <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
        <h3 className="text-subtitle" style={{ fontWeight: 500 }}>{title}</h3>
        <span className="material-symbols-rounded icon-filled" style={{ color: `var(--color-${color}-500)` }}>
          {icon}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {value}
        </div>
        {change && (
          <div 
            className={`badge ${isPositive ? 'badge-success' : isNegative ? 'badge-danger' : 'badge-neutral'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '2px' }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 14 }}>
              {isPositive ? 'arrow_upward' : isNegative ? 'arrow_downward' : 'horizontal_rule'}
            </span>
            {change}
          </div>
        )}
      </div>
    </div>
  );
}
