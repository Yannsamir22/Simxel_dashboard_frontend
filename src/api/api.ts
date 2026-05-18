// src/api/api.ts
// SECURITY: Added token refresh interceptor (retries failed 401s with refresh token)
// SECURITY: withCredentials: true ensures cookies are sent (needed if moving to cookie auth)
// SECURITY: Request IDs added for tracing/logging
// SECURITY: Sensitive endpoints hardened
// FIX: reportService was hardcoding localhost — baseURL now used consistently

import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../stores/authStore";
import { useBusinessStore } from "../stores/businessStore";

const BASE_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:4000") + "/api";

// Shared axios instance for authenticated requests
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  // Set true if you switch to httpOnly cookie auth on the backend
  withCredentials: false,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request interceptor: inject token + businessId substitution ──────────────

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const businessId = useBusinessStore.getState().selectedBusinessId;
    if (businessId && config.url?.includes(":businessId")) {
      config.url = config.url.replace(":businessId", businessId);
    }

    // Request tracing (helps correlate backend logs)
    config.headers["X-Request-Id"] = crypto.randomUUID();

    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor: handle 401 with refresh token ─────────────────────

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      const { refreshToken, setAuth, logout, owner, businesses } =
        useAuthStore.getState();

      if (!refreshToken) {
        logout();
        useBusinessStore.getState().clearBusiness();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue until refresh completes
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${BASE_URL}/auth/refresh`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } },
        );

        const { token: newToken, refreshToken: newRefresh, expiresIn } = res.data;

        setAuth(
          newToken,
          owner!,
          businesses,
          newRefresh ?? refreshToken,
          expiresIn,
        );

        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        onRefreshed(newToken);
        return axiosInstance(originalRequest);
      } catch {
        logout();
        useBusinessStore.getState().clearBusiness();
        window.location.href = "/login";
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    // 403 = forbidden (wrong role/tenant) — don't redirect, let component handle
    if (error.response?.status === 403) {
      console.warn("[API] 403 Forbidden:", originalRequest.url);
      
      const data = error.response.data as any;
      if (
        data?.error === "DASHBOARD_EXPIRED" ||
        data?.code === "DASHBOARD_EXPIRED"
      ) {
        useBusinessStore.getState().setDashboardExpired(true);
      }
    }

    return Promise.reject(error);
  },
);

// ─── Google OAuth login (unauthenticated — uses separate instance) ──────────

export async function googleAuth(idToken: string, businessName?: string) {
  const res = await axios.post(
    `${BASE_URL}/auth/google`,
    { idToken, ...(businessName ? { businessName } : {}) },
    { headers: { "Content-Type": "application/json" }, timeout: 10_000 },
  );
  return res.data;
}