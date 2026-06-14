"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";
import { Package, Eye, EyeOff, ArrowRight, Mail, Lock, User, Check } from "lucide-react";

// ─── Cursor Spotlight ─────────────────────────────────────────────────
function CursorSpotlight() {
  const x = useMotionValue(-300);
  const y = useMotionValue(-300);
  const springX = useSpring(x, { stiffness: 150, damping: 25 });
  const springY = useSpring(y, { stiffness: 150, damping: 25 });
  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);
  return (
    <motion.div className="fixed pointer-events-none" style={{
      left: springX, top: springY, x: "-50%", y: "-50%",
      width: 400, height: 400, zIndex: 9999, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)",
    }} />
  );
}

// ─── Animated Grid ─────────────────────────────────────────────────────
function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      <svg width="100%" height="100%">
        <defs>
          <pattern id="sgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
          </pattern>
          <radialGradient id="sgridFade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="sgridMask">
            <rect width="100%" height="100%" fill="url(#sgridFade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#sgrid)" mask="url(#sgridMask)" />
      </svg>
    </div>
  );
}

// ─── Password Strength ─────────────────────────────────────────────────
function getStrength(pwd: string): { score: number; label: string; color: string } {
  if (!pwd) return { score: 0, label: "", color: "#475569" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { score: 1, label: "Weak", color: "#EF4444" };
  if (score <= 2) return { score: 2, label: "Fair", color: "#F59E0B" };
  if (score <= 3) return { score: 3, label: "Good", color: "#60A5FA" };
  if (score <= 4) return { score: 4, label: "Strong", color: "#4ADE80" };
  return { score: 5, label: "Excellent", color: "#A78BFA" };
}

// ─── Form Field Component ──────────────────────────────────────────────
interface FieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  error?: string;
  delay: number;
  accentColor?: string;
  glowColor?: string;
  autoComplete?: string;
  rightElement?: React.ReactNode;
}

function FormField({ id, label, type, value, onChange, placeholder, icon, error, delay, accentColor = "#2563EB", glowColor = "rgba(37,99,235,0.12)", autoComplete, rightElement }: FieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="relative">
      <motion.div
        animate={{
          borderColor: error ? "rgba(239,68,68,0.7)" : focused ? `${accentColor}B3` : "rgba(255,255,255,0.08)",
          boxShadow: error ? "0 0 0 3px rgba(239,68,68,0.1)" : focused ? `0 0 0 3px ${glowColor}` : "none",
        }}
        style={{
          background: focused ? `${accentColor}0D` : "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12, transition: "all 0.2s ease", position: "relative",
        }}
      >
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: error ? "#F87171" : focused ? accentColor : "#475569", transition: "color 0.2s" }}>
          {icon}
        </div>
        <input
          id={id} type={type} value={value} autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            background: "transparent", border: "none", outline: "none",
            color: "white", fontSize: 14, fontFamily: "'Inter', sans-serif",
            padding: `12px ${rightElement ? "44px" : "14px"} 12px 40px`, width: "100%",
          }}
        />
        {rightElement}
        <AnimatePresence>
          {(focused || value) && (
            <motion.label
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
              className="absolute -top-2 left-3 text-xs px-1"
              style={{ color: error ? "#F87171" : accentColor, background: "rgba(8,14,28,0.95)", fontFamily: "'Inter', sans-serif" }}
            >
              {label}
            </motion.label>
          )}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-xs mt-1.5 ml-1" style={{ color: "#F87171" }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Signup Component ─────────────────────────────────────────────
