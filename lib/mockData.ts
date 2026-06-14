export type OrderStatus =
  | "In Transit"
  | "Delivered"
  | "Out for Delivery"
  | "Delayed"
  | "Cancelled"
  | "Order Placed"
  | "Packed";

export type Platform = "Amazon" | "Flipkart" | "Myntra" | "Ajio" | "Meesho";

export interface TrackingEvent {
  id: string;
  status: string;
  location: string;
  timestamp: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderId: string;
  productName: string;
  productImage: string;
  price: number;
  platform: Platform;
  status: OrderStatus;
  courier: string;
  trackingNumber: string;
  eta: string;
  createdAt: string;
  category: string;
  timeline: TrackingEvent[];
}

export interface PlatformConnection {
  id: string;
  name: Platform;
  logo: string;
  connected: boolean;
  accountEmail?: string;
  ordersCount?: number;
  color: string;
  bgColor: string;
}

export const platformConnections: PlatformConnection[] = [
  {
    id: "amazon",
    name: "Amazon",
    logo: "🛒",
    connected: true,
    accountEmail: "user@gmail.com",
    ordersCount: 34,
    color: "#FF9900",
    bgColor: "rgba(255,153,0,0.1)",
  },
  {
    id: "flipkart",
    name: "Flipkart",
    logo: "🛍️",
    connected: true,
    accountEmail: "user@gmail.com",
    ordersCount: 21,
    color: "#2874F0",
    bgColor: "rgba(40,116,240,0.1)",
  },
  {
    id: "myntra",
    name: "Myntra",
    logo: "👗",
    connected: true,
    accountEmail: "user@gmail.com",
    ordersCount: 18,
    color: "#FF3F6C",
    bgColor: "rgba(255,63,108,0.1)",
  },
  {
    id: "ajio",
    name: "Ajio",
    logo: "✨",
    connected: false,
    color: "#DC2626",
    bgColor: "rgba(220,38,38,0.1)",
  },
  {
    id: "meesho",
    name: "Meesho",
    logo: "🏷️",
    connected: false,
    color: "#9B59B6",
    bgColor: "rgba(155,89,182,0.1)",
  },
];

