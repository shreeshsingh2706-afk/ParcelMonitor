"use client";

import { motion } from "framer-motion";
import { MessageCircle, Book, Video, Mail } from "lucide-react";

const helpCards = [
  {
    icon: Book,
    title: "Documentation",
    description: "Read our comprehensive guides and API docs",
    color: "#60A5FA",
    bg: "rgba(37,99,235,0.12)",
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Watch step-by-step walkthrough videos",
    color: "#A78BFA",
    bg: "rgba(124,58,237,0.12)",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    color: "#4ADE80",
    bg: "rgba(34,197,94,0.12)",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us an email and we'll respond within 24h",
    color: "#FCD34D",
    bg: "rgba(245,158,11,0.12)",
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Help & Support</h1>
        <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>
          We're here to help you get the most out of OrderHub
        </p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {helpCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card glass-card-hover rounded-2xl p-6 cursor-pointer"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: card.bg }}
            >
              <card.icon size={22} style={{ color: card.color }} />
            </div>
            <h3 className="font-semibold text-white mb-1">{card.title}</h3>
            <p className="text-sm" style={{ color: "#94A3B8" }}>{card.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
