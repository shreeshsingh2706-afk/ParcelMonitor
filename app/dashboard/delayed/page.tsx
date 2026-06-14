"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { orders } from "@/lib/mockData";
import RecentOrdersTable from "@/components/dashboard/RecentOrdersTable";

export default function DelayedPage() {
  const delayed = orders.filter((o) => o.status === "Delayed");
  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Delayed Orders</h1>
        <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>
          {delayed.length} order(s) delayed
        </p>
      </motion.div>
      {delayed.length > 0 && (
        <div className="p-4 rounded-2xl flex items-center gap-3"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <AlertTriangle size={18} style={{ color: "#F87171", flexShrink: 0 }} />
          <p className="text-sm" style={{ color: "#94A3B8" }}>
            Some of your orders have been delayed. We'll notify you as soon as they're back on track.
          </p>
        </div>
      )}
      <RecentOrdersTable />
    </div>
  );
}
