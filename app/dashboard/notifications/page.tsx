"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Package, Truck, AlertTriangle, CheckCircle, Settings2 } from "lucide-react";
import { notifications } from "@/lib/mockData";

const iconMap: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  order: { icon: Package, color: "#60A5FA", bg: "rgba(37,99,235,0.12)" },
  shipped: { icon: Truck, color: "#A78BFA", bg: "rgba(124,58,237,0.12)" },
  delivery: { icon: Truck, color: "#FCD34D", bg: "rgba(245,158,11,0.12)" },
  delivered: { icon: CheckCircle, color: "#4ADE80", bg: "rgba(34,197,94,0.12)" },
  delay: { icon: AlertTriangle, color: "#F87171", bg: "rgba(239,68,68,0.12)" },
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(notifications);

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>
            {notifs.filter((n) => !n.read).length} unread notifications
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={markAllRead}
            className="btn-secondary text-xs"
            style={{ height: 36 }}
          >
            Mark all read
          </button>
          <button
            className="btn-secondary text-xs"
            style={{ height: 36 }}
          >
            <Settings2 size={14} />
            Settings
          </button>
        </div>
      </motion.div>

      {/* Notification preferences */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-5"
      >
        <h3 className="font-semibold text-white text-sm mb-4">
          Notification Preferences
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Shipped", enabled: true },
            { label: "Out for Delivery", enabled: true },
            { label: "Delivered", enabled: true },
            { label: "Delayed", enabled: true },
          ].map((pref) => (
            <div
              key={pref.label}
              className="flex items-center justify-between p-3 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span className="text-xs" style={{ color: "#94A3B8" }}>
                {pref.label}
              </span>
              <div
                className="w-9 h-5 rounded-full relative cursor-pointer transition-colors"
                style={{
                  background: pref.enabled
                    ? "rgba(37,99,235,0.6)"
                    : "rgba(255,255,255,0.1)",
                }}
              >
                <div
                  className="w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all"
                  style={{ left: pref.enabled ? "calc(100% - 18px)" : 3 }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Notifications list */}
      <div className="space-y-2">
        {notifs.map((n, i) => {
          const config = iconMap[n.type] || iconMap.order;
          const Icon = config.icon;

          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() =>
                setNotifs((prev) =>
                  prev.map((x) => (x.id === n.id ? { ...x, read: true } : x))
                )
              }
              className="glass-card rounded-xl p-4 cursor-pointer transition-all hover:border-white/10"
              style={{
                borderColor: !n.read
                  ? "rgba(37,99,235,0.2)"
                  : "rgba(255,255,255,0.05)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: config.bg }}
                >
                  <Icon size={18} style={{ color: config.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-white">{n.title}</p>
                    {!n.read && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm" style={{ color: "#94A3B8" }}>
                    {n.message}
                  </p>
                  <p className="text-xs mt-2" style={{ color: "#475569" }}>
                    {n.time}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
