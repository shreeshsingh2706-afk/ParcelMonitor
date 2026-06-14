"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Package, Eye, EyeOff, ArrowRight, Mail, Lock,
  MapPin, Check, Truck, Star, Zap, Shield, ChevronRight
} from "lucide-react";

// ─── Particle System ────────────────────────────────────────────────
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  color: string;
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      color: Math.random() > 0.6 ? "#7C3AED" : "#2563EB",
    }));

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(37,99,235,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

// ─── Animated Grid ───────────────────────────────────────────────────
function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
          </pattern>
          <radialGradient id="gridFade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="gridMask">
            <rect width="100%" height="100%" fill="url(#gridFade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" mask="url(#gridMask)" />
      </svg>
    </div>
  );
}

// ─── Route Lines (animated package paths) ────────────────────────────
function RouteLines() {
  const routes = [
    { x1: "5%", y1: "30%", x2: "45%", y2: "60%", color: "#2563EB", delay: 0 },
    { x1: "15%", y1: "70%", x2: "50%", y2: "40%", color: "#7C3AED", delay: 1.5 },
    { x1: "0%", y1: "50%", x2: "40%", y2: "20%", color: "#60A5FA", delay: 3 },
    { x1: "10%", y1: "10%", x2: "48%", y2: "75%", color: "#A78BFA", delay: 0.8 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      <svg width="100%" height="100%">
        <defs>
          {routes.map((r, i) => (
            <linearGradient key={i} id={`routeGrad${i}`} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={r.color} stopOpacity="0" />
              <stop offset="50%" stopColor={r.color} stopOpacity="0.5" />
              <stop offset="100%" stopColor={r.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {routes.map((r, i) => (
          <motion.line
            key={i}
            x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
            stroke={`url(#routeGrad${i})`}
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.8, 0.8, 0] }}
            transition={{
              duration: 6, delay: r.delay,
              repeat: Infinity, repeatDelay: 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// ─── Cursor Spotlight ─────────────────────────────────────────────────
function CursorSpotlight() {
  const x = useMotionValue(-300);
  const y = useMotionValue(-300);
  const springX = useSpring(x, { stiffness: 150, damping: 25 });
  const springY = useSpring(y, { stiffness: 150, damping: 25 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      className="fixed pointer-events-none"
      style={{
        left: springX,
        top: springY,
        x: "-50%",
        y: "-50%",
        width: 400,
        height: 400,
        background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)",
        zIndex: 9999,
        borderRadius: "50%",
      }}
    />
  );
}

// ─── Floating Platform Card ───────────────────────────────────────────
interface PlatformCardProps {
  platform: string;
  product: string;
  status: string;
  statusColor: string;
  icon: string;
  color: string;
  delay: number;
  style: React.CSSProperties;
}

function PlatformCard({ platform, product, status, statusColor, icon, color, delay, style }: PlatformCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      style={{ position: "absolute", ...style }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 4 + delay,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "mirror",
        }}
        whileHover={{ scale: 1.06, y: -14 }}
        className="cursor-pointer"
      >
        <div
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)`,
            border: `1px solid ${color}30`,
            borderRadius: 16,
            padding: "12px 16px",
            backdropFilter: "blur(20px)",
            boxShadow: `0 0 30px ${color}20, 0 20px 40px rgba(0,0,0,0.3)`,
            minWidth: 160,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span style={{ fontSize: 16 }}>{icon}</span>
            <span className="text-xs font-semibold" style={{ color }}>
              {platform}
            </span>
          </div>
          <p className="text-sm font-medium text-white mb-1">{product}</p>
          <div
            className="flex items-center gap-1.5"
            style={{ color: statusColor }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: statusColor }}
            />
            <span className="text-xs">{status}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Live Activity Feed ───────────────────────────────────────────────
const feedItems = [
  { icon: "✅", text: "Nike Air Max delivered", time: "just now", color: "#4ADE80" },
  { icon: "📦", text: "iPhone 17 Pro shipped via Blue Dart", time: "2m ago", color: "#60A5FA" },
  { icon: "🚚", text: "Boat Airdopes out for delivery", time: "5m ago", color: "#FCD34D" },
  { icon: "🔄", text: "Myntra refund processed ₹1,249", time: "8m ago", color: "#A78BFA" },
  { icon: "✅", text: "Levi's Jeans delivered", time: "12m ago", color: "#4ADE80" },
  { icon: "📦", text: "Samsung Galaxy Tab S9 shipped", time: "15m ago", color: "#60A5FA" },
  { icon: "🚚", text: "Puma shoes out for delivery", time: "18m ago", color: "#FCD34D" },
  { icon: "✅", text: "Book set by Flipkart delivered", time: "22m ago", color: "#4ADE80" },
];

function LiveActivityFeed() {
  const [items, setItems] = useState(feedItems);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        const newItem = feedItems[Math.floor(Math.random() * feedItems.length)];
        return [{ ...newItem, time: "just now" }, ...prev.slice(0, 7)];
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: "16px",
        backdropFilter: "blur(20px)",
        maxHeight: 200,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs font-semibold" style={{ color: "#94A3B8" }}>
          LIVE ACTIVITY
        </span>
      </div>
      <AnimatePresence mode="popLayout">
        {items.slice(0, 4).map((item, i) => (
          <motion.div
            key={`${item.text}-${i}`}
            initial={{ opacity: 0, x: -20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: "auto" }}
            exit={{ opacity: 0, x: 20, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex items-center gap-2.5 py-1.5"
          >
            <span style={{ fontSize: 14 }}>{item.icon}</span>
            <span className="text-sm flex-1" style={{ color: "#CBD5E1" }}>
              {item.text}
            </span>
            <span className="text-xs" style={{ color: "#475569", whiteSpace: "nowrap" }}>
              {item.time}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
      <div
        className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(5,8,22,0.9), transparent)",
        }}
      />
    </div>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const [display, setDisplay] = useState("0");
  const numericTarget = parseFloat(target.replace(/[^0-9.]/g, ""));
  const isDecimal = target.includes(".");

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = (timestamp: number, startTime: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = start + (numericTarget - start) * eased;
      const formatted = isDecimal ? value.toFixed(1) : Math.floor(value).toLocaleString();
      setDisplay(formatted + suffix);
      if (progress < 1) requestAnimationFrame((t) => step(t, startTime));
    };
    requestAnimationFrame((t) => step(t, t));
  }, [numericTarget, isDecimal, suffix]);

  return <span>{display}</span>;
}

// ─── Password Strength ─────────────────────────────────────────────────
function getPasswordStrength(pwd: string): { score: number; label: string; color: string } {
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

// ─── Main Component ───────────────────────────────────────────────────
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect already-authenticated users to dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const strength = getPasswordStrength(password);

  // Google OAuth sign-in
  const handleGoogleSignIn = useCallback(async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setGoogleLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Future: wire to credentials provider
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    router.push("/dashboard");
  }, [router]);

  // Show loading screen while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050816" }}>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex items-center gap-3"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)" }}
          >
            <Package size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">OrderHub</span>
        </motion.div>
      </div>
    );
  }

  const platformCards: PlatformCardProps[] = [
    {
      platform: "Amazon", product: "Nike Air Max 270", status: "In Transit",
      statusColor: "#60A5FA", icon: "📦", color: "#FF9900", delay: 0.8,
      style: { right: "2%", top: "10%", zIndex: 2 },
    },
    {
      platform: "Flipkart", product: "iPhone 17 Pro", status: "Delivered",
      statusColor: "#4ADE80", icon: "🛍️", color: "#2874F0", delay: 1.0,
      style: { right: "5%", bottom: "30%", zIndex: 2 },
    },
    {
      platform: "Myntra", product: "Boat Airdopes 141", status: "Out for Delivery",
      statusColor: "#FCD34D", icon: "👗", color: "#FF3F6C", delay: 1.2,
      style: { right: "15%", top: "20%", zIndex: 2 },
    },
    {
      platform: "Ajio", product: "Levi's Slim Fit Jeans", status: "Packed",
      statusColor: "#A78BFA", icon: "✨", color: "#8B5CF6", delay: 1.4,
      style: { right: "18%", bottom: "18%", zIndex: 2 },
    },
    {
      platform: "Meesho", product: "Wireless Earbuds", status: "Shipped",
      statusColor: "#F97316", icon: "🏷️", color: "#F97316", delay: 1.6,
      style: { right: "2%", top: "50%", zIndex: 2 },
    },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050816" }}>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex items-center gap-3"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)" }}
          >
            <Package size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">OrderHub</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex overflow-hidden relative" style={{ background: "#050816" }}>
      <CursorSpotlight />

      {/* ── Global ambient glows ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)",
          top: -200, left: -100, zIndex: 0,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
          bottom: -100, right: 300, zIndex: 0,
        }}
      />

      {/* ═══════════════════════════════════════════════
          LEFT SECTION
      ═══════════════════════════════════════════════ */}
      <div
        className="hidden lg:flex flex-col relative overflow-hidden"
        style={{
          width: "55%",
          background: "radial-gradient(ellipse at 25% 40%, rgba(37,99,235,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 75%, rgba(124,58,237,0.1) 0%, transparent 60%), #050816",
        }}
      >
        <ParticleField />
        <AnimatedGrid />
        <RouteLines />

        {/* Floating platform cards */}
        {platformCards.map((card, i) => (
          <PlatformCard key={i} {...card} />
        ))}

        {/* Floating delivery pins */}
        {[
          { x: "22%", y: "42%", delay: 2 },
          { x: "38%", y: "65%", delay: 2.5 },
          { x: "14%", y: "72%", delay: 3 },
        ].map((pin, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.2, 1, 0] }}
            transition={{ delay: pin.delay, duration: 3, repeat: Infinity, repeatDelay: 4 }}
            style={{ position: "absolute", left: pin.x, top: pin.y, zIndex: 3 }}
          >
            <MapPin size={18} className="text-blue-400" style={{ filter: "drop-shadow(0 0 8px #60A5FA)" }} />
          </motion.div>
        ))}

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-14 pt-12">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex items-center gap-3"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(37,99,235,0.5)",
                  "0 0 40px rgba(37,99,235,0.8)",
                  "0 0 20px rgba(37,99,235,0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)" }}
            >
              <Package size={22} className="text-white" />
            </motion.div>
            <motion.span
              animate={{ opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-xl font-bold text-white tracking-tight"
            >
              OrderHub
            </motion.span>
          </motion.div>

          {/* Headline */}
          <div className="mt-20 max-w-[480px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="mb-4"
            >
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wider uppercase"
                style={{
                  background: "rgba(37,99,235,0.12)",
                  color: "#60A5FA",
                  border: "1px solid rgba(37,99,235,0.25)",
                }}
              >
                <Zap size={10} />
                Unified Order Tracking
              </span>
            </motion.div>

            <motion.h1
              className="font-black leading-[1.05] mb-5"
              style={{ fontSize: "clamp(2.8rem,4.5vw,3.8rem)" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="text-white"
              >
                All Your Orders.
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.7 }}
                className="gradient-text"
              >
                One Dashboard.
              </motion.div>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg leading-relaxed mb-8"
              style={{ color: "#94A3B8" }}
            >
              Track Amazon, Flipkart, Myntra and all your deliveries
              in real-time from a single beautiful dashboard.
            </motion.p>

            {/* Platform pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap gap-2 mb-10"
            >
              {[
                { name: "Amazon", icon: "📦", color: "#FF9900" },
                { name: "Flipkart", icon: "🛍️", color: "#2874F0" },
                { name: "Myntra", icon: "👗", color: "#FF3F6C" },
                { name: "Ajio", icon: "✨", color: "#8B5CF6" },
                { name: "Meesho", icon: "🏷️", color: "#F97316" },
              ].map((p, i) => (
                <motion.span
                  key={p.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.65 + i * 0.07, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  className="text-sm px-3 py-1.5 rounded-full font-medium cursor-default"
                  style={{
                    background: `${p.color}18`,
                    color: p.color,
                    border: `1px solid ${p.color}35`,
                  }}
                >
                  {p.icon} {p.name}
                </motion.span>
              ))}
            </motion.div>

            {/* Live Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.6 }}
              className="mb-10"
            >
              <LiveActivityFeed />
            </motion.div>

            {/* Trust stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex gap-10"
            >
              {[
                { value: "50000", suffix: "+", label: "Orders Tracked", icon: Package },
                { value: "100", suffix: "+", label: "Couriers Supported", icon: Truck },
                { value: "99.9", suffix: "%", label: "Tracking Accuracy", icon: Star },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95 + i * 0.1 }}
                  className="group"
                >
                  <p
                    className="text-2xl font-black"
                    style={{
                      background: "linear-gradient(135deg, #60A5FA, #A78BFA)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          RIGHT SECTION
      ═══════════════════════════════════════════════ */}
      <div
        className="flex-1 flex items-center justify-center p-6 lg:p-12 relative"
        style={{ zIndex: 10 }}
      >
        {/* Right side ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 80% 30%, rgba(124,58,237,0.08) 0%, transparent 60%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          className="w-full max-w-md relative"
        >
          {/* Mobile logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-8 lg:hidden"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}
            >
              <Package size={17} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg">OrderHub</span>
          </motion.div>

          {/* ── Login card ── */}
          <motion.div
            whileHover={{ boxShadow: "0 0 100px rgba(37,99,235,0.18), 0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)" }}
            transition={{ duration: 0.3 }}
            style={{
              background: "rgba(8,14,28,0.85)",
              border: "1px solid rgba(37,99,235,0.22)",
              borderRadius: 24,
              padding: "36px",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              boxShadow: "0 0 60px rgba(37,99,235,0.1), 0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Top glow line */}
            <div
              className="absolute top-0 left-8 right-8 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.5), rgba(124,58,237,0.5), transparent)" }}
            />

            {/* Header */}
            <div className="mb-7">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-[26px] font-bold text-white leading-tight">
                  Welcome back 👋
                </h2>
                <p className="text-sm mt-1.5" style={{ color: "#64748B" }}>
                  Sign in to your OrderHub account
                </p>
              </motion.div>
            </div>

            {/* Google button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              whileHover={!googleLoading ? {
                scale: 1.02,
                background: "rgba(255,255,255,0.1)",
                borderColor: "rgba(255,255,255,0.3)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.3), 0 0 20px rgba(66,133,244,0.2)",
              } : {}}
              whileTap={!googleLoading ? { scale: 0.98 } : {}}
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              id="google-login-btn"
              className="w-full flex items-center justify-center gap-3 mb-5"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: "12px 20px",
                color: "white",
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                cursor: googleLoading ? "not-allowed" : "pointer",
                opacity: googleLoading ? 0.7 : 1,
                transition: "all 0.2s ease",
              }}
            >
              {googleLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
                  />
                  <span>Signing you in...</span>
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
                    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
                    <path fill="#FBBC05" d="M3.964 10.706c-.18-.54-.282-1.117-.282-1.706s.102-1.166.282-1.706V4.962H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.038l3.007-2.332z" />
                    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 6.294C4.672 4.167 6.656 3.58 9 3.58z" />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </motion.button>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              <span className="text-xs" style={{ color: "#334155" }}>
                or continue with email
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Email field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mb-4 relative"
              >
                <motion.div
                  animate={{
                    borderColor: emailFocused ? "rgba(37,99,235,0.7)" : "rgba(255,255,255,0.08)",
                    boxShadow: emailFocused ? "0 0 0 3px rgba(37,99,235,0.12), 0 0 20px rgba(37,99,235,0.08)" : "none",
                  }}
                  style={{
                    background: emailFocused ? "rgba(37,99,235,0.05)" : "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    transition: "all 0.2s ease",
                    position: "relative",
                  }}
                >
                  <div
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: emailFocused ? "#60A5FA" : "#475569", transition: "color 0.2s" }}
                  >
                    <Mail size={15} />
                  </div>
                  <input
                    type="email"
                    id="email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    style={{
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: "white",
                      fontSize: 14,
                      fontFamily: "'Inter', sans-serif",
                      padding: "12px 14px 12px 40px",
                      width: "100%",
                    }}
                  />
                </motion.div>
                <AnimatePresence>
                  {emailFocused && (
                    <motion.label
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute -top-2 left-3 text-xs px-1"
                      style={{
                        color: "#60A5FA",
                        background: "rgba(8,14,28,0.95)",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Email address
                    </motion.label>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Password field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-2 relative"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs" style={{ color: "#475569" }}>Password</span>
                  <button
                    type="button"
                    className="text-xs transition-colors"
                    style={{ color: "#60A5FA", fontFamily: "'Inter', sans-serif", cursor: "pointer", border: "none", background: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#93C5FD")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#60A5FA")}
                  >
                    Forgot password?
                  </button>
                </div>
                <motion.div
                  animate={{
                    borderColor: passwordFocused ? "rgba(124,58,237,0.7)" : "rgba(255,255,255,0.08)",
                    boxShadow: passwordFocused ? "0 0 0 3px rgba(124,58,237,0.12), 0 0 20px rgba(124,58,237,0.08)" : "none",
                  }}
                  style={{
                    background: passwordFocused ? "rgba(124,58,237,0.05)" : "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    transition: "all 0.2s ease",
                    position: "relative",
                  }}
                >
                  <div
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: passwordFocused ? "#A78BFA" : "#475569", transition: "color 0.2s" }}
                  >
                    <Lock size={15} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    style={{
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: "white",
                      fontSize: 14,
                      fontFamily: "'Inter', sans-serif",
                      padding: "12px 44px 12px 40px",
                      width: "100%",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{
                      color: "#475569",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      padding: 2,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#94A3B8")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </motion.div>

                {/* Password strength meter */}
                <AnimatePresence>
                  {password.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2"
                    >
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <motion.div
                            key={i}
                            className="flex-1 h-1 rounded-full"
                            animate={{
                              backgroundColor: i <= strength.score ? strength.color : "rgba(255,255,255,0.08)",
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        ))}
                      </div>
                      <p className="text-xs" style={{ color: strength.color }}>
                        {strength.label}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Submit button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6"
              >
                <motion.button
                  type="submit"
                  id="login-btn"
                  disabled={isLoading}
                  whileHover={!isLoading ? {
                    scale: 1.02,
                    boxShadow: "0 0 40px rgba(37,99,235,0.5), 0 10px 30px rgba(0,0,0,0.3)",
                  } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                  className="w-full flex items-center justify-center gap-2.5 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                    border: "none",
                    borderRadius: 12,
                    padding: "14px 20px",
                    color: "white",
                    fontSize: 15,
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.8 : 1,
                    transition: "all 0.3s ease",
                    boxShadow: "0 0 20px rgba(37,99,235,0.3), 0 8px 20px rgba(0,0,0,0.25)",
                  }}
                >
                  {/* Shimmer on hover */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                      x: "-100%",
                    }}
                    animate={{ x: ["−100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
                  />

                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 rounded-full border-2 border-white border-t-transparent"
                      />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to Dashboard</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Sign up */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="text-center text-sm mt-5"
              style={{ color: "#475569" }}
            >
              Don&apos;t have an account?{" "}
              <button
                className="font-semibold"
                style={{
                  color: "#60A5FA",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#93C5FD")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#60A5FA")}
              >
                Create free account →
              </button>
            </motion.p>
          </motion.div>

          {/* Gmail Connect teaser */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="mt-4 cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16,
              padding: "14px 18px",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(234,67,53,0.15)", border: "1px solid rgba(234,67,53,0.25)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white leading-tight">Connect Gmail</p>
                <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>
                  Automatically import orders from emails
                </p>
              </div>
              <ChevronRight size={14} style={{ color: "#475569" }} />
            </div>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="flex items-center justify-center gap-5 mt-5"
          >
            {[
              { icon: Shield, text: "SSL Secured" },
              { icon: Zap, text: "Real-time" },
              { icon: Check, text: "Free Forever" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-1.5">
                <item.icon size={11} style={{ color: "#475569" }} />
                <span className="text-xs" style={{ color: "#475569" }}>
                  {item.text}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
