"use client";

import { motion } from "framer-motion";
import MetricCards from "@/components/dashboard/MetricCards";
import ConnectedPlatforms from "@/components/dashboard/ConnectedPlatforms";
import RecentOrdersTable from "@/components/dashboard/RecentOrdersTable";
import LiveTimeline from "@/components/dashboard/LiveTimeline";
import SpendingLineChart from "@/components/analytics/SpendingLineChart";
import PlatformDoughnut from "@/components/analytics/PlatformDoughnut";

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>
          Good evening, Shreesh 👋 — Here's what's happening with your orders.
        </p>
      </motion.div>

      {/* Metric Cards */}
      <MetricCards />

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Orders Table — takes 2 columns */}
        <div className="xl:col-span-2 space-y-6">
          <RecentOrdersTable />

          {/* Charts row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SpendingLineChart />
            <PlatformDoughnut />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <LiveTimeline />
          <ConnectedPlatforms />
        </div>
      </div>
    </div>
  );
}
