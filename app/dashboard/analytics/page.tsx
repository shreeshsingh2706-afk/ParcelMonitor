"use client";

import { motion } from "framer-motion";
import SpendingLineChart from "@/components/analytics/SpendingLineChart";
import PlatformDoughnut from "@/components/analytics/PlatformDoughnut";
import { spendingData } from "@/lib/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const categoryData = [
  { category: "Electronics", amount: 156000 },
  { category: "Fashion", amount: 34000 },
  { category: "Appliances", amount: 45000 },
  { category: "Footwear", amount: 28000 },
  { category: "Kitchen", amount: 12000 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
        <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>
          Insights into your spending and shopping patterns
        </p>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Spent (2025)", value: "₹2,46,200", change: "+18%" },
          { label: "Avg Order Value", value: "₹2,487", change: "+5%" },
          { label: "Total Orders", value: "99", change: "+12%" },
          { label: "Saved via Sales", value: "₹18,400", change: "+32%" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass-card rounded-2xl p-5"
          >
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>
              {stat.label}
            </p>
            <p className="text-xs mt-2 font-medium" style={{ color: "#4ADE80" }}>
              {stat.change} vs last year
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingLineChart />
        <PlatformDoughnut />
      </div>

      {/* Category breakdown */}
      <div className="chart-container">
        <div className="mb-5">
          <h3 className="font-semibold text-white text-sm">Spending by Category</h3>
          <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
            Total amount spent per category
          </p>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={categoryData}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#2563EB" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="category"
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
            <Tooltip
              contentStyle={{
                background: "rgba(7,12,30,0.95)",
                border: "1px solid rgba(37,99,235,0.3)",
                borderRadius: 12,
                fontSize: 13,
                color: "#fff",
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(v: any) => [`₹${Number(v).toLocaleString("en-IN")}`, "Spent"]}
            />
            <Bar
              dataKey="amount"
              fill="url(#barGrad)"
              radius={[6, 6, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
