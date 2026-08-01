import React from 'react';
import { 
  DataMovementChart, 
  TrustScoreTrendChart, 
  DeviceStatusPieChart, 
  FileTypesPieChart,
  TopUsersBarChart,
  TopVendorsBarChart,
  ActivityHeatMap
} from '../components/analytics/AnalyticsCharts';

export default function AnalyticsDashboard() {
  return (
    <div className="flex-col gap-3" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingRight: '8px' }}>
      
      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: '8px', flexShrink: 0 }}>
        <div>
          <h1 className="heading-1" style={{ margin: 0 }}>Analytics & Reports</h1>
          <p className="text-subtitle">High-level enterprise visualization of USB activity and forensics</p>
        </div>
        <div className="flex gap-2">
          <div className="input-group" style={{ height: '36px' }}>
            <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>calendar_month</span>
            <select style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--color-text-primary)', fontSize: '13px', paddingRight: '12px', cursor: 'pointer' }}>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Quarter</option>
              <option>Year to Date</option>
            </select>
          </div>
          <button className="btn btn-primary">
            <span className="material-symbols-rounded">download</span> Generate Report
          </button>
        </div>
      </div>

      {/* Main Trends Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
        <DataMovementChart />
        <TrustScoreTrendChart />
      </div>

      {/* Breakdowns Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)' }}>
        <DeviceStatusPieChart />
        <FileTypesPieChart />
        <TopUsersBarChart />
        <TopVendorsBarChart />
      </div>

      {/* Heat Map */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-3)' }}>
        <ActivityHeatMap />
      </div>
      
      {/* Spacer */}
      <div style={{ height: '24px', flexShrink: 0 }} />

    </div>
  );
}
