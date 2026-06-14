"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  Truck,
  PackageCheck,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { metricStats } from "@/lib/mockData";

const cards = [
  {
    label: "Total Orders",
    key: "totalOrders" as keyof typeof metricStats,
    icon: ShoppingBag,
    gradient: "linear-gradient(135deg, rgba(37,99,235,0.2), rgba(37,99,235,0.05))",
    iconBg: "rgba(37,99,235,0.2)",
    iconColor: "#60A5FA",
    glowColor: "rgba(37,99,235,0.15)",
  },
  {
    label: "In Transit",
    key: "inTransit" as keyof typeof metricStats,
    icon: Truck,
    gradient: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(124,58,237,0.05))",
    iconBg: "rgba(124,58,237,0.2)",
    iconColor: "#A78BFA",
    glowColor: "rgba(124,58,237,0.15)",
  },
  {
    label: "Delivered",
    key: "delivered" as keyof typeof metricStats,
    icon: PackageCheck,
    gradient: "linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05))",
    iconBg: "rgba(34,197,94,0.2)",
    iconColor: "#4ADE80",
    glowColor: "rgba(34,197,94,0.15)",
  },
  {
    label: "Delayed",
    key: "delayed" as keyof typeof metricStats,
    icon: AlertTriangle,
    gradient: "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05))",
    iconBg: "rgba(239,68,68,0.2)",
    iconColor: "#F87171",
    glowColor: "rgba(239,68,68,0.15)",
  },
];

export default function MetricCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const stat = metricStats[card.key];
        const Icon = card.icon;
        const isPositive = stat.trend === "up";

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="metric-card"
            style={{
              background: card.gradient,
              boxShadow: `0 0 30px ${card.glowColor}`,
            }}
          >
            {/* Icon + label row */}
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: card.iconBg }}
              >
                <Icon size={20} style={{ color: card.iconColor }} />
              </div>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                  isPositive
                    ? "text-green-400 bg-green-500/10"
                    : "text-red-400 bg-red-500/10"
                }`}
              >
                {isPositive ? (
                  <TrendingUp size={12} />
                ) : (
                  <TrendingDown size={12} />
                )}
                {Math.abs(stat.growth)}%
              </div>
            </div>

            {/* Value */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.08 + 0.2, duration: 0.3 }}
              className="font-bold text-white mb-1"
              style={{ fontSize: "32px", lineHeight: 1.1 }}
            >
              {stat.value}
            </motion.div>

            <p className="text-sm" style={{ color: "#94A3B8" }}>
              {card.label}
            </p>
            <p className="text-xs mt-1" style={{ color: "#475569" }}>
              {isPositive ? "+" : ""}{stat.growth}% this month
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
