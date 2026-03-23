// src/services/reportService.ts
import axios from "axios";
import { axiosInstance } from "../api/api";
import { useAuthStore } from "../stores/authStore";
import { useBusinessStore } from "../stores/businessStore";

const BASE = "/businesses/:businessId/reports";

// Shared Excel download helper — bypasses the shared interceptor
// to avoid blob/arraybuffer conflicts
async function downloadExcel(
  path: string,
  params: Record<string, string | undefined>,
  fileName: string,
) {
  const token = useAuthStore.getState().token;
  const businessId = useBusinessStore.getState().selectedBusinessId;

  if (!businessId) throw new Error("No business selected.");
  if (!token) throw new Error("Not authenticated.");

  const url = `http://localhost:4000/api/businesses/${businessId}${path}`;
  const response = await axios.get(url, {
    params,
    headers: { Authorization: `Bearer ${token}` },
    responseType: "arraybuffer",
  });

  // Check if the server returned a JSON error inside the arraybuffer
  const contentType = response.headers["content-type"] ?? "";
  if (contentType.includes("application/json")) {
    const text = new TextDecoder().decode(response.data as ArrayBuffer);
    const json = JSON.parse(text);
    throw new Error(json.error ?? "Export failed.");
  }

  const blob = new Blob([response.data as ArrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 1000);
}

export const ReportService = {
  // ── JSON endpoints ─────────────────────────────────────────────────────
  getSalesSummary: async (startDate: string, endDate: string) => {
    const res = await axiosInstance.get(`${BASE}/summary`, {
      params: { startDate, endDate },
    });
    return res.data;
  },

  getTopItems: async (startDate: string, endDate: string, limit = 10) => {
    const res = await axiosInstance.get(`${BASE}/top-items`, {
      params: { startDate, endDate, limit },
    });
    return res.data;
  },

  getStaffPerformance: async (startDate: string, endDate: string) => {
    const res = await axiosInstance.get(`${BASE}/staff-performance`, {
      params: { startDate, endDate },
    });
    return res.data;
  },

  getFinancialBalance: async (startDate: string, endDate: string) => {
    const res = await axiosInstance.get(`${BASE}/financial-balance`, {
      params: { startDate, endDate },
    });
    return res.data;
  },

  getStockStatus: async () => {
    const res = await axiosInstance.get(`${BASE}/stock-status`);
    return res.data;
  },

  // ── Excel exports ───────────────────────────────────────────────────────
  exportSalesJournal: (
    startDate: string,
    endDate: string,
    businessName?: string,
  ) =>
    downloadExcel(
      "/reports/export/sales-journal",
      { startDate, endDate, businessName },
      `Journal_Ventes_${startDate}_${endDate}.xlsx`,
    ),

  exportStaffPerformance: (
    startDate: string,
    endDate: string,
    businessName?: string,
  ) =>
    downloadExcel(
      "/reports/export/staff-performance",
      { startDate, endDate, businessName },
      `Performance_Staff_${startDate}_${endDate}.xlsx`,
    ),

  exportStockStatus: (businessName?: string) =>
    downloadExcel(
      "/reports/export/stock-status",
      { businessName },
      `Etat_Stocks_${new Date().toISOString().split("T")[0]}.xlsx`,
    ),

  exportFinancialBalance: (
    startDate: string,
    endDate: string,
    businessName?: string,
  ) =>
    downloadExcel(
      "/reports/export/financial-balance",
      { startDate, endDate, businessName },
      `Bilan_Financier_${startDate}_${endDate}.xlsx`,
    ),
};
