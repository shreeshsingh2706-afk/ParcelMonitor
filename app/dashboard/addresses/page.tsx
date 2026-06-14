"use client";

import { motion } from "framer-motion";
import { MapPin, Plus } from "lucide-react";

const addresses = [
  {
    id: "a1",
    label: "Home",
    name: "Shreesh Kumar Singh",
    line1: "42, Sector 15, Near DLF Phase 1",
    city: "Gurugram",
    state: "Haryana",
    pin: "122001",
    default: true,
  },
  {
    id: "a2",
    label: "Office",
    name: "Shreesh Kumar Singh",
    line1: "WeWork, Cyber Hub",
    city: "Gurugram",
    state: "Haryana",
    pin: "122002",
    default: false,
  },
];

export default function AddressesPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Address Book</h1>
          <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>
            Manage your delivery addresses
          </p>
        </div>
        <button className="btn-primary text-sm" style={{ height: 40 }}>
          <Plus size={15} />
          Add Address
        </button>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr, i) => (
          <motion.div
            key={addr.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin size={15} style={{ color: "#60A5FA" }} />
                <span className="text-sm font-semibold text-white">{addr.label}</span>
              </div>
              {addr.default && (
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(34,197,94,0.12)", color: "#4ADE80", border: "1px solid rgba(34,197,94,0.2)" }}>
                  Default
                </span>
              )}
            </div>
            <p className="text-sm text-white font-medium">{addr.name}</p>
            <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>{addr.line1}</p>
            <p className="text-sm" style={{ color: "#94A3B8" }}>
              {addr.city}, {addr.state} – {addr.pin}
            </p>
            <div className="flex gap-2 mt-4">
              <button className="btn-secondary text-xs flex-1" style={{ height: 32 }}>Edit</button>
              <button className="btn-secondary text-xs flex-1" style={{ height: 32 }}>Delete</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
