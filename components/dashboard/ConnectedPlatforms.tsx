"use client";

import { motion } from "framer-motion";
import { CheckCircle, Plus, Zap } from "lucide-react";
import { platformConnections } from "@/lib/mockData";

export default function ConnectedPlatforms() {
  return (
    <div
      className="glass-card rounded-2xl p-5"
      style={{ borderRadius: 16 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-white text-sm">Connected Platforms</h3>
          <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
            3 of 5 platforms connected
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
          Manage
        </button>
      </div>

      <div className="space-y-3">
        {platformConnections.map((platform, i) => (
          <motion.div
            key={platform.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5 cursor-pointer"
            style={{
              background: platform.connected
                ? `${platform.bgColor}`
                : "rgba(255,255,255,0.02)",
              border: `1px solid ${
                platform.connected
                  ? `${platform.color}30`
                  : "rgba(255,255,255,0.05)"
              }`,
            }}
          >
            {/* Logo */}
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: platform.bgColor }}
            >
              {platform.logo}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">
                  {platform.name}
                </span>
                {platform.connected && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                    style={{
                      background: "rgba(34,197,94,0.15)",
                      color: "#4ADE80",
                    }}
                  >
                    Connected
                  </span>
                )}
              </div>
              {platform.connected ? (
                <p className="text-xs truncate" style={{ color: "#94A3B8" }}>
                  {platform.accountEmail} · {platform.ordersCount} orders
                </p>
              ) : (
                <p className="text-xs" style={{ color: "#475569" }}>
                  Not connected
                </p>
              )}
            </div>

            {/* Action */}
            {platform.connected ? (
              <CheckCircle size={16} style={{ color: "#4ADE80", flexShrink: 0 }} />
            ) : (
              <button
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all hover:scale-105"
                style={{
                  background: "rgba(37,99,235,0.15)",
                  color: "#60A5FA",
                  border: "1px solid rgba(37,99,235,0.25)",
                  flexShrink: 0,
                }}
              >
                <Plus size={12} />
                Connect
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Bottom insight */}
      <div
        className="mt-4 p-3 rounded-xl flex items-center gap-2"
        style={{
          background: "rgba(37,99,235,0.08)",
          border: "1px solid rgba(37,99,235,0.15)",
        }}
      >
        <Zap size={14} style={{ color: "#60A5FA", flexShrink: 0 }} />
        <p className="text-xs" style={{ color: "#94A3B8" }}>
          Connect Ajio & Meesho to track{" "}
          <span style={{ color: "#60A5FA" }}>27+ more orders</span>
        </p>
      </div>
    </div>
  );
}
