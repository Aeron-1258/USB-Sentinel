import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ConnectionGraph({ data }) {
  return (
    <div className="card" style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header" style={{ marginBottom: '16px' }}>
        <h2 className="heading-2" style={{ margin: 0, fontSize: '16px' }}>Connection Velocity (Operations/sec)</h2>
        <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-blue-500)', borderRadius: '2px' }}/> Read</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-orange-500)', borderRadius: '2px' }}/> Write</span>
        </div>
      </div>
      
      <div style={{ flex: 1, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRead" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-blue-500)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-blue-500)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorWrite" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-orange-500)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-orange-500)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-light)" />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-tertiary)', fontSize: 11 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-tertiary)', fontSize: 11 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)', fontSize: '12px' }}
              labelStyle={{ color: 'var(--color-text-secondary)', marginBottom: '4px', fontWeight: 600 }}
              itemStyle={{ padding: '2px 0' }}
            />
            <Area type="monotone" dataKey="read" stroke="var(--color-blue-500)" strokeWidth={2} fillOpacity={1} fill="url(#colorRead)" isAnimationActive={false} />
            <Area type="monotone" dataKey="write" stroke="var(--color-orange-500)" strokeWidth={2} fillOpacity={1} fill="url(#colorWrite)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
