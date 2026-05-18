// src/services/authService.ts
// SECURITY: login now returns refreshToken + expiresIn
// SECURITY: separate unauthenticated axios instance for login (no token leakage)
// SECURITY: added logout() to invalidate refresh token server-side
// SECURITY: added refreshToken() method for manual refresh

import axios from "axios";
import { axiosInstance } from "../api/api";

const BASE_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:4000") + "/api";

// Plain instance — only used for unauthenticated calls (login, refresh)
const authAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

export const AuthService = {
  /**
   * Email/password login.
   * Expected response: { ok, token, refreshToken, expiresIn, owner, businesses }
   */
  login: async (email: string, password: string) => {
    const res = await authAxios.post("/auth/login", { email, password });
    return res.data;
  },

  /**
   * Google OAuth login.
   * Expected response: { ok, token, refreshToken, expiresIn, owner, businesses }
   */
  googleLogin: async (idToken: string) => {
    const res = await authAxios.post("/auth/google", { idToken });
    return res.data;
  },

  /**
   * Validates the current access token and returns the logged-in user.
   */
  getMe: async () => {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  },

  /**
   * Server-side logout — invalidates the refresh token.
   * Best-effort: if it fails, local state is cleared anyway.
   */
  logout: async (refreshToken: string) => {
    try {
      await axiosInstance.post("/auth/logout", { refreshToken });
    } catch {
      // Ignore — local logout proceeds regardless
    }
  },

  /**
   * Manually refresh the access token.
   */
  refreshToken: async (refreshToken: string) => {
    const res = await authAxios.post("/auth/refresh", { refreshToken });
    return res.data;
  },

  /**
   * Change the dashboard password.
   */
  changePassword: async (oldPassword: string, newPassword: string) => {
    const res = await axiosInstance.put("/auth/password", {
      oldPassword,
      newPassword,
    });
    return res.data;
  },
};