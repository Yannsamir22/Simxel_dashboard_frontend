import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Business } from "./authStore";

interface BusinessState {
  selectedBusinessId: string | null;
  selectedBusiness: Business | null;
  isDashboardExpired: boolean;

  selectBusiness: (business: Business) => void;
  setDashboardExpired: (expired: boolean) => void;
  clearBusiness: () => void;
}

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set) => ({
      selectedBusinessId: null,
      selectedBusiness: null,
      isDashboardExpired: false,

      selectBusiness: (business) =>
        set({
          selectedBusinessId: business.id,
          selectedBusiness: business,
          isDashboardExpired: false, // Reset on business switch
        }),

      setDashboardExpired: (expired) => set({ isDashboardExpired: expired }),

      clearBusiness: () =>
        set({
          selectedBusinessId: null,
          selectedBusiness: null,
          isDashboardExpired: false,
        }),
    }),
    {
      name: "simxel-business",
    }
  )
);