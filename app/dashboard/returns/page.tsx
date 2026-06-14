"use client";

import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Returns</h1>
        <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>
          Manage your return requests
        </p>
      </motion.div>
      <div className="glass-card rounded-2xl p-16 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "rgba(124,58,237,0.15)" }}>
          <RotateCcw size={28} style={{ color: "#A78BFA" }} />
        </div>
        <h3 className="font-semibold text-white mb-2">No active returns</h3>
        <p className="text-sm" style={{ color: "#94A3B8" }}>
          When you initiate a return, it will appear here.
        </p>
      </div>
    </div>
  );
}
