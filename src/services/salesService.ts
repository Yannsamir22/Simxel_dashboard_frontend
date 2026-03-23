import { axiosInstance } from "../api/api";

const BASE = "/businesses/:businessId/sales";

export const SalesService = {
  getAllSales: (params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }) => axiosInstance.get(BASE, { params }).then((r) => r.data),

  getSaleById: (id: string) =>
    axiosInstance.get(`${BASE}/${id}`).then((r) => r.data),

  getSalesByYear: (year: number) =>
    axiosInstance.get(`${BASE}/year/${year}`).then((r) => r.data),

  getDashboardStats: (period: string) =>
    axiosInstance
      .get(`${BASE}/stats`, { params: { period } })
      .then((r) => r.data),
};
