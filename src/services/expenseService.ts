import { axiosInstance } from "../api/api";

const BASE = "/businesses/:businessId/expenses";

export const fetchExpenses = () => axiosInstance.get(BASE).then((r) => r.data);

export const fetchExpensesByRange = (start: string, end: string) =>
  axiosInstance
    .get(`${BASE}/range`, { params: { start, end } })
    .then((r) => r.data);

export const createExpense = (data: {
  type: string;
  amount: number;
  date?: string;
}) => axiosInstance.post(BASE, data).then((r) => r.data);

export const updateExpense = (
  id: string,
  data: { type?: string; amount?: number; date?: string },
) => axiosInstance.put(`${BASE}/${id}`, data).then((r) => r.data);

export const deleteExpense = (id: string) =>
  axiosInstance.delete(`${BASE}/${id}`).then((r) => r.data);
