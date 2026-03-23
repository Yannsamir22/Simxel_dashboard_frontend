// src/services/businessService.ts
import { axiosInstance } from "../api/api";

export const BusinessService = {
  // GET /businesses — list all owner's businesses
  getMyBusinesses: async () => {
    const res = await axiosInstance.get("/businesses");
    return res.data; // { ok, data: Business[] }
  },

  // GET /businesses/:businessId/
  getBusinessInfo: async () => {
    const res = await axiosInstance.get("/businesses/:businessId/");
    return res.data;
  },

  // PUT /businesses/:businessId/
  updateBusinessInfo: async (data: {
    name?: string;
    currency?: string;
    type?: string;
  }) => {
    const res = await axiosInstance.put("/businesses/:businessId/", data);
    return res.data;
  },

  // GET /businesses/:businessId/pos-config
  getPosConfig: async () => {
    const res = await axiosInstance.get("/businesses/:businessId/pos-config");
    return res.data;
  },

  // POST /businesses/:businessId/pos-config/reset
  resetPosPasswords: async (data: {
    mainPassword: string;
    adminPassword: string;
  }) => {
    const res = await axiosInstance.post("/businesses/:businessId/pos-config/reset", data);
    return res.data;
  },

  // PUT /businesses/:businessId/pos-config/main-password
  changePosMainPassword: async (data: {
    currentAdminPassword: string;
    newMainPassword: string;
  }) => {
    const res = await axiosInstance.put("/businesses/:businessId/pos-config/main-password", data);
    return res.data;
  },

  // PUT /businesses/:businessId/pos-config/admin-password
  changePosAdminPassword: async (data: {
    currentAdminPassword: string;
    newAdminPassword: string;
  }) => {
    const res = await axiosInstance.put("/businesses/:businessId/pos-config/admin-password", data);
    return res.data;
  },
};