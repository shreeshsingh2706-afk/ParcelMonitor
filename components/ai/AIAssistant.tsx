"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Sparkles, Minimize2 } from "lucide-react";
import { orders } from "@/lib/mockData";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

const EXAMPLE_PROMPTS = [
  "Where is my latest order?",
  "Which packages are delayed?",
  "When will my Nike shoes arrive?",
  "Show me Amazon orders",
];

function generateAIResponse(userMsg: string): string {
  const lower = userMsg.toLowerCase();

  if (lower.includes("latest") || lower.includes("recent")) {
    const latest = orders[0];
    return `Your latest order is **${latest.productName}** from ${latest.platform}. It's currently **${latest.status}** and expected to arrive by ${new Date(latest.eta).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} via ${latest.courier}.`;
  }

  if (lower.includes("delayed")) {
    const delayed = orders.filter((o) => o.status === "Delayed");
    if (delayed.length === 0) return "Great news! You have no delayed packages right now. 🎉";
    return `You have **${delayed.length}** delayed package(s):\n\n${delayed
      .map((o) => `• **${o.productName}** — New ETA: ${new Date(o.eta).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`)
      .join("\n")}`;
  }

  if (lower.includes("nike") || lower.includes("shoes")) {
    const shoes = orders.find((o) => o.productName.toLowerCase().includes("nike"));
    if (shoes) {
      return `Your **${shoes.productName}** is **${shoes.status}**. ${
        shoes.status === "Delivered"
          ? "It was delivered on " + shoes.timeline.find((t) => t.status === "Delivered")?.timestamp + ". Enjoy your new shoes! 👟"
          : "Expected delivery: " + new Date(shoes.eta).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) + "."
      }`;
    }
    return "I couldn't find any Nike shoe orders. Try checking the All Orders page.";
  }

  if (lower.includes("amazon")) {
    const amzOrders = orders.filter((o) => o.platform === "Amazon");
    return `You have **${amzOrders.length}** Amazon orders:\n\n${amzOrders
      .map((o) => `• ${o.productName} — **${o.status}**`)
      .join("\n")}`;
  }

  if (lower.includes("transit") || lower.includes("shipping")) {
    const transit = orders.filter((o) => o.status === "In Transit" || o.status === "Out for Delivery");
    return `You have **${transit.length}** packages on the way:\n\n${transit
      .map((o) => `• **${o.productName}** (${o.platform}) — ${o.status}`)
      .join("\n")}`;
  }

  if (lower.includes("delivered") || lower.includes("arrived")) {
    const delivered = orders.filter((o) => o.status === "Delivered");
    return `You have **${delivered.length}** delivered orders. The most recent was **${delivered[0]?.productName}** on ${delivered[0]?.timeline.find((t) => t.status === "Delivered")?.timestamp}.`;
  }

  return `I searched your orders for "${userMsg}" but couldn't find specific results. You can try asking:\n\n• "Where is my MacBook?"\n• "Show me Flipkart orders"\n• "Which orders are out for delivery?"`;
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: "Hi! I'm your OrderHub AI assistant. Ask me anything about your orders! 📦",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));
    setTyping(false);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      content: generateAIResponse(text),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMsg]);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${open ? "hidden" : "flex"}`}
        style={{
          background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
          boxShadow: "0 8px 32px rgba(37,99,235,0.5)",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Sparkles size={22} className="text-white" />
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden"
            style={{
              width: "min(400px, calc(100vw - 24px))",
              height: "min(520px, calc(100vh - 100px))",
              background: "rgba(7, 12, 30, 0.98)",
              border: "1px solid rgba(37,99,235,0.2)",
              borderRadius: 20,
              boxShadow:
                "0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(37,99,235,0.15)",
              backdropFilter: "blur(30px)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                  }}
                >
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    OrderHub AI
                  </p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
                    <p className="text-xs" style={{ color: "#4ADE80" }}>
                      Online
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                style={{ color: "#94A3B8" }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={msg.role === "ai" ? "ai-bubble" : "user-bubble"}
                    style={{ maxWidth: "85%", padding: "10px 14px" }}
                  >
                    <p
                      className="text-sm leading-relaxed whitespace-pre-line"
                      style={{ color: msg.role === "ai" ? "#E2E8F0" : "#FFFFFF" }}
                      dangerouslySetInnerHTML={{
                        __html: msg.content.replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong style="color: #60A5FA">$1</strong>'
                        ),
                      }}
                    />
                  </div>
                </motion.div>
              ))}

              {typing && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="ai-bubble" style={{ padding: "12px 16px" }}>
                    <div className="flex gap-1.5 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.6,
                            delay: i * 0.15,
                          }}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: "#60A5FA" }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Example prompts */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="text-xs px-3 py-1.5 rounded-full transition-all hover:scale-105"
                    style={{
                      background: "rgba(37,99,235,0.12)",
                      color: "#60A5FA",
                      border: "1px solid rgba(37,99,235,0.2)",
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div
              className="p-3 flex-shrink-0"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage(input);
                  }}
                  placeholder="Ask about your orders..."
                  className="input-field flex-1 text-sm"
                  style={{ height: 38, borderRadius: 10 }}
                />
                <motion.button
                  onClick={() => sendMessage(input)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: input.trim()
                      ? "linear-gradient(135deg, #2563EB, #7C3AED)"
                      : "rgba(255,255,255,0.06)",
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Send
                    size={14}
                    style={{ color: input.trim() ? "#fff" : "#475569" }}
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
