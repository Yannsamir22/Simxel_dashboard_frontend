
import axios from "axios";

const authAxios = axios.create({
  baseURL: "http://localhost:4000/api",
});

export const AuthService = {
  // LoginPage calls AuthService.login(email, password) — two separate args
  login: async (email: string, password: string) => {
    const res = await authAxios.post("/auth/login", { email, password });
    return res.data; // { ok, token, owner, businesses }
  },

  getMe: async (token: string) => {
    const res = await authAxios.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    const res = await authAxios.put("/auth/password", { oldPassword, newPassword });
    return res.data;
  },
};