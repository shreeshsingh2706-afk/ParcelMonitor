"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";
import { Package, Mail, ArrowLeft, Send, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      // Always show success (prevents email enumeration)
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [email, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "#050816" }}>
      {/* Ambient glows */}
      <div className="absolute pointer-events-none" style={{ width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)", top: -200, left: -100 }} />
      <div className="absolute pointer-events-none" style={{ width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)", bottom: -100, right: 100 }} />

      {/* Grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="fpgrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
            </pattern>
            <radialGradient id="fpfade" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="fpmask">
              <rect width="100%" height="100%" fill="url(#fpfade)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#fpgrid)" mask="url(#fpmask)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        className="w-full max-w-md relative z-10 px-4"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}>
            <Package size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">OrderHub</span>
        </div>

        {/* Card */}
        <motion.div
          style={{
            background: "rgba(8,14,28,0.85)",
            border: "1px solid rgba(37,99,235,0.22)",
            borderRadius: 24, padding: "36px",
            backdropFilter: "blur(40px)",
            boxShadow: "0 0 60px rgba(37,99,235,0.1), 0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
            position: "relative",
          }}
        >
          <div className="absolute top-0 left-8 right-8 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.5), rgba(124,58,237,0.5), transparent)" }} />

          {submitted ? (
            /* Success state */
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)" }}
              >
                <CheckCircle size={32} style={{ color: "#4ADE80" }} />
              </motion.div>
              <h2 className="text-xl font-bold text-white mb-2">Check your inbox</h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "#64748B" }}>
                If an account exists for <span style={{ color: "#94A3B8" }}>{email}</span>, we&apos;ve sent a password reset link.
              </p>
              <p className="text-xs mb-6" style={{ color: "#475569" }}>
                Didn&apos;t receive it? Check your spam folder or try again in a few minutes.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => { setSubmitted(false); setEmail(""); }}
                  className="w-full py-3 rounded-xl text-sm font-medium transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#94A3B8" }}
                >
                  Try a different email
                </button>
                <Link href="/" className="block w-full py-3 rounded-xl text-sm font-medium text-center transition-all"
                  style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", color: "white" }}>
                  Back to sign in
                </Link>
              </div>
            </motion.div>
          ) : (
            /* Form state */
            <>
              <div className="mb-7">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(37,99,235,0.12)", border: "1px solid rgba(37,99,235,0.25)" }}>
                  <Mail size={22} style={{ color: "#60A5FA" }} />
                </div>
                <h2 className="text-[24px] font-bold text-white leading-tight">Forgot password?</h2>
                <p className="text-sm mt-1.5" style={{ color: "#64748B" }}>
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <motion.div
                    animate={{
                      borderColor: focused ? "rgba(37,99,235,0.7)" : "rgba(255,255,255,0.08)",
                      boxShadow: focused ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
                    }}
                    style={{
                      background: focused ? "rgba(37,99,235,0.05)" : "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, transition: "all 0.2s ease",
                    }}
                  >
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: focused ? "#60A5FA" : "#475569", transition: "color 0.2s" }}>
                      <Mail size={15} />
                    </div>
                    <input
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                      placeholder="your@email.com" autoComplete="email" required
                      style={{
                        background: "transparent", border: "none", outline: "none",
                        color: "white", fontSize: 14, fontFamily: "'Inter', sans-serif",
                        padding: "13px 14px 13px 40px", width: "100%",
                      }}
                    />
                  </motion.div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={!isLoading ? { scale: 1.02, boxShadow: "0 0 40px rgba(37,99,235,0.4)" } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                  className="w-full flex items-center justify-center gap-2.5 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                    border: "none", borderRadius: 12, padding: "14px", color: "white",
                    fontSize: 15, fontWeight: 600, fontFamily: "'Inter', sans-serif",
                    cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.8 : 1,
                  }}
                >
                  {isLoading ? (
                    <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 rounded-full border-2 border-white border-t-transparent" /><span>Sending...</span></>
                  ) : (
                    <><Send size={16} /><span>Send Reset Link</span></>
                  )}
                </motion.button>
              </form>
            </>
          )}

          {/* Back link */}
          {!submitted && (
            <div className="mt-5 text-center">
              <Link href="/" className="inline-flex items-center gap-2 text-sm transition-colors" style={{ color: "#475569" }}>
                <ArrowLeft size={14} />
                Back to sign in
              </Link>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
