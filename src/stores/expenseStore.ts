import { create } from "zustand";
import {
  createExpense,
  deleteExpense,
  fetchExpenses,
  updateExpense,
} from "../services/expenseService";

export interface Expense {
  id: string;
  type: string;
  note?: string | null;
  amount: number;
  date: string;
  updatedAt: string;
}

type ExpenseState = {
  expenses: Expense[];
  loading: boolean;
  error: string | null;

  fetchExpenses: () => Promise<void>;
  addExpense: (data: {
    type: string;
    amount: number;
    note?: string;
    date?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  editExpense: (
    id: string,
    data: { type?: string; amount?: number; note?: string; date?: string },
  ) => Promise<{ success: boolean; error?: string }>;
  removeExpense: (id: string) => Promise<{ success: boolean; error?: string }>;
};

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [],
  loading: false,
  error: null,

  fetchExpenses: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchExpenses();
      set({ expenses: res.data ?? [], loading: false });
    } catch (error: any) {
      const msg = error.response?.data?.error ?? "Failed to fetch expenses";
      console.error(msg);
      set({ loading: false, error: msg });
    }
  },

  addExpense: async (data) => {
    try {
      const res = await createExpense(data);
      const item = res.data ?? res.expense ?? res;
      set((state) => ({ expenses: [...state.expenses, item] }));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to create expense",
      };
    }
  },

  editExpense: async (id, data) => {
    try {
      const res = await updateExpense(id, data);
      const item = res.data ?? res.expense ?? res;
      set((state) => ({
        expenses: state.expenses.map((e) =>
          e.id === id ? { ...e, ...item } : e,
        ),
      }));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to update expense",
      };
    }
  },

  removeExpense: async (id) => {
    try {
      await deleteExpense(id);
      set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id),
      }));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to delete expense",
      };
    }
  },
}));