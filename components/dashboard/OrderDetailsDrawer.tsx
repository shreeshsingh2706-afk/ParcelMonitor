"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Package,
  Truck,
  MapPin,
  Calendar,
  Hash,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { formatCurrency, getStatusColor, getPlatformColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function OrderDetailsDrawer() {
  const { drawerOpen, selectedOrder, closeDrawer } = useAppStore();

  return (
    <AnimatePresence>
      {drawerOpen && selectedOrder && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full z-50 overflow-y-auto"
            style={{
              width: "min(480px, 100vw)",
              background: "rgba(7, 12, 30, 0.98)",
              borderLeft: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(30px)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-5 sticky top-0 z-10"
              style={{
                background: "rgba(7, 12, 30, 0.95)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div>
                <h2 className="font-semibold text-white">Order Details</h2>
                <p className="text-xs mt-0.5 font-mono" style={{ color: "#94A3B8" }}>
                  {selectedOrder.orderId}
                </p>
              </div>
              <button
                onClick={closeDrawer}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                style={{ color: "#94A3B8" }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Product info card */}
              <div
                className="rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex gap-4">
                  <div
                    className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <img
                      src={selectedOrder.productImage}
                      alt={selectedOrder.productName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23111827'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='32' fill='%2394A3B8'%3E📦%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm leading-snug">
                      {selectedOrder.productName}
                    </p>
                    <p
                      className="text-xl font-bold mt-1"
                      style={{ color: "#60A5FA" }}
                    >
                      {formatCurrency(selectedOrder.price)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded-lg font-semibold"
                        style={{
                          background: `${getPlatformColor(selectedOrder.platform)}15`,
                          color: getPlatformColor(selectedOrder.platform),
                          border: `1px solid ${getPlatformColor(selectedOrder.platform)}30`,
                        }}
                      >
                        {selectedOrder.platform}
                      </span>
                      <span
                        className={cn(
                          "status-badge",
                          getStatusColor(selectedOrder.status)
                        )}
                      >
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order info grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Hash, label: "Order ID", value: selectedOrder.orderId },
                  { icon: Truck, label: "Courier", value: selectedOrder.courier },
                  {
                    icon: Package,
                    label: "Tracking No.",
                    value: selectedOrder.trackingNumber,
                  },
                  {
                    icon: Calendar,
                    label: "ETA",
                    value: new Date(selectedOrder.eta).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-3 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <item.icon size={13} style={{ color: "#475569" }} />
                      <span className="text-xs" style={{ color: "#475569" }}>
                        {item.label}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-white truncate">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tracking Timeline */}
              <div>
                <h3 className="font-semibold text-white text-sm mb-4">
                  Tracking Timeline
                </h3>
                <div className="relative space-y-0">
                  {selectedOrder.timeline.map((event, idx) => {
                    const isLast = idx === selectedOrder.timeline.length - 1;
                    const prevCompleted =
                      idx > 0 && selectedOrder.timeline[idx - 1].completed;

                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.3 }}
                        className="flex gap-4"
                        style={{ paddingBottom: isLast ? 0 : "20px" }}
                      >
                        {/* Line + dot */}
                        <div className="flex flex-col items-center">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                            style={{
                              background: event.completed
                                ? "rgba(34,197,94,0.2)"
                                : "rgba(255,255,255,0.05)",
                              border: event.completed
                                ? "2px solid rgba(34,197,94,0.5)"
                                : "2px solid rgba(255,255,255,0.1)",
                            }}
                          >
                            {event.completed ? (
                              <CheckCircle2
                                size={14}
                                style={{ color: "#4ADE80" }}
                              />
                            ) : (
                              <Circle
                                size={14}
                                style={{ color: "#475569" }}
                              />
                            )}
                          </div>
                          {!isLast && (
                            <div
                              className="w-0.5 flex-1 mt-1"
                              style={{
                                background: event.completed
                                  ? "linear-gradient(to bottom, rgba(34,197,94,0.4), rgba(34,197,94,0.1))"
                                  : "rgba(255,255,255,0.06)",
                                minHeight: "20px",
                              }}
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p
                                className={`text-sm font-medium ${
                                  event.completed ? "text-white" : ""
                                }`}
                                style={
                                  !event.completed ? { color: "#475569" } : {}
                                }
                              >
                                {event.status}
                              </p>
                              {event.location && (
                                <div
                                  className="flex items-center gap-1 mt-0.5"
                                  style={{ color: "#475569" }}
                                >
                                  <MapPin size={11} />
                                  <span className="text-xs">{event.location}</span>
                                </div>
                              )}
                              {event.description && (
                                <p
                                  className="text-xs mt-1"
                                  style={{ color: "#64748B" }}
                                >
                                  {event.description}
                                </p>
                              )}
                            </div>
                            {event.timestamp && (
                              <div
                                className="flex items-center gap-1 flex-shrink-0"
                                style={{ color: "#475569" }}
                              >
                                <Clock size={11} />
                                <span className="text-xs whitespace-nowrap">
                                  {event.timestamp}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
