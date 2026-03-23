import { axiosInstance } from "../api/api";

const BASE = "/businesses/:businessId/employees";

export const EmployeeService = {
  getEmployees: () => axiosInstance.get(BASE).then((r) => r.data),

  getEmployeeById: (id: string) =>
    axiosInstance.get(`${BASE}/${id}`).then((r) => r.data),

  createEmployee: (data: {
    name: string;
    role?: string;
    dateOfBirth?: string;
    commissionRate?: number;
  }) => axiosInstance.post(BASE, data).then((r) => r.data),

  updateEmployee: (
    id: string,
    data: {
      name?: string;
      role?: string;
      dateOfBirth?: string;
      commissionRate?: number;
    },
  ) => axiosInstance.put(`${BASE}/${id}`, data).then((r) => r.data),

  deleteEmployee: (id: string) =>
    axiosInstance.delete(`${BASE}/${id}`).then((r) => r.data),
};
