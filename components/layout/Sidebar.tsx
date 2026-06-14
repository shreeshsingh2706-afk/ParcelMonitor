"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Truck,
  PackageCheck,
  AlertTriangle,
  RotateCcw,
  Bell,
  BarChart3,
  Wallet,
  MapPin,
  Puzzle,
  Settings,
  HelpCircle,
  ChevronLeft,
  Package,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ShoppingBag, label: "All Orders", href: "/dashboard/orders" },
  { icon: Truck, label: "In Transit", href: "/dashboard/transit" },
  { icon: PackageCheck, label: "Delivered", href: "/dashboard/delivered" },
  { icon: AlertTriangle, label: "Delayed", href: "/dashboard/delayed" },
  { icon: RotateCcw, label: "Returns", href: "/dashboard/returns" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications", badge: 2 },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Wallet, label: "Spending", href: "/dashboard/spending" },
  { icon: MapPin, label: "Address Book", href: "/dashboard/addresses" },
  { icon: Puzzle, label: "Integrations", href: "/dashboard/integrations" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  { icon: HelpCircle, label: "Help & Support", href: "/dashboard/help" },
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-full z-40 flex flex-col"
      style={{
        background: "rgba(5, 8, 22, 0.95)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.06]">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
            boxShadow: "0 0 20px rgba(37, 99, 235, 0.4)",
          }}
        >
          <Package size={18} className="text-white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col min-w-0"
            >
              <span className="font-bold text-white text-base leading-tight tracking-tight">
                OrderHub
              </span>
              <span className="text-xs" style={{ color: "#94A3B8" }}>
                Track everything
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn("nav-item", isActive && "active")}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <div className="relative flex-shrink-0">
                    <Icon
                      size={18}
                      className={cn(
                        isActive ? "text-blue-400" : "text-slate-400"
                      )}
                    />
                    {item.badge && !isActive && (
                      <span
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white font-bold"
                        style={{
                          fontSize: "9px",
                          background: "#2563EB",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="truncate flex-1"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {!sidebarCollapsed && item.badge && (
                    <span
                      className="ml-auto text-white font-bold rounded-full px-1.5 py-0.5 flex-shrink-0"
                      style={{
                        fontSize: "10px",
                        background: "#2563EB",
                        minWidth: "18px",
                        textAlign: "center",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-white/[0.06]">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
          style={{ color: "#94A3B8" }}
        >
          <motion.div
            animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft size={16} />
          </motion.div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
