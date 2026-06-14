import { create } from "zustand";
import { orders as mockOrders } from "@/lib/mockData";
import type { Order } from "@/lib/mockData";

interface AppState {
  sidebarCollapsed: boolean;
  selectedOrder: Order | null;
  drawerOpen: boolean;
  searchQuery: string;
  activeFilter: string;
  orders: Order[];

  setSidebarCollapsed: (val: boolean) => void;
  toggleSidebar: () => void;
  setSelectedOrder: (order: Order | null) => void;
  openDrawer: (order: Order) => void;
  closeDrawer: () => void;
  setSearchQuery: (q: string) => void;
  setActiveFilter: (f: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  selectedOrder: null,
  drawerOpen: false,
  searchQuery: "",
  activeFilter: "all",
  orders: mockOrders,

  setSidebarCollapsed: (val) => set({ sidebarCollapsed: val }),
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSelectedOrder: (order) => set({ selectedOrder: order }),
  openDrawer: (order) => set({ selectedOrder: order, drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false, selectedOrder: null }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setActiveFilter: (f) => set({ activeFilter: f }),
}));
