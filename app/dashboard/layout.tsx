"use client";

import { motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import AIAssistant from "@/components/ai/AIAssistant";
import OrderDetailsDrawer from "@/components/dashboard/OrderDetailsDrawer";
import { useAppStore } from "@/store/useAppStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed } = useAppStore();
  const marginLeft = sidebarCollapsed ? 72 : 260;

  return (
    <div style={{ background: "#050816", minHeight: "100vh" }}>
      <Sidebar />

      <motion.div
        animate={{ marginLeft }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <Header />

        <main
          className="overflow-y-auto"
          style={{
            marginTop: 64,
            minHeight: "calc(100vh - 64px)",
            padding: "28px 28px 100px",
          }}
        >
          {children}
        </main>
      </motion.div>

      {/* Global overlays */}
      <OrderDetailsDrawer />
      <AIAssistant />
    </div>
  );
}
