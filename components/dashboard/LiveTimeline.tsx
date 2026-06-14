"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Package, Clock } from "lucide-react";
import { orders } from "@/lib/mockData";

// Show the most recent "In Transit" or "Out for Delivery" order
const activeOrder = orders.find(
  (o) => o.status === "Out for Delivery" || o.status === "In Transit"
) || orders[0];

export default function LiveTimeline() {
  return (
    <div
      className="glass-card rounded-2xl p-5 h-full flex flex-col"
      style={{ minHeight: 400 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-white text-sm">Live Tracking</h3>
          <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
            Most recent active order
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.2)",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot"
          />
          <span className="text-xs font-medium" style={{ color: "#4ADE80" }}>
            Live
          </span>
        </div>
      </div>

      {/* Active order info */}
      <div
        className="rounded-xl p-3 mb-5"
        style={{
          background: "rgba(37,99,235,0.08)",
          border: "1px solid rgba(37,99,235,0.15)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(37,99,235,0.2)" }}
          >
            <Package size={16} style={{ color: "#60A5FA" }} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {activeOrder.productName}
            </p>
            <p className="text-xs" style={{ color: "#94A3B8" }}>
              {activeOrder.platform} · {activeOrder.courier}
            </p>
          </div>
        </div>
        <div
          className="mt-3 pt-3 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <p className="text-xs" style={{ color: "#94A3B8" }}>
              Tracking
            </p>
            <p className="text-xs font-mono font-medium text-white mt-0.5">
              {activeOrder.trackingNumber}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: "#94A3B8" }}>
              ETA
            </p>
            <p className="text-sm font-semibold text-white mt-0.5">
              {new Date(activeOrder.eta).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 space-y-0">
        {activeOrder.timeline.map((event, idx) => {
          const isLast = idx === activeOrder.timeline.length - 1;
          const isNext =
            !event.completed &&
            (idx === 0 || activeOrder.timeline[idx - 1].completed);

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.3 }}
              className="flex gap-3"
              style={{ paddingBottom: isLast ? 0 : 16 }}
            >
              {/* Dot + line */}
              <div className="flex flex-col items-center">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                  style={{
                    background: event.completed
                      ? "rgba(34,197,94,0.2)"
                      : isNext
                      ? "rgba(37,99,235,0.2)"
                      : "rgba(255,255,255,0.03)",
                    border: event.completed
                      ? "1.5px solid rgba(34,197,94,0.5)"
                      : isNext
                      ? "1.5px solid rgba(37,99,235,0.5)"
                      : "1.5px solid rgba(255,255,255,0.08)",
                    boxShadow: isNext
                      ? "0 0 12px rgba(37,99,235,0.4)"
                      : "none",
                  }}
                >
                  {event.completed ? (
                    <CheckCircle2 size={12} style={{ color: "#4ADE80" }} />
                  ) : isNext ? (
                    <div
                      className="w-2 h-2 rounded-full pulse-dot"
                      style={{ background: "#60A5FA" }}
                    />
                  ) : (
                    <Circle size={12} style={{ color: "#334155" }} />
                  )}
                </div>
                {!isLast && (
                  <div
                    className="w-px flex-1 mt-1"
                    style={{
                      background: event.completed
                        ? "rgba(34,197,94,0.25)"
                        : "rgba(255,255,255,0.05)",
                      minHeight: 16,
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-0.5">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className="text-sm font-medium"
                    style={{
                      color: event.completed
                        ? "#FFFFFF"
                        : isNext
                        ? "#60A5FA"
                        : "#334155",
                    }}
                  >
                    {event.status}
                  </p>
                  {event.timestamp && event.completed && (
                    <div
                      className="flex items-center gap-1 flex-shrink-0"
                      style={{ color: "#475569" }}
                    >
                      <Clock size={10} />
                      <span className="text-xs">{event.timestamp}</span>
                    </div>
                  )}
                  {isNext && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium"
                      style={{
                        background: "rgba(37,99,235,0.15)",
                        color: "#60A5FA",
                      }}
                    >
                      Next
                    </span>
                  )}
                </div>
                {event.location && event.completed && (
                  <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
                    {event.location}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
