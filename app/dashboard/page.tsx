"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { Mail, X, ChevronRight, Package } from "lucide-react";
import MetricCards from "@/components/dashboard/MetricCards";
import ConnectedPlatforms from "@/components/dashboard/ConnectedPlatforms";
import RecentOrdersTable from "@/components/dashboard/RecentOrdersTable";
import LiveTimeline from "@/components/dashboard/LiveTimeline";
import SpendingLineChart from "@/components/analytics/SpendingLineChart";
import PlatformDoughnut from "@/components/analytics/PlatformDoughnut";

const ONBOARDING_KEY = "orderhub_onboarding_dismissed";

function OnboardingCard({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.97 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: "linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(124,58,237,0.12) 100%)",
        border: "1px solid rgba(37,99,235,0.25)",
        padding: "24px 28px",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 0% 50%, rgba(37,99,235,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Top shine line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.6), rgba(124,58,237,0.6), transparent)",
        }}
      />

      <button
        onClick={onDismiss}
        className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
        style={{ color: "#64748B" }}
      >
        <X size={14} />
      </button>

      <div className="relative flex items-start gap-5">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}
        >
          <Package size={22} className="text-white" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">Welcome to OrderHub! 👋</h3>
          <p className="text-sm mb-4" style={{ color: "#94A3B8" }}>
            Track all your online purchases in one place. Connect your Gmail to automatically import orders from Amazon, Flipkart, Myntra and more.
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(234,67,53,0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, rgba(234,67,53,0.2), rgba(234,67,53,0.1))",
                border: "1px solid rgba(234,67,53,0.3)",
              }}
            >
              {/* Gmail icon */}
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
              </svg>
              Connect Gmail
              <ChevronRight size={14} />
            </motion.button>

            <button
              onClick={onDismiss}
              className="text-sm px-4 py-2.5 rounded-xl transition-colors"
              style={{ color: "#64748B" }}
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    const dismissed = localStorage.getItem(ONBOARDING_KEY);
    if (!dismissed) setShowOnboarding(true);
  }, []);

  const dismissOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setShowOnboarding(false);
  };

  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto">
      {/* Onboarding card */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingCard onDismiss={dismissOnboarding} />
        )}
      </AnimatePresence>

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>
          {getGreeting()}, {firstName} 👋 — Here&apos;s what&apos;s happening with your orders.
        </p>
      </motion.div>

      {/* Metric Cards */}
      <MetricCards />

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Orders Table — takes 2 columns */}
        <div className="xl:col-span-2 space-y-6">
          <RecentOrdersTable />

          {/* Charts row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SpendingLineChart />
            <PlatformDoughnut />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <LiveTimeline />
          <ConnectedPlatforms />
        </div>
      </div>
    </div>
  );
}
