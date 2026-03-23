import { axiosInstance } from "../api/api";

const BASE = "/businesses/:businessId/products";

export const ProductService = {
  fetchProducts: () => axiosInstance.get(BASE).then((r) => r.data),

  getLowStock: () => axiosInstance.get(`${BASE}/low-stock`).then((r) => r.data),

  getProductById: (id: string) =>
    axiosInstance.get(`${BASE}/${id}`).then((r) => r.data),

  createProduct: (data: {
    name: string;
    salePrice: number;
    unitCost?: number;
    stock?: number;
    minStockAlert?: number;
  }) => axiosInstance.post(BASE, data).then((r) => r.data),

  updateProduct: (
    id: string,
    data: {
      name?: string;
      salePrice?: number;
      unitCost?: number;
      stock?: number;
      minStockAlert?: number;
    },
  ) => axiosInstance.put(`${BASE}/${id}`, data).then((r) => r.data),

  deleteProduct: (id: string) =>
    axiosInstance.delete(`${BASE}/${id}`).then((r) => r.data),

  // Keep for backward compatibility with productStore.adjustStock
  adjustProductStock: (id: string, quantity: number) =>
    axiosInstance
      .post("/businesses/:businessId/stock/adjust", {
        productId: id,
        type: quantity >= 0 ? "IN" : "OUT",
        quantity: Math.abs(quantity),
      })
      .then((r) => r.data),
};
