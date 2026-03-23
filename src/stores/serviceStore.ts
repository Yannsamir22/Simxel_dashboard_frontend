
import { create } from "zustand";
import { ServiceService } from "../services/serviceService";

export interface Service {
  id: string;
  name: string;
  price: number;
}

interface ServiceState {
  services: Service[];
  loading: boolean;
  error: string | null;

  loadServices: () => Promise<void>;
  addService: (data: {
    name: string;
    price: number;
  }) => Promise<{ success: boolean; error?: string }>;
  editService: (
    id: string,
    data: { name?: string; price?: number },
  ) => Promise<{ success: boolean; error?: string }>;
  removeService: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export const useServiceStore = create<ServiceState>((set) => ({
  services: [],
  loading: false,
  error: null,

  loadServices: async () => {
    set({ loading: true, error: null });
    try {
      const res = await ServiceService.fetchServices();
      // Backend returns { ok: true, data: Service[] }
      set({ services: res.data ?? [], loading: false });
    } catch (error: any) {
      const msg = error.response?.data?.error ?? "Failed to fetch services";
      set({ loading: false, error: msg });
    }
  },

  addService: async (data) => {
    try {
      const res = await ServiceService.createService(data);
      const item = res.data ?? res;
      set((state) => ({ services: [...state.services, item] }));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to create service",
      };
    }
  },

  editService: async (id, data) => {
    try {
      const res = await ServiceService.updateService(id, data);
      const item = res.data ?? res;
      set((state) => ({
        services: state.services.map((e) =>
          e.id === id ? { ...e, ...item } : e,
        ),
      }));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to update service",
      };
    }
  },

  removeService: async (id) => {
    try {
      await ServiceService.deleteService(id);
      set((state) => ({
        services: state.services.filter((e) => e.id !== id),
      }));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to delete service",
      };
    }
  },
}));