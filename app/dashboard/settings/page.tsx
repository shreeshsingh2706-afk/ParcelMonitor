"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, Palette, Smartphone } from "lucide-react";

const TABS = ["Profile", "Notifications", "Security", "Appearance"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>
          Manage your account preferences
        </p>
      </motion.div>

      <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", width: "fit-content" }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={
              activeTab === tab
                ? { background: "rgba(37,99,235,0.2)", color: "#60A5FA" }
                : { color: "#94A3B8" }
            }
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-6">
        {activeTab === "Profile" && (
          <>
            {/* Avatar */}
            <div className="flex items-center gap-5">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold"
                style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}
              >
                S
              </div>
              <div>
                <button className="btn-primary text-sm" style={{ height: 36 }}>Change Photo</button>
                <p className="text-xs mt-2" style={{ color: "#64748B" }}>JPG, PNG up to 5MB</p>
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Full Name", value: "Shreesh Kumar Singh" },
                { label: "Email", value: "user@gmail.com" },
                { label: "Phone", value: "+91 98765 43210" },
                { label: "Location", value: "Gurugram, Haryana" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#94A3B8" }}>
                    {field.label}
                  </label>
                  <input
                    defaultValue={field.value}
                    className="input-field"
                  />
                </div>
              ))}
            </div>

            <button className="btn-primary text-sm" style={{ height: 40 }}>
              Save Changes
            </button>
          </>
        )}

        {activeTab !== "Profile" && (
          <div className="py-8 text-center">
            <p className="text-sm" style={{ color: "#94A3B8" }}>
              {activeTab} settings coming soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
