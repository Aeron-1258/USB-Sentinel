import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const trendData = [
  { name: "Mon", dataGB: 12, threats: 4, trustScore: 94 },
  { name: "Tue", dataGB: 19, threats: 3, trustScore: 92 },
  { name: "Wed", dataGB: 15, threats: 7, trustScore: 88 },
  { name: "Thu", dataGB: 22, threats: 2, trustScore: 91 },
  { name: "Fri", dataGB: 35, threats: 8, trustScore: 85 },
  { name: "Sat", dataGB: 8, threats: 1, trustScore: 95 },
  { name: "Sun", dataGB: 4, threats: 0, trustScore: 98 },
];

const pieData = [
  { name: "Authorized", value: 850, color: "var(--color-green-500)" },
  { name: "Blocked", value: 120, color: "var(--color-red-500)" },
  { name: "Quarantine", value: 30, color: "var(--color-orange-500)" },
];

const fileTypeData = [
  { name: "PDF", value: 450, color: "var(--color-red-500)" },
  { name: "Excel", value: 320, color: "var(--color-green-500)" },
  { name: "Word", value: 210, color: "var(--color-blue-500)" },
  { name: "Images", value: 150, color: "var(--color-yellow-500)" },
  { name: "Archives", value: 95, color: "var(--color-orange-500)" },
];

const topUsersData = [
  { name: "jdoe", count: 145 },
  { name: "asmith", count: 112 },
  { name: "mchen", count: 98 },
  { name: "rpatel", count: 75 },
];

const topVendorsData = [
  { name: "SanDisk", count: 450 },
  { name: "Kingston", count: 320 },
  { name: "Logitech", count: 280 },
  { name: "Samsung", count: 150 },
];

export function DataMovementChart() {
  return (
    <div
      className="card"
      style={{ flex: 1, height: "300px", display: "flex", flexDirection: "column" }}
    >
      <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", color: "var(--color-text-secondary)" }}>
        Data Movement (GB)
      </h3>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorData" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-blue-500)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-blue-500)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--color-border-light)"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
              }}
              itemStyle={{ color: "var(--color-text-primary)" }}
            />
            <Area
              type="monotone"
              dataKey="dataGB"
              stroke="var(--color-blue-500)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorData)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TrustScoreTrendChart() {
  return (
    <div
      className="card"
      style={{ flex: 1, height: "300px", display: "flex", flexDirection: "column" }}
    >
      <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", color: "var(--color-text-secondary)" }}>
        Average Trust Score Trend
      </h3>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--color-border-light)"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
            />
            <YAxis
              domain={[50, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
              }}
              itemStyle={{ color: "var(--color-green-500)", fontWeight: 600 }}
            />
            <Line
              type="monotone"
              dataKey="trustScore"
              stroke="var(--color-green-500)"
              strokeWidth={3}
              dot={{ r: 4, fill: "var(--color-green-500)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function DeviceStatusPieChart() {
  return (
    <div
      className="card"
      style={{ flex: 1, height: "300px", display: "flex", flexDirection: "column" }}
    >
      <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", color: "var(--color-text-secondary)" }}>
        Device Status Ratio
      </h3>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function FileTypesPieChart() {
  return (
    <div
      className="card"
      style={{ flex: 1, height: "300px", display: "flex", flexDirection: "column" }}
    >
      <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", color: "var(--color-text-secondary)" }}>
        Top File Types Transferred
      </h3>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={fileTypeData}
              innerRadius={40}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {fileTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TopUsersBarChart() {
  return (
    <div
      className="card"
      style={{ flex: 1, height: "300px", display: "flex", flexDirection: "column" }}
    >
      <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", color: "var(--color-text-secondary)" }}>
        Most Active Users
      </h3>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topUsersData}
            layout="vertical"
            margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              stroke="var(--color-border-light)"
            />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
            />
            <Tooltip
              cursor={{ fill: "var(--color-surface-hover)" }}
              contentStyle={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            />
            <Bar dataKey="count" fill="var(--color-blue-400)" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TopVendorsBarChart() {
  return (
    <div
      className="card"
      style={{ flex: 1, height: "300px", display: "flex", flexDirection: "column" }}
    >
      <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", color: "var(--color-text-secondary)" }}>
        Top Hardware Vendors
      </h3>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topVendorsData}
            layout="vertical"
            margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              stroke="var(--color-border-light)"
            />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
            />
            <Tooltip
              cursor={{ fill: "var(--color-surface-hover)" }}
              contentStyle={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            />
            <Bar dataKey="count" fill="var(--color-blue-600)" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ActivityHeatMap() {
  // Same heatmap as before to preserve functionality
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const getIntensity = (day, hour) => {
    const isWeekend = day === 5 || day === 6;
    const isWorkingHours = hour > 8 && hour < 18;
    let base = 0;
    if (!isWeekend && isWorkingHours) base = 3;
    else if (!isWeekend) base = 1;
    return Math.max(0, Math.min(4, base + Math.floor(Math.random() * 3) - 1));
  };
  const getColor = (intensity) => {
    switch (intensity) {
      case 0:
        return "var(--color-bg-base)";
      case 1:
        return "var(--color-blue-100)";
      case 2:
        return "var(--color-blue-300)";
      case 3:
        return "var(--color-blue-500)";
      case 4:
        return "var(--color-blue-700)";
      default:
        return "var(--color-bg-base)";
    }
  };

  return (
    <div
      className="card"
      style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column" }}
    >
      <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", color: "var(--color-text-secondary)" }}>
        Activity Heat Map (Connections per Hour)
      </h3>
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", paddingTop: "20px" }}>
          {days.map((d) => (
            <div
              key={d}
              style={{
                height: "16px",
                fontSize: "11px",
                color: "var(--color-text-tertiary)",
                display: "flex",
                alignItems: "center",
              }}
            >
              {d}
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
            {hours.map((h) => (
              <div
                key={h}
                style={{
                  width: "16px",
                  fontSize: "10px",
                  color: "var(--color-text-tertiary)",
                  textAlign: "center",
                }}
              >
                {h % 2 === 0 ? h : ""}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {days.map((day, dIdx) => (
              <div key={day} style={{ display: "flex", gap: "4px" }}>
                {hours.map((hour) => {
                  const intensity = getIntensity(dIdx, hour);
                  return (
                    <div
                      key={`${day}-${hour}`}
                      title={`${day} ${hour}:00 - Intensity ${intensity}`}
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundColor: getColor(intensity),
                        borderRadius: "2px",
                        cursor: "crosshair",
                        transition: "transform 0.1s ease",
                      }}
                      onMouseEnter={(e) => (e.target.style.transform = "scale(1.2)")}
                      onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
