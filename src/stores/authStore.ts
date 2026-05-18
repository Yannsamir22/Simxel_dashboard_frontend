// SECURITY: Added refreshToken storage
// SECURITY: Added tokenExpiresAt tracking  
// SECURITY: Added role field to Owner for RBAC enforcement on frontend
// SECURITY: logout() now also clears business store (call clearBusiness separately or use useLogout hook)
// NOTE: Token is stored in localStorage via Zustand persist.
//   For highest security, migrate to httpOnly cookies on the backend.
//   This is the pragmatic approach for a frontend-only change.

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Owner {
  id: string;
  email: string;
  name: string | null;
  role: "owner" | "admin" | "manager" | "user";
}

export interface Business {
  id: string;
  name: string;
  currency: string;
  type: string | null;
  isActivated: boolean;
  planType: string;
  dashboardExpiresAt: string | null;
  secretKey: string;
  ownerId: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  tokenExpiresAt: number | null; // Unix timestamp ms
  owner: Owner | null;
  businesses: Business[];
  isAuthenticated: boolean;

  setAuth: (
    token: string,
    owner: Owner,
    businesses: Business[],
    refreshToken?: string,
    expiresIn?: number, // seconds
  ) => void;
  logout: () => void;
  isTokenExpired: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      tokenExpiresAt: null,
      owner: null,
      businesses: [],
      isAuthenticated: false,

      setAuth: (token, owner, businesses, refreshToken, expiresIn) => {
        const tokenExpiresAt = expiresIn
          ? Date.now() + expiresIn * 1000
          : null;
        set({
          token,
          refreshToken: refreshToken ?? null,
          tokenExpiresAt,
          owner,
          businesses,
          isAuthenticated: true,
        });
      },

      logout: () =>
        set({
          token: null,
          refreshToken: null,
          tokenExpiresAt: null,
          owner: null,
          businesses: [],
          isAuthenticated: false,
        }),

      isTokenExpired: () => {
        const { tokenExpiresAt } = get();
        if (!tokenExpiresAt) return false;
        // Treat as expired 30s before actual expiry (buffer)
        return Date.now() > tokenExpiresAt - 30_000;
      },
    }),
    {
      name: "simxel-auth",
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        tokenExpiresAt: state.tokenExpiresAt,
        owner: state.owner,
        businesses: state.businesses,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);