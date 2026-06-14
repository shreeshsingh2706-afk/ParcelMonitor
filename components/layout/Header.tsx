"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  ChevronDown,
  Settings,
  LogOut,
  LayoutDashboard,
  HelpCircle,
  User,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useAppStore } from "@/store/useAppStore";
import { notifications } from "@/lib/mockData";

export default function Header() {
  const { searchQuery, setSearchQuery, sidebarCollapsed } = useAppStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const { data: session } = useSession();
  const user = session?.user;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const leftOffset = sidebarCollapsed ? 72 : 260;

  const handleSignOut = async () => {
    setSigningOut(true);
    setProfileOpen(false);
    await signOut({ callbackUrl: "/" });
  };

  // Get initials from name fallback
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <motion.header
      animate={{ left: leftOffset }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 right-0 z-30 flex items-center justify-between gap-4 px-6"
      style={{
        height: 64,
        background: "rgba(5, 8, 22, 0.9)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Search */}
      <div className="flex-1 max-w-lg relative">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: "#475569" }}
        />
        <input
          type="text"
          placeholder="Search orders, products, couriers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-10"
          style={{ height: 40 }}
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors relative"
            style={{ color: "#94A3B8" }}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span
                className="absolute top-1 right-1 w-4 h-4 rounded-full text-white font-bold flex items-center justify-center"
                style={{ fontSize: "9px", background: "#2563EB" }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 rounded-xl overflow-hidden z-50"
                style={{
                  background: "rgba(11, 17, 32, 0.98)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                }}
              >
                <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                  <span className="font-semibold text-sm text-white">Notifications</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(37,99,235,0.15)", color: "#60A5FA" }}
                  >
                    {unreadCount} new
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.slice(0, 4).map((n) => (
                    <div
                      key={n.id}
                      className="p-4 border-b border-white/[0.04] hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{
                            background:
                              n.type === "delay"
                                ? "rgba(239,68,68,0.15)"
                                : n.type === "delivered"
                                ? "rgba(34,197,94,0.15)"
                                : "rgba(37,99,235,0.15)",
                          }}
                        >
                          <Bell
                            size={14}
                            style={{
                              color:
                                n.type === "delay"
                                  ? "#F87171"
                                  : n.type === "delivered"
                                  ? "#4ADE80"
                                  : "#60A5FA",
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium text-white truncate">{n.title}</p>
                            {!n.read && (
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs line-clamp-2" style={{ color: "#94A3B8" }}>
                            {n.message}
                          </p>
                          <p className="text-xs mt-1" style={{ color: "#475569" }}>
                            {n.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
          >
            {/* Avatar */}
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "User"}
                width={32}
                height={32}
                className="rounded-full object-cover"
                style={{ border: "1.5px solid rgba(37,99,235,0.4)" }}
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm text-white"
                style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}
              >
                {initials}
              </div>
            )}

            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-medium text-white leading-tight">
                {user?.name?.split(" ")[0] ?? "User"}
              </span>
              <span className="text-xs" style={{ color: "#94A3B8" }}>
                {user?.email ?? ""}
              </span>
            </div>
            <ChevronDown
              size={14}
              style={{ color: "#94A3B8" }}
              className={`transition-transform ${profileOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-60 rounded-xl overflow-hidden z-50"
                style={{
                  background: "rgba(11, 17, 32, 0.98)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                }}
              >
                {/* User info header */}
                <div className="p-4 border-b border-white/[0.06] flex items-center gap-3">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name ?? "User"}
                      width={36}
                      height={36}
                      className="rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm text-white flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}
                    >
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user?.name ?? "User"}</p>
                    <p className="text-xs truncate" style={{ color: "#64748B" }}>
                      {user?.email ?? ""}
                    </p>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  {[
                    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
                    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
                    { icon: HelpCircle, label: "Help & Support", href: "/dashboard/help" },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setProfileOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                    >
                      <item.icon size={15} style={{ color: "#94A3B8" }} />
                      <span className="text-sm" style={{ color: "#94A3B8" }}>
                        {item.label}
                      </span>
                    </a>
                  ))}
                </div>

                {/* Logout */}
                <div className="border-t border-white/[0.06] py-1">
                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 transition-colors"
                  >
                    {signingOut ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 rounded-full border-2 border-red-400 border-t-transparent"
                      />
                    ) : (
                      <LogOut size={15} className="text-red-400" />
                    )}
                    <span className="text-sm text-red-400">
                      {signingOut ? "Signing out..." : "Sign out"}
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Click-outside overlay */}
      {(profileOpen || notifOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setProfileOpen(false);
            setNotifOpen(false);
          }}
        />
      )}
    </motion.header>
  );
}
