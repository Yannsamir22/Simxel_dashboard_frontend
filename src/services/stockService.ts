import { axiosInstance } from "../api/api";

const BASE = "/businesses/:businessId/stock";

export const StockService = {
  getAll: () => axiosInstance.get(BASE).then((r) => r.data),

  getByProduct: (productId: string) =>
    axiosInstance.get(`${BASE}/product/${productId}`).then((r) => r.data),

  adjust: (data: {
    productId: string;
    type: "IN" | "OUT" | "ADJUSTMENT";
    quantity: number;
    reason?: string;
  }) => axiosInstance.post(`${BASE}/adjust`, data).then((r) => r.data),
};