export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const router = useRouter();

  const strength = getStrength(password);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) errs.name = "Name must be at least 2 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Please enter a valid email address.";
    if (password.length < 8) errs.password = "Password must be at least 8 characters.";
    if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match.";
    if (!agreed) errs.agreed = "You must agree to the Terms & Conditions.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.toLowerCase().trim(), password }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed. Please try again.");
        return;
      }

      // Auto sign-in after registration
      const signInResult = await signIn("credentials", { email, password, redirect: false });
      if (signInResult?.ok) {
        toast.success("Account created successfully! Welcome to OrderHub 🎉");
        setTimeout(() => router.push("/dashboard"), 500);
      } else {
        toast.success("Account created! Please sign in.");
        router.push("/");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, email, password, confirmPassword, agreed, router, toast]);

  const handleGoogle = useCallback(async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setGoogleLoading(false);
      toast.error("Google sign-in failed. Please try again.");
    }
  }, [toast]);

  return (
    <div className="min-h-screen flex overflow-hidden relative" style={{ background: "#050816" }}>
      <CursorSpotlight />

      {/* Ambient glows */}
      <div className="absolute pointer-events-none" style={{ width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)", top: -200, left: -100, zIndex: 0 }} />
      <div className="absolute pointer-events-none" style={{ width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)", bottom: -100, right: 300, zIndex: 0 }} />

      {/* ═══ LEFT SECTION ═══ */}
      <div className="hidden lg:flex flex-col relative overflow-hidden" style={{ width: "45%", background: "radial-gradient(ellipse at 25% 40%, rgba(124,58,237,0.12) 0%, transparent 60%), #050816" }}>
        <AnimatedGrid />

        {/* Floating feature cards */}
        {[
          { icon: "🔐", title: "Secure & Private", desc: "256-bit encrypted data", color: "#7C3AED", delay: 0.8 },
          { icon: "⚡", title: "Real-time Tracking", desc: "Live delivery updates", color: "#2563EB", delay: 1.0 },
          { icon: "📦", title: "All Platforms", desc: "Amazon, Flipkart, Myntra+", color: "#F97316", delay: 1.2 },
          { icon: "🎯", title: "99.9% Accuracy", desc: "Never miss a delivery", color: "#4ADE80", delay: 1.4 },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -30, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: card.delay, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ position: "absolute", left: `${12 + (i % 2) * 35}%`, top: `${20 + i * 17}%`, zIndex: 2 }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                border: `1px solid ${card.color}30`,
                borderRadius: 14, padding: "12px 16px",
                backdropFilter: "blur(20px)",
                boxShadow: `0 0 30px ${card.color}15, 0 20px 40px rgba(0,0,0,0.3)`,
                minWidth: 170,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontSize: 18 }}>{card.icon}</span>
                <span className="text-sm font-semibold text-white">{card.title}</span>
              </div>
              <p className="text-xs" style={{ color: "#64748B" }}>{card.desc}</p>
            </motion.div>
          </motion.div>
        ))}

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-14 pt-12">
          {/* Logo */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex items-center gap-3">
            <motion.div
              animate={{ boxShadow: ["0 0 20px rgba(124,58,237,0.5)", "0 0 40px rgba(124,58,237,0.8)", "0 0 20px rgba(124,58,237,0.5)"] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)" }}
            >
              <Package size={22} className="text-white" />
            </motion.div>
            <span className="text-xl font-bold text-white tracking-tight">OrderHub</span>
          </motion.div>

          {/* Headline */}
          <div className="mt-20 max-w-[420px]">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wider uppercase"
                style={{ background: "rgba(124,58,237,0.12)", color: "#A78BFA", border: "1px solid rgba(124,58,237,0.25)" }}>
                ✨ Join 50,000+ users
              </span>
            </motion.div>

            <motion.h1 className="font-black leading-[1.05] mb-5" style={{ fontSize: "clamp(2.4rem,3.8vw,3.2rem)" }}>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-white">
                Start tracking
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                style={{ background: "linear-gradient(135deg, #A78BFA, #60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                for free today.
              </motion.div>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="text-lg leading-relaxed mb-8" style={{ color: "#94A3B8" }}>
              Connect all your shopping accounts and track every delivery in one beautiful, unified dashboard.
            </motion.p>

            {/* Benefits */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="space-y-3">
              {[
                "Free forever — no credit card required",
                "Supports Amazon, Flipkart, Myntra, Ajio, Meesho",
                "Real-time delivery notifications",
                "Secure OAuth — we never store passwords from platforms",
              ].map((benefit, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.08 }} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)" }}>
                    <Check size={11} style={{ color: "#A78BFA" }} />
                  </div>
                  <span className="text-sm" style={{ color: "#94A3B8" }}>{benefit}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ═══ RIGHT SECTION ═══ */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative" style={{ zIndex: 10 }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 30%, rgba(124,58,237,0.08) 0%, transparent 60%)" }} />

        <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }} className="w-full max-w-md relative">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }}>
              <Package size={17} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg">OrderHub</span>
          </div>

          {/* ── Signup Card ── */}
          <motion.div
            whileHover={{ boxShadow: "0 0 100px rgba(124,58,237,0.18), 0 40px 80px rgba(0,0,0,0.5)" }}
            transition={{ duration: 0.3 }}
            style={{
              background: "rgba(8,14,28,0.85)",
              border: "1px solid rgba(124,58,237,0.22)",
              borderRadius: 24, padding: "36px",
              backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
              boxShadow: "0 0 60px rgba(124,58,237,0.1), 0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
              position: "relative",
            }}
          >
            {/* Top glow line */}
            <div className="absolute top-0 left-8 right-8 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.5), rgba(37,99,235,0.5), transparent)" }} />

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-7">
              <h2 className="text-[24px] font-bold text-white leading-tight">Create your account ✨</h2>
              <p className="text-sm mt-1.5" style={{ color: "#64748B" }}>Join OrderHub — free, secure, and instant</p>
            </motion.div>

            {/* Google button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              whileHover={!googleLoading ? { scale: 1.02, background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.3)", boxShadow: "0 8px 30px rgba(0,0,0,0.3), 0 0 20px rgba(66,133,244,0.2)" } : {}}
              whileTap={!googleLoading ? { scale: 0.98 } : {}}
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 mb-5"
              style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12, padding: "12px 20px", color: "white",
                fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500,
                cursor: googleLoading ? "not-allowed" : "pointer", opacity: googleLoading ? 0.7 : 1,
              }}
            >
              {googleLoading ? (
                <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 rounded-full border-2 border-white border-t-transparent" /><span>Signing up...</span></>
              ) : (
                <><svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" /><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" /><path fill="#FBBC05" d="M3.964 10.706c-.18-.54-.282-1.117-.282-1.706s.102-1.166.282-1.706V4.962H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.038l3.007-2.332z" /><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 6.294C4.672 4.167 6.656 3.58 9 3.58z" /></svg><span>Continue with Google</span></>
              )}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              <span className="text-xs" style={{ color: "#334155" }}>or sign up with email</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <FormField id="name" label="Full Name" type="text" value={name} onChange={setName}
                placeholder="Your full name" icon={<User size={15} />} error={errors.name}
                delay={0.3} accentColor="#7C3AED" glowColor="rgba(124,58,237,0.12)" autoComplete="name" />

              {/* Email */}
              <FormField id="email" label="Email address" type="email" value={email} onChange={setEmail}
                placeholder="you@example.com" icon={<Mail size={15} />} error={errors.email}
                delay={0.35} accentColor="#2563EB" glowColor="rgba(37,99,235,0.12)" autoComplete="email" />

              {/* Password */}
              <div>
                <FormField id="password" label="Password" type={showPassword ? "text" : "password"} value={password} onChange={setPassword}
                  placeholder="Min. 8 characters" icon={<Lock size={15} />} error={errors.password}
                  delay={0.4} accentColor="#7C3AED" glowColor="rgba(124,58,237,0.12)" autoComplete="new-password"
                  rightElement={
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "#475569", border: "none", background: "none", cursor: "pointer" }}>
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />
                {/* Strength meter */}
                <AnimatePresence>
                  {password.length > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <motion.div key={i} className="flex-1 h-1 rounded-full"
                            animate={{ backgroundColor: i <= strength.score ? strength.color : "rgba(255,255,255,0.08)" }}
                            transition={{ duration: 0.3 }}
                          />
                        ))}
                      </div>
                      <p className="text-xs" style={{ color: strength.color }}>{strength.label}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Confirm Password */}
              <FormField id="confirmPassword" label="Confirm Password" type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={setConfirmPassword}
                placeholder="Repeat your password" icon={<Lock size={15} />} error={errors.confirmPassword}
                delay={0.45} accentColor="#2563EB" glowColor="rgba(37,99,235,0.12)" autoComplete="new-password"
                rightElement={
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "#475569", border: "none", background: "none", cursor: "pointer" }}>
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />

              {/* Terms checkbox */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex items-start gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setAgreed(!agreed)}
                  className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                  style={{
                    background: agreed ? "linear-gradient(135deg, #7C3AED, #2563EB)" : "rgba(255,255,255,0.04)",
                    border: `1.5px solid ${agreed ? "transparent" : errors.agreed ? "rgba(239,68,68,0.7)" : "rgba(255,255,255,0.15)"}`,
                  }}
                >
                  {agreed && <Check size={12} className="text-white" />}
                </button>
                <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>
                  I agree to the{" "}
                  <span className="cursor-pointer" style={{ color: "#A78BFA" }}>Terms of Service</span>
                  {" "}and{" "}
                  <span className="cursor-pointer" style={{ color: "#A78BFA" }}>Privacy Policy</span>
                </p>
              </motion.div>
              {errors.agreed && <p className="text-xs ml-8" style={{ color: "#F87171" }}>{errors.agreed}</p>}

              {/* Submit button */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="pt-2">
                <motion.button
                  type="submit"
                  id="signup-btn"
                  disabled={isLoading}
                  whileHover={!isLoading ? { scale: 1.02, boxShadow: "0 0 40px rgba(124,58,237,0.5), 0 10px 30px rgba(0,0,0,0.3)" } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                  className="w-full flex items-center justify-center gap-2.5 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
                    border: "none", borderRadius: 12, padding: "14px 20px", color: "white",
                    fontSize: 15, fontWeight: 600, fontFamily: "'Inter', sans-serif",
                    cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.8 : 1,
                    boxShadow: "0 0 20px rgba(124,58,237,0.3), 0 8px 20px rgba(0,0,0,0.25)",
                  }}
                >
                  <motion.div className="absolute inset-0"
                    style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)", x: "-100%" }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
                  />
                  {isLoading ? (
                    <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 rounded-full border-2 border-white border-t-transparent" /><span>Creating account...</span></>
                  ) : (
                    <><span>Create Free Account</span><ArrowRight size={16} /></>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Sign in link */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center text-sm mt-5" style={{ color: "#475569" }}>
              Already have an account?{" "}
              <Link href="/" className="font-semibold transition-colors" style={{ color: "#A78BFA", fontFamily: "'Inter', sans-serif", fontSize: 14 }}>
                Sign in →
              </Link>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
