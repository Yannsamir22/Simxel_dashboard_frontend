import { create } from "zustand";
import {
  ProductService
} from "../services/productService";

export interface Product {
  id: string;
  name: string;
  unitCost: number | null;
  salePrice: number;
  stock: number;
  minStockAlert: number;
}

type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;

  fetchProducts: () => Promise<void>;
  addProduct: (data: {
    name: string;
    salePrice: number;
    unitCost?: number;
    stock?: number;
  }) => Promise<{ success: boolean; error?: string }>;
  editProduct: (
    id: string,
    data: {
      name?: string;
      salePrice?: number;
      unitCost?: number;
      stock?: number;
    },
  ) => Promise<{ success: boolean; error?: string }>;
  removeProduct: (id: string) => Promise<{ success: boolean; error?: string }>;
  adjustStock: (
    id: string,
    quantity: number,
  ) => Promise<{ success: boolean; error?: string }>;
};

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await ProductService.fetchProducts();
      set({ products: res.data ?? [], loading: false });
    } catch (error: any) {
      const msg = error.response?.data?.error ?? "Failed to fetch products";
      console.error(msg);
      set({ loading: false, error: msg });
    }
  },

  addProduct: async (data) => {
    try {
      const res = await ProductService.createProduct(data);
      const item = res.data ?? res.product ?? res;
      set((state) => ({ products: [...state.products, item] }));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to create product",
      };
    }
  },

  editProduct: async (id, data) => {
    try {
      const res = await ProductService.updateProduct(id, data);
      const item = res.data ?? res.product ?? res;
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...item } : p,
        ),
      }));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to update product",
      };
    }
  },

  removeProduct: async (id) => {
    try {
      await ProductService.deleteProduct(id);
      set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to delete product",
      };
    }
  },

  adjustStock: async (id, quantity) => {
    try {
      const res = await ProductService.adjustProductStock(id, quantity);
      const item = res.data ?? res.product ?? res;
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...item } : p,
        ),
      }));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to adjust stock",
      };
    }
  },
}));
