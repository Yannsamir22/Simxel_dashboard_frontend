// src/stores/reportStore.ts
import { create } from "zustand";
import { ReportService } from "../services/reportService";

export interface TopItem {
  name: string;
  type: string;
  quantity: number;
  revenue: number;
}

export interface StaffEntry {
  employeeId: string;
  employeeName: string;
  prestationCount: number;
  totalGenerated: number;
  commission: number;
}

export interface ReportSummary {
  period: { startDate: string; endDate: string };
  totalRevenue: number;
  totalTransactions: number;
  averageTransaction: number;
  paymentBreakdown: Record<string, number>;
}

export interface FinancialBalance {
  period: { startDate: string; endDate: string };
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  expenseBreakdown: Record<string, number>;
}

export interface StockEntry {
  productId: string;
  productName: string;
  currentStock: number;
  minStockAlert: number;
  status: "OK" | "ALERT";
}

interface ReportState {
  // Date range
  startDate: string;
  endDate: string;
  setDateRange: (start: string, end: string) => void;

  // Summary
  summary: ReportSummary | null;
  summaryLoading: boolean;
  summaryError: string | null;
  fetchSummary: () => Promise<void>;

  // Top items
  topItems: TopItem[];
  topItemsLoading: boolean;
  topItemsError: string | null;
  fetchTopItems: (limit?: number) => Promise<void>;

  // Staff performance
  staffData: StaffEntry[];
  staffLoading: boolean;
  staffError: string | null;
  fetchStaffPerformance: () => Promise<void>;

  // Financial balance
  balance: FinancialBalance | null;
  balanceLoading: boolean;
  balanceError: string | null;
  fetchFinancialBalance: () => Promise<void>;

  // Stock status
  stockData: StockEntry[];
  stockLoading: boolean;
  stockError: string | null;
  fetchStockStatus: () => Promise<void>;

  // Fetch everything at once
  fetchAll: () => Promise<void>;
}

// Default range: current month
const now            = new Date();
const defaultStart   = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
const defaultEnd     = now.toISOString().split("T")[0];

export const useReportStore = create<ReportState>((set, get) => ({
  startDate: defaultStart,
  endDate:   defaultEnd,

  setDateRange: (startDate, endDate) => set({ startDate, endDate }),

  // ── Summary ──────────────────────────────────────────────────────────────
  summary:        null,
  summaryLoading: false,
  summaryError:   null,

  fetchSummary: async () => {
    const { startDate, endDate } = get();
    set({ summaryLoading: true, summaryError: null });
    try {
      const res = await ReportService.getSalesSummary(startDate, endDate);
      set({ summary: res.ok ? res.data : null, summaryLoading: false });
      if (!res.ok) set({ summaryError: res.error ?? "Failed to load summary." });
    } catch (error: any) {
      set({
        summaryLoading: false,
        summaryError: error.response?.data?.error ?? "Failed to load summary.",
      });
    }
  },

  // ── Top items ─────────────────────────────────────────────────────────────
  topItems:        [],
  topItemsLoading: false,
  topItemsError:   null,

  fetchTopItems: async (limit = 10) => {
    const { startDate, endDate } = get();
    set({ topItemsLoading: true, topItemsError: null });
    try {
      const res = await ReportService.getTopItems(startDate, endDate, limit);
      set({ topItems: res.ok ? (res.data ?? []) : [], topItemsLoading: false });
      if (!res.ok) set({ topItemsError: res.error ?? "Failed to load top items." });
    } catch (error: any) {
      set({
        topItemsLoading: false,
        topItemsError: error.response?.data?.error ?? "Failed to load top items.",
      });
    }
  },

  // ── Staff performance ─────────────────────────────────────────────────────
  staffData:    [],
  staffLoading: false,
  staffError:   null,

  fetchStaffPerformance: async () => {
    const { startDate, endDate } = get();
    set({ staffLoading: true, staffError: null });
    try {
      const res = await ReportService.getStaffPerformance(startDate, endDate);
      set({ staffData: res.ok ? (res.data ?? []) : [], staffLoading: false });
      if (!res.ok) set({ staffError: res.error ?? "Failed to load staff data." });
    } catch (error: any) {
      set({
        staffLoading: false,
        staffError: error.response?.data?.error ?? "Failed to load staff data.",
      });
    }
  },

  // ── Financial balance ─────────────────────────────────────────────────────
  balance:        null,
  balanceLoading: false,
  balanceError:   null,

  fetchFinancialBalance: async () => {
    const { startDate, endDate } = get();
    set({ balanceLoading: true, balanceError: null });
    try {
      const res = await ReportService.getFinancialBalance(startDate, endDate);
      set({ balance: res.ok ? res.data : null, balanceLoading: false });
      if (!res.ok) set({ balanceError: res.error ?? "Failed to load balance." });
    } catch (error: any) {
      set({
        balanceLoading: false,
        balanceError: error.response?.data?.error ?? "Failed to load balance.",
      });
    }
  },

  // ── Stock status ──────────────────────────────────────────────────────────
  stockData:    [],
  stockLoading: false,
  stockError:   null,

  fetchStockStatus: async () => {
    set({ stockLoading: true, stockError: null });
    try {
      const res = await ReportService.getStockStatus();
      set({ stockData: res.ok ? (res.data ?? []) : [], stockLoading: false });
      if (!res.ok) set({ stockError: res.error ?? "Failed to load stock status." });
    } catch (error: any) {
      set({
        stockLoading: false,
        stockError: error.response?.data?.error ?? "Failed to load stock status.",
      });
    }
  },

  // ── Fetch all ─────────────────────────────────────────────────────────────
  fetchAll: async () => {
    const { fetchSummary, fetchTopItems, fetchStaffPerformance, fetchFinancialBalance, fetchStockStatus } = get();
    await Promise.allSettled([
      fetchSummary(),
      fetchTopItems(),
      fetchStaffPerformance(),
      fetchFinancialBalance(),
      fetchStockStatus(),
    ]);
  },
}));