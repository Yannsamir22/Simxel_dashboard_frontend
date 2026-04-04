import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import { useBusinessStore } from "../stores/businessStore";

export const axiosInstance = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:4000") + "/api",
  withCredentials: false,
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const businessId = useBusinessStore.getState().selectedBusinessId;
  if (businessId && config.url?.includes(":businessId")) {
    config.url = config.url.replace(":businessId", businessId);
  }

  return config;
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

// POST /api/auth/google
// baseURL is already ".../api" so the path must be "/auth/google" — not "/api/auth/google"
export async function googleAuth(idToken: string, businessName?: string) {
  const res = await axiosInstance.post("/auth/google", {
    idToken,
    ...(businessName ? { businessName } : {}),
  });
  return res.data;
}