export const orders: Order[] = [
  {
    id: "ord-001",
    orderId: "AMZ-TK-9283748",
    productName: 'Apple MacBook Air M3 13" Laptop',
    productImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=80&h=80&fit=crop",
    price: 114900,
    platform: "Amazon",
    status: "In Transit",
    courier: "Blue Dart",
    trackingNumber: "BD7823940012",
    eta: "2026-06-16",
    createdAt: "2026-06-12T10:30:00Z",
    category: "Electronics",
    timeline: [
      { id: "t1", status: "Order Placed", location: "Online", timestamp: "Jun 12, 10:30 AM", description: "Order confirmed successfully", completed: true },
      { id: "t2", status: "Packed", location: "Amazon Warehouse, Mumbai", timestamp: "Jun 12, 03:45 PM", description: "Item packed and ready for pickup", completed: true },
      { id: "t3", status: "Shipped", location: "Mumbai Hub", timestamp: "Jun 13, 08:15 AM", description: "Shipped with Blue Dart", completed: true },
      { id: "t4", status: "Reached Hub", location: "Delhi Distribution Centre", timestamp: "Jun 14, 11:00 AM", description: "Package arrived at local hub", completed: true },
      { id: "t5", status: "Out for Delivery", location: "Delivery Centre", timestamp: "Expected Jun 16", description: "Will be out for delivery soon", completed: false },
      { id: "t6", status: "Delivered", location: "Your Address", timestamp: "Expected Jun 16", description: "Estimated delivery", completed: false },
    ],
  },
  {
    id: "ord-002",
    orderId: "FK-OD-234781923",
    productName: "Samsung 65\" 4K QLED Smart TV",
    productImage: "https://images.unsplash.com/photo-1593359677879-a4bb92f4834a?w=80&h=80&fit=crop",
    price: 74999,
    platform: "Flipkart",
    status: "Out for Delivery",
    courier: "Ekart",
    trackingNumber: "EK99234781",
    eta: "2026-06-14",
    createdAt: "2026-06-10T14:00:00Z",
    category: "Electronics",
    timeline: [
      { id: "t1", status: "Order Placed", location: "Online", timestamp: "Jun 10, 2:00 PM", description: "Order confirmed successfully", completed: true },
      { id: "t2", status: "Packed", location: "Flipkart WH, Bangalore", timestamp: "Jun 11, 09:00 AM", description: "Item packed and ready", completed: true },
      { id: "t3", status: "Shipped", location: "Bangalore Hub", timestamp: "Jun 11, 06:30 PM", description: "Shipped with Ekart Logistics", completed: true },
      { id: "t4", status: "Reached Hub", location: "Delhi Hub", timestamp: "Jun 13, 04:00 PM", description: "Package at local facility", completed: true },
      { id: "t5", status: "Out for Delivery", location: "Near Your Area", timestamp: "Jun 14, 09:30 AM", description: "Out for delivery today!", completed: true },
      { id: "t6", status: "Delivered", location: "Your Address", timestamp: "Expected Today", description: "Arriving today", completed: false },
    ],
  },
  {
    id: "ord-003",
    orderId: "MYN-23948712",
    productName: "Nike Air Max 270 Running Shoes",
    productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop",
    price: 12995,
    platform: "Myntra",
    status: "Delivered",
    courier: "Delhivery",
    trackingNumber: "DL78234901",
    eta: "2026-06-13",
    createdAt: "2026-06-08T09:15:00Z",
    category: "Footwear",
    timeline: [
      { id: "t1", status: "Order Placed", location: "Online", timestamp: "Jun 8, 9:15 AM", description: "Order confirmed", completed: true },
      { id: "t2", status: "Packed", location: "Myntra FC, Bangalore", timestamp: "Jun 9, 11:00 AM", description: "Packed by seller", completed: true },
      { id: "t3", status: "Shipped", location: "Bangalore", timestamp: "Jun 9, 04:00 PM", description: "Shipped via Delhivery", completed: true },
      { id: "t4", status: "Reached Hub", location: "Delhi Hub", timestamp: "Jun 11, 08:30 AM", description: "Arrived at hub", completed: true },
      { id: "t5", status: "Out for Delivery", location: "Delhi", timestamp: "Jun 13, 10:00 AM", description: "Out for delivery", completed: true },
      { id: "t6", status: "Delivered", location: "Your Address", timestamp: "Jun 13, 03:20 PM", description: "Package delivered successfully", completed: true },
    ],
  },
  {
    id: "ord-004",
    orderId: "AMZ-TK-8812734",
    productName: "Sony WH-1000XM5 Headphones",
    productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop",
    price: 26990,
    platform: "Amazon",
    status: "Delayed",
    courier: "FedEx",
    trackingNumber: "FX99812734",
    eta: "2026-06-18",
    createdAt: "2026-06-09T16:45:00Z",
    category: "Electronics",
    timeline: [
      { id: "t1", status: "Order Placed", location: "Online", timestamp: "Jun 9, 4:45 PM", description: "Order confirmed", completed: true },
      { id: "t2", status: "Packed", location: "Amazon WH, Hyderabad", timestamp: "Jun 10, 12:00 PM", description: "Packed by seller", completed: true },
      { id: "t3", status: "Shipped", location: "Hyderabad", timestamp: "Jun 11, 09:00 AM", description: "Shipped via FedEx", completed: true },
      { id: "t4", status: "Reached Hub", location: "Mumbai Transit Hub", timestamp: "Jun 12, 06:00 PM", description: "Delayed due to weather", completed: false },
      { id: "t5", status: "Out for Delivery", location: "", timestamp: "Expected Jun 18", description: "Rescheduled delivery", completed: false },
      { id: "t6", status: "Delivered", location: "Your Address", timestamp: "Expected Jun 18", description: "New ETA: June 18", completed: false },
    ],
  },
  {
    id: "ord-005",
    orderId: "FK-OD-198234712",
    productName: "Whirlpool 7.5kg Washing Machine",
    productImage: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=80&h=80&fit=crop",
    price: 31499,
    platform: "Flipkart",
    status: "Packed",
    courier: "Flipkart Logistics",
    trackingNumber: "FL198234712",
    eta: "2026-06-17",
    createdAt: "2026-06-13T11:00:00Z",
    category: "Appliances",
    timeline: [
      { id: "t1", status: "Order Placed", location: "Online", timestamp: "Jun 13, 11:00 AM", description: "Order confirmed", completed: true },
      { id: "t2", status: "Packed", location: "Whirlpool WH, Pune", timestamp: "Jun 14, 09:00 AM", description: "Packed and ready", completed: true },
      { id: "t3", status: "Shipped", location: "Pune", timestamp: "Expected Jun 15", description: "Will be shipped soon", completed: false },
      { id: "t4", status: "Reached Hub", location: "", timestamp: "Expected Jun 16", description: "", completed: false },
      { id: "t5", status: "Out for Delivery", location: "", timestamp: "Expected Jun 17", description: "", completed: false },
      { id: "t6", status: "Delivered", location: "Your Address", timestamp: "Expected Jun 17", description: "", completed: false },
    ],
  },
  {
    id: "ord-006",
    orderId: "MYN-19823741",
    productName: "Levis 511 Slim Fit Jeans",
    productImage: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=80&h=80&fit=crop",
    price: 3299,
    platform: "Myntra",
    status: "Delivered",
    courier: "Shadowfax",
    trackingNumber: "SF91823741",
    eta: "2026-06-11",
    createdAt: "2026-06-07T08:00:00Z",
    category: "Fashion",
    timeline: [
      { id: "t1", status: "Order Placed", location: "Online", timestamp: "Jun 7, 8:00 AM", description: "Order confirmed", completed: true },
      { id: "t2", status: "Packed", location: "Seller WH", timestamp: "Jun 8, 10:00 AM", description: "Packed", completed: true },
      { id: "t3", status: "Shipped", location: "Mumbai", timestamp: "Jun 8, 03:00 PM", description: "Shipped via Shadowfax", completed: true },
      { id: "t4", status: "Reached Hub", location: "Delhi Hub", timestamp: "Jun 10, 07:00 AM", description: "At local hub", completed: true },
      { id: "t5", status: "Out for Delivery", location: "Delhi", timestamp: "Jun 11, 10:30 AM", description: "Out for delivery", completed: true },
      { id: "t6", status: "Delivered", location: "Your Address", timestamp: "Jun 11, 01:45 PM", description: "Delivered", completed: true },
    ],
  },
  {
    id: "ord-007",
    orderId: "AMZ-TK-7712634",
    productName: "Kindle Paperwhite 11th Gen",
    productImage: "https://images.unsplash.com/photo-1457305237443-da3fa8a4c7c5?w=80&h=80&fit=crop",
    price: 13999,
    platform: "Amazon",
    status: "In Transit",
    courier: "Amazon Logistics",
    trackingNumber: "AMZL7712634",
    eta: "2026-06-15",
    createdAt: "2026-06-11T13:00:00Z",
    category: "Electronics",
    timeline: [
      { id: "t1", status: "Order Placed", location: "Online", timestamp: "Jun 11, 1:00 PM", description: "Order confirmed", completed: true },
      { id: "t2", status: "Packed", location: "Amazon WH, Bangalore", timestamp: "Jun 11, 06:00 PM", description: "Packed", completed: true },
      { id: "t3", status: "Shipped", location: "Bangalore", timestamp: "Jun 12, 08:00 AM", description: "Shipped with Amazon Logistics", completed: true },
      { id: "t4", status: "Reached Hub", location: "Delhi Hub", timestamp: "Jun 13, 09:00 PM", description: "At hub", completed: true },
      { id: "t5", status: "Out for Delivery", location: "", timestamp: "Expected Jun 15", description: "", completed: false },
      { id: "t6", status: "Delivered", location: "Your Address", timestamp: "Expected Jun 15", description: "", completed: false },
    ],
  },
  {
    id: "ord-008",
    orderId: "FK-OD-134789234",
    productName: "Instant Pot Duo 7-in-1 Pressure Cooker",
    productImage: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=80&h=80&fit=crop",
    price: 8999,
    platform: "Flipkart",
    status: "Cancelled",
    courier: "Ekart",
    trackingNumber: "EK134789234",
    eta: "2026-06-12",
    createdAt: "2026-06-06T10:00:00Z",
    category: "Kitchen",
    timeline: [
      { id: "t1", status: "Order Placed", location: "Online", timestamp: "Jun 6, 10:00 AM", description: "Order confirmed", completed: true },
      { id: "t2", status: "Packed", location: "Seller WH", timestamp: "Jun 7, 11:00 AM", description: "Packed", completed: false },
      { id: "t3", status: "Shipped", location: "", timestamp: "", description: "", completed: false },
      { id: "t4", status: "Reached Hub", location: "", timestamp: "", description: "", completed: false },
      { id: "t5", status: "Out for Delivery", location: "", timestamp: "", description: "", completed: false },
      { id: "t6", status: "Delivered", location: "", timestamp: "", description: "", completed: false },
    ],
  },
];

