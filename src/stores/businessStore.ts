// src/stores/businessStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Business } from "./authStore";

interface BusinessState {
  selectedBusinessId: string | null;
  selectedBusiness: Business | null;

  selectBusiness: (business: Business) => void;
  clearBusiness: () => void;
}

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set) => ({
      selectedBusinessId: null,
      selectedBusiness: null,

      selectBusiness: (business) =>
        set({
          selectedBusinessId: business.id,
          selectedBusiness: business,
        }),

      clearBusiness: () =>
        set({
          selectedBusinessId: null,
          selectedBusiness: null,
        }),
    }),
    {
      name: "simxel-business",
    }
  )
);