import { create } from "zustand";
import { PackageService } from "../services/packageService";

export interface PackageItems {
  serviceId: string;
  name: string;
  price: number;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  services: PackageItems[];
}

type PackageState = {
  packages: Package[];
  loading: boolean;
  error: string | null;

  fetchPackages: () => Promise<void>;
  addPackage: (data: {
    name: string;
    price: number;
    serviceIds: string[];
  }) => Promise<{ success: boolean; error?: string }>;
  editPackage: (
    id: string,
    data: { name?: string; price?: number; serviceIds?: string[] },
  ) => Promise<{ success: boolean; error?: string }>;
  removePackage: (id: string) => Promise<{ success: boolean; error?: string }>;
};

// Normalize backend package shape -> flat services array for the UI
function normalize(pkg: any): Package {
  return {
    id: pkg.id,
    name: pkg.name,
    price: pkg.price,
    services: (pkg.items ?? []).map((item: any) => ({
      serviceId: item.service?.id ?? item.serviceId,
      name: item.service?.name ?? item.name ?? "Unknown",
      price: item.service?.price ?? item.price ?? 0,
    })),
  };
}

export const usePackageStore = create<PackageState>((set) => ({
  packages: [],
  loading: false,
  error: null,

  fetchPackages: async () => {
    set({ loading: true, error: null });
    try {
      const res = await PackageService.fetchPackages();
      // Backend shape: { ok: true, packages: Package[] }
      const raw: any[] = res.packages ?? res.data ?? [];
      set({ packages: raw.map(normalize), loading: false });
    } catch (error: any) {
      const msg = error.response?.data?.error ?? "Failed to fetch packages";
      console.error(msg);
      set({ loading: false, error: msg });
    }
  },

  addPackage: async (data) => {
    try {
      const res = await PackageService.createPackage(data);
      const raw = res.package ?? res.data ?? res;
      set((state) => ({ packages: [...state.packages, normalize(raw)] }));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to create package",
      };
    }
  },

  editPackage: async (id, data) => {
    try {
      const res = await PackageService.updatePackage(id, data);
      const raw = res.package ?? res.data ?? res;
      set((state) => ({
        packages: state.packages.map((p) => (p.id === id ? normalize(raw) : p)),
      }));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to update package",
      };
    }
  },

  removePackage: async (id) => {
    try {
      await PackageService.deletePackage(id);
      set((state) => ({ packages: state.packages.filter((p) => p.id !== id) }));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to delete package",
      };
    }
  },
}));
