import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "In Transit":
      return "status-transit";
    case "Delivered":
      return "status-delivered";
    case "Out for Delivery":
      return "status-out";
    case "Delayed":
      return "status-delayed";
    case "Cancelled":
      return "status-cancelled";
    case "Packed":
      return "status-packed";
    default:
      return "status-default";
  }
}

export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    Amazon: "#FF9900",
    Flipkart: "#2874F0",
    Myntra: "#FF3F6C",
    Ajio: "#DC2626",
    Meesho: "#9B59B6",
  };
  return colors[platform] || "#6366F1";
}
