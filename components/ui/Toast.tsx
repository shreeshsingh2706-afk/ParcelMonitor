"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    warning: (msg: string) => void;
    info: (msg: string) => void;
  };
}

const ToastContext = createContext<ToastContextValue>({
  toast: {
    success: () => {},
    error: () => {},
    warning: () => {},
    info: () => {},
  },
});

const TOAST_CONFIG: Record<
  ToastType,
  { icon: typeof CheckCircle; color: string; bg: string; border: string }
> = {
  success: {
    icon: CheckCircle,
    color: "#4ADE80",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.2)",
  },
  error: {
    icon: XCircle,
    color: "#F87171",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
  },
  warning: {
    icon: AlertCircle,
    color: "#FCD34D",
    bg: "rgba(234,179,8,0.08)",
    border: "rgba(234,179,8,0.2)",
  },
  info: {
    icon: Info,
    color: "#60A5FA",
    bg: "rgba(37,99,235,0.08)",
    border: "rgba(37,99,235,0.2)",
  },
};

function ToastItem({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const config = TOAST_CONFIG[item.type];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      className="flex items-start gap-3 pr-4 pl-4 py-3.5 rounded-xl min-w-[300px] max-w-sm"
      style={{
        background: "rgba(8,14,28,0.95)",
        border: `1px solid ${config.border}`,
        backdropFilter: "blur(20px)",
        boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 20px ${config.color}15`,
      }}
    >
      <Icon
        size={18}
        style={{ color: config.color, flexShrink: 0, marginTop: 1 }}
      />
      <p
        className="text-sm flex-1 leading-snug font-medium"
        style={{ color: "#E2E8F0", fontFamily: "'Inter', sans-serif" }}
      >
        {item.message}
      </p>
      <button
        onClick={() => onDismiss(item.id)}
        style={{ color: "#475569", background: "none", border: "none", cursor: "pointer", padding: 2, flexShrink: 0 }}
        className="hover:text-slate-300 transition-colors mt-0.5"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg: string) => addToast(msg, "success"),
    error: (msg: string) => addToast(msg, "error"),
    warning: (msg: string) => addToast(msg, "warning"),
    info: (msg: string) => addToast(msg, "info"),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((item) => (
            <div key={item.id} className="pointer-events-auto">
              <ToastItem item={item} onDismiss={dismiss} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
