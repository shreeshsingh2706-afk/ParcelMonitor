"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Plus, RefreshCw, Unlink, ExternalLink } from "lucide-react";
import { platformConnections } from "@/lib/mockData";

const integrationFeatures = [
  "Automatic order syncing",
  "Real-time delivery updates",
  "Price & delivery tracking",
  "Email notification parsing",
];

export default function IntegrationsPage() {
  const [connections, setConnections] = useState(platformConnections);

  const toggle = (id: string) => {
    setConnections((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, connected: !p.connected } : p
      )
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white">Integrations</h1>
        <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>
          Connect your shopping accounts to automatically track all orders
        </p>
      </motion.div>

      {/* Info banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 rounded-2xl flex items-start gap-4"
        style={{
          background: "rgba(37,99,235,0.08)",
          border: "1px solid rgba(37,99,235,0.2)",
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(37,99,235,0.2)" }}
        >
          <span style={{ fontSize: 20 }}>🔌</span>
        </div>
        <div>
          <p className="text-sm font-medium text-white">
            How integrations work
          </p>
          <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>
            Connect your accounts securely using OAuth. OrderHub reads only
            order data — we never store your passwords.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {integrationFeatures.map((f) => (
              <span
                key={f}
                className="text-xs px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(34,197,94,0.1)",
                  color: "#4ADE80",
                  border: "1px solid rgba(34,197,94,0.2)",
                }}
              >
                ✓ {f}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Platform cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {connections.map((platform, i) => (
          <motion.div
            key={platform.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="glass-card rounded-2xl p-5 glass-card-hover"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: platform.bgColor }}
                >
                  {platform.logo}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{platform.name}</h3>
                  {platform.connected && (
                    <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
                      {platform.accountEmail}
                    </p>
                  )}
                </div>
              </div>

              {platform.connected ? (
                <span
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{
                    background: "rgba(34,197,94,0.12)",
                    color: "#4ADE80",
                    border: "1px solid rgba(34,197,94,0.25)",
                  }}
                >
                  <CheckCircle size={12} />
                  Connected
                </span>
              ) : (
                <span
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "#64748B",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  Not connected
                </span>
              )}
            </div>

            {/* Stats (if connected) */}
            {platform.connected && (
              <div
                className="flex gap-4 mb-4 p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div>
                  <p className="text-lg font-bold text-white">
                    {platform.ordersCount}
                  </p>
                  <p className="text-xs" style={{ color: "#94A3B8" }}>
                    Orders synced
                  </p>
                </div>
                <div
                  className="w-px"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
                <div>
                  <p className="text-lg font-bold" style={{ color: "#4ADE80" }}>
                    Active
                  </p>
                  <p className="text-xs" style={{ color: "#94A3B8" }}>
                    Status
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {platform.connected ? (
                <>
                  <button
                    className="btn-secondary flex-1 text-xs"
                    style={{ height: 36 }}
                  >
                    <RefreshCw size={13} />
                    Sync Now
                  </button>
                  <button
                    onClick={() => toggle(platform.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-red-500/10"
                    style={{ color: "#F87171", border: "1px solid rgba(239,68,68,0.2)" }}
                  >
                    <Unlink size={13} />
                    Disconnect
                  </button>
                </>
              ) : (
                <motion.button
                  onClick={() => toggle(platform.id)}
                  className="btn-primary flex-1 text-xs"
                  style={{ height: 36 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus size={13} />
                  Connect {platform.name}
                  <ExternalLink size={11} />
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Gmail integration */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: "rgba(234,67,53,0.1)" }}
            >
              📧
            </div>
            <div>
              <h3 className="font-semibold text-white">Gmail Integration</h3>
              <p className="text-sm mt-0.5" style={{ color: "#94A3B8" }}>
                Auto-parse order confirmation emails
              </p>
            </div>
          </div>
          <button className="btn-primary text-xs" style={{ height: 36 }}>
            <Plus size={13} />
            Connect Gmail
          </button>
        </div>
      </div>
    </div>
  );
}
