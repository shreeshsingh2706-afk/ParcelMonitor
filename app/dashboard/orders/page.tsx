"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, Search } from "lucide-react";
import RecentOrdersTable from "@/components/dashboard/RecentOrdersTable";
import { useAppStore } from "@/store/useAppStore";

const FILTERS = ["All", "In Transit", "Delivered", "Out for Delivery", "Delayed", "Cancelled"];

export default function OrdersPage() {
  const { searchQuery, setSearchQuery } = useAppStore();
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white">All Orders</h1>
        <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>
          Complete history of all your orders across platforms
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
              style={
                activeFilter === f
                  ? {
                      background: "rgba(37,99,235,0.2)",
                      color: "#60A5FA",
                      border: "1px solid rgba(37,99,235,0.3)",
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      color: "#94A3B8",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }
              }
            >
              {f}
            </button>
          ))}
        </div>

        <div className="ml-auto relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-8"
            style={{ height: 36, width: 220, fontSize: 13 }}
          />
        </div>
      </div>

      <RecentOrdersTable />
    </div>
  );
}
