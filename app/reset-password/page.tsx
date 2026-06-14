"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { Package, Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) setTokenError(true);
  }, [token]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Reset failed. Please try again.");
        if (data.error?.includes("expired") || data.error?.includes("Invalid")) {
          setTokenError(true);
        }
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/"), 3000);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [token, password, confirmPassword, router, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "#050816" }}>
      <div className="absolute pointer-events-none" style={{ width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)", top: -200, right: -100 }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        className="w-full max-w-md relative z-10 px-4"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }}>
            <Package size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">OrderHub</span>
        </div>

        <motion.div
          style={{
            background: "rgba(8,14,28,0.85)",
            border: "1px solid rgba(124,58,237,0.22)",
            borderRadius: 24, padding: "36px",
            backdropFilter: "blur(40px)",
            boxShadow: "0 0 60px rgba(124,58,237,0.1), 0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
            position: "relative",
          }}
        >
          <div className="absolute top-0 left-8 right-8 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.5), rgba(37,99,235,0.5), transparent)" }} />

          {tokenError ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}>
                <AlertCircle size={32} style={{ color: "#F87171" }} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Link expired or invalid</h2>
              <p className="text-sm mb-6" style={{ color: "#64748B" }}>This reset link is invalid or has expired. Please request a new one.</p>
              <Link href="/forgot-password" className="block w-full py-3 rounded-xl text-sm font-semibold text-center text-white" style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }}>
                Request new link
              </Link>
            </div>
          ) : success ? (
            <div className="text-center py-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)" }}>
                <CheckCircle size={32} style={{ color: "#4ADE80" }} />
              </motion.div>
              <h2 className="text-xl font-bold text-white mb-2">Password updated!</h2>
              <p className="text-sm mb-4" style={{ color: "#64748B" }}>Your password has been successfully reset. Redirecting you to sign in...</p>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)" }}>
                  <Lock size={22} style={{ color: "#A78BFA" }} />
                </div>
                <h2 className="text-[24px] font-bold text-white">Set new password</h2>
                <p className="text-sm mt-1.5" style={{ color: "#64748B" }}>Choose a strong password for your account.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { id: "new-password", label: "New Password", value: password, onChange: setPassword, show: showPassword, setShow: setShowPassword, placeholder: "Min. 8 characters", autoComplete: "new-password" },
                  { id: "confirm-password", label: "Confirm Password", value: confirmPassword, onChange: setConfirmPassword, show: showConfirm, setShow: setShowConfirm, placeholder: "Repeat new password", autoComplete: "new-password" },
                ].map((field) => (
                  <div key={field.id} className="relative">
                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, position: "relative" }}>
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#475569" }}>
                        <Lock size={15} />
                      </div>
                      <input
                        id={field.id} type={field.show ? "text" : "password"}
                        value={field.value} onChange={(e) => field.onChange(e.target.value)}
                        placeholder={field.placeholder} autoComplete={field.autoComplete} required
                        style={{ background: "transparent", border: "none", outline: "none", color: "white", fontSize: 14, fontFamily: "'Inter', sans-serif", padding: "13px 44px 13px 40px", width: "100%" }}
                      />
                      <button type="button" onClick={() => field.setShow(!field.show)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "#475569", border: "none", background: "none", cursor: "pointer" }}>
                        {field.show ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                ))}

                <motion.button type="submit" disabled={isLoading}
                  whileHover={!isLoading ? { scale: 1.02, boxShadow: "0 0 40px rgba(124,58,237,0.4)" } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                  className="w-full flex items-center justify-center gap-2.5"
                  style={{
                    background: "linear-gradient(135deg, #7C3AED, #2563EB)", border: "none", borderRadius: 12,
                    padding: "14px", color: "white", fontSize: 15, fontWeight: 600, fontFamily: "'Inter', sans-serif",
                    cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.8 : 1,
                  }}>
                  {isLoading ? (
                    <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 rounded-full border-2 border-white border-t-transparent" /><span>Updating...</span></>
                  ) : "Update Password"}
                </motion.button>
              </form>

              <div className="mt-5 text-center">
                <Link href="/" className="inline-flex items-center gap-2 text-sm" style={{ color: "#475569" }}>
                  <ArrowLeft size={14} />Back to sign in
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
