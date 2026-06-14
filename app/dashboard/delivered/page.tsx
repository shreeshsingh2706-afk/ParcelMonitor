"use client";

import { motion } from "framer-motion";
import RecentOrdersTable from "@/components/dashboard/RecentOrdersTable";

export default function DeliveredPage() {
  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Delivered</h1>
        <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>
          Orders that have been successfully delivered
        </p>
      </motion.div>
      <RecentOrdersTable />
    </div>
  );
}