export const spendingData = [
  { month: "Jan", amount: 12400, orders: 8 },
  { month: "Feb", amount: 8900, orders: 5 },
  { month: "Mar", amount: 15600, orders: 11 },
  { month: "Apr", amount: 9800, orders: 7 },
  { month: "May", amount: 21200, orders: 14 },
  { month: "Jun", amount: 18500, orders: 12 },
  { month: "Jul", amount: 13700, orders: 9 },
  { month: "Aug", amount: 25400, orders: 18 },
  { month: "Sep", amount: 17800, orders: 12 },
  { month: "Oct", amount: 31200, orders: 22 },
  { month: "Nov", amount: 42800, orders: 31 },
  { month: "Dec", amount: 28900, orders: 19 },
];

export const platformDistribution = [
  { name: "Amazon", value: 34, color: "#FF9900" },
  { name: "Flipkart", value: 21, color: "#2874F0" },
  { name: "Myntra", value: 18, color: "#FF3F6C" },
  { name: "Ajio", value: 15, color: "#DC2626" },
  { name: "Meesho", value: 12, color: "#9B59B6" },
];

export const notifications = [
  { id: "n1", title: "Package Out for Delivery", message: "Your Samsung 65\" 4K QLED TV is out for delivery and will arrive today.", time: "10 min ago", type: "delivery", read: false },
  { id: "n2", title: "Order Delayed", message: "Sony WH-1000XM5 Headphones delivery has been delayed due to weather conditions.", time: "2 hours ago", type: "delay", read: false },
  { id: "n3", title: "Package Delivered", message: "Your Nike Air Max 270 Running Shoes have been delivered successfully.", time: "Yesterday", type: "delivered", read: true },
  { id: "n4", title: "Order Shipped", message: "Kindle Paperwhite 11th Gen has been shipped via Amazon Logistics.", time: "2 days ago", type: "shipped", read: true },
  { id: "n5", title: "New Order Confirmed", message: "Your order for Apple MacBook Air M3 has been confirmed.", time: "3 days ago", type: "order", read: true },
];

export const metricStats = {
  totalOrders: { value: 99, growth: 12, trend: "up" },
  inTransit: { value: 23, growth: 8, trend: "up" },
  delivered: { value: 67, growth: 15, trend: "up" },
  delayed: { value: 9, growth: -3, trend: "down" },
};
