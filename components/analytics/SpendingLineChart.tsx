"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { spendingData } from "@/lib/mockData";

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-4 py-3 rounded-xl"
        style={{
          background: "rgba(7, 12, 30, 0.95)",
          border: "1px solid rgba(37,99,235,0.3)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        <p className="text-xs mb-1" style={{ color: "#94A3B8" }}>
          {label}
        </p>
        <p className="text-sm font-semibold text-white">
          ₹{payload[0].value.toLocaleString("en-IN")}
        </p>
      </div>
    );
  }
  return null;
};

export default function SpendingLineChart() {
  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-white text-sm">Monthly Spending</h3>
          <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
            Total spend across all platforms
          </p>
        </div>
        <div className="flex gap-2">
          {["3M", "6M", "1Y"].map((range, i) => (
            <button
              key={range}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
              style={
                i === 2
                  ? {
                      background: "rgba(37,99,235,0.15)",
                      color: "#60A5FA",
                      border: "1px solid rgba(37,99,235,0.25)",
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      color: "#94A3B8",
                    }
              }
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={spendingData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#475569" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#475569" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#2563EB"
            strokeWidth={2.5}
            fill="url(#spendGradient)"
            dot={false}
            activeDot={{
              r: 5,
              fill: "#2563EB",
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Stats row */}
      <div
        className="grid grid-cols-3 gap-4 mt-4 pt-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        {[
          { label: "Total Spent", value: "₹2,46,200" },
          { label: "Avg Monthly", value: "₹20,517" },
          { label: "Peak Month", value: "November" },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <p className="text-sm font-semibold text-white">{item.value}</p>
            <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
