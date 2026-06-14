"use client";

import { motion } from "framer-motion";
import SpendingLineChart from "@/components/analytics/SpendingLineChart";
import PlatformDoughnut from "@/components/analytics/PlatformDoughnut";

export default function SpendingPage() {
  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Spending</h1>
        <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>
          Track and analyse your spending across all platforms
        </p>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingLineChart />
        <PlatformDoughnut />
      </div>
    </div>
  );
}
