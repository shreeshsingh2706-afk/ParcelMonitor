"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { orders } from "@/lib/mockData";
import { useAppStore } from "@/store/useAppStore";
import { cn, formatCurrency, getStatusColor, getPlatformColor } from "@/lib/utils";

const statusDot: Record<string, string> = {
  "In Transit": "#60A5FA",
  "Delivered": "#4ADE80",
  "Out for Delivery": "#FCD34D",
  "Delayed": "#F87171",
  "Cancelled": "#94A3B8",
  "Packed": "#A78BFA",
};

export default function RecentOrdersTable() {
  const { openDrawer, searchQuery } = useAppStore();

  const filtered = orders.filter((o) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.productName.toLowerCase().includes(q) ||
      o.platform.toLowerCase().includes(q) ||
      o.orderId.toLowerCase().includes(q) ||
      o.courier.toLowerCase().includes(q) ||
      o.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div>
          <h3 className="font-semibold text-white text-sm">Recent Orders</h3>
          <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
            {filtered.length} orders found
          </p>
        </div>
        <button
          className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
          style={{
            background: "rgba(37,99,235,0.15)",
            color: "#60A5FA",
            border: "1px solid rgba(37,99,235,0.2)",
          }}
        >
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              {["Product", "Platform", "Order ID", "Status", "Courier", "ETA"].map(
                (col) => (
                  <th
                    key={col}
                    className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#475569" }}
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((order, i) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                onClick={() => openDrawer(order)}
                className="order-row"
              >
                {/* Product */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      <img
                        src={order.productImage}
                        alt={order.productName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23111827'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='18' fill='%2394A3B8'%3E📦%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate max-w-[200px]">
                        {order.productName}
                      </p>
                      <p className="text-xs" style={{ color: "#94A3B8" }}>
                        {formatCurrency(order.price)}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Platform */}
                <td className="px-5 py-3.5">
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                    style={{
                      background: `${getPlatformColor(order.platform)}15`,
                      color: getPlatformColor(order.platform),
                      border: `1px solid ${getPlatformColor(order.platform)}30`,
                    }}
                  >
                    {order.platform}
                  </span>
                </td>

                {/* Order ID */}
                <td className="px-5 py-3.5">
                  <span className="text-xs font-mono" style={{ color: "#94A3B8" }}>
                    {order.orderId}
                  </span>
                </td>

                {/* Status */}
                <td className="px-5 py-3.5">
                  <div className={cn("status-badge", getStatusColor(order.status))}>
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: statusDot[order.status] || "#94A3B8" }}
                    />
                    {order.status}
                  </div>
                </td>

                {/* Courier */}
                <td className="px-5 py-3.5">
                  <span className="text-sm" style={{ color: "#94A3B8" }}>
                    {order.courier}
                  </span>
                </td>

                {/* ETA */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white">
                      {new Date(order.eta).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <ExternalLink size={12} style={{ color: "#475569" }} />
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm" style={{ color: "#94A3B8" }}>
            No orders match your search
          </p>
        </div>
      )}
    </div>
  );
}
