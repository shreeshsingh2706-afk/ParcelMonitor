"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { platformDistribution } from "@/lib/mockData";

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-4 py-3 rounded-xl"
        style={{
          background: "rgba(7, 12, 30, 0.95)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: payload[0].payload.color }}
          />
          <p className="text-sm font-medium text-white">{payload[0].name}</p>
        </div>
        <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>
          {payload[0].value} orders ({Math.round((payload[0].value / 100) * 100)}%)
        </p>
      </div>
    );
  }
  return null;
};

export default function PlatformDoughnut() {
  const total = platformDistribution.reduce((sum, p) => sum + p.value, 0);

  return (
    <div className="chart-container">
      <div className="mb-5">
        <h3 className="font-semibold text-white text-sm">Platform Distribution</h3>
        <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
          Orders breakdown by platform
        </p>
      </div>

      <div className="flex items-center gap-6">
        {/* Donut */}
        <div className="relative flex-shrink-0">
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={platformDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {platformDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-2xl font-bold text-white">{total}</p>
            <p className="text-xs" style={{ color: "#94A3B8" }}>
              orders
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3">
          {platformDistribution.map((item) => {
            const pct = Math.round((item.value / total) * 100);
            return (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: item.color }}
                    />
                    <span className="text-xs" style={{ color: "#94A3B8" }}>
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-white">{pct}%</span>
                </div>
                {/* Progress bar */}
                <div
                  className="w-full rounded-full overflow-hidden"
                  style={{
                    height: 3,
                    background: "rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: item.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
