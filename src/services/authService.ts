import axios from "axios";
import { axiosInstance } from "../api/api";

// Plain instance — only used for unauthenticated calls (login)
const authAxios = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:4000") + "/api",
});

export const AuthService = {
  // LoginPage calls AuthService.login(email, password)
  login: async (email: string, password: string) => {
    const res = await authAxios.post("/auth/login", { email, password });
    return res.data;
  },

  getMe: async () => {
    // Uses axiosInstance — token is injected by the request interceptor
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  },

  // Uses axiosInstance : Bearer token sent automatically (fixes B3)
  changePassword: async (oldPassword: string, newPassword: string) => {
    const res = await axiosInstance.put("/auth/password", { oldPassword, newPassword });
    return res.data;
  },
};
