import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Owner {
  id: string;
  email: string;
  name: string | null;
}

export interface Business {
  id: string;
  name: string;
  currency: string;
  type: string | null;
  isActivated: boolean;
}

interface AuthState {
  token: string | null;
  owner: Owner | null;
  businesses: Business[];
  isAuthenticated: boolean;

  setAuth: (token: string, owner: Owner, businesses: Business[]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      owner: null,
      businesses: [],
      isAuthenticated: false,

      setAuth: (token, owner, businesses) =>
        set({ token, owner, businesses, isAuthenticated: true }),

      logout: () =>
        set({
          token: null,
          owner: null,
          businesses: [],
          isAuthenticated: false,
        }),
    }),
    {
      name: "simxel-auth", // localStorage key
      // Only persist token and owner — not the full businesses list
      partialize: (state) => ({
        token: state.token,
        owner: state.owner,
        businesses: state.businesses,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
