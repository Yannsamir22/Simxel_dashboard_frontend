import { create } from "zustand";
import { EmployeeService } from "../services/employeeService";

export interface Employee {
  id: string;
  name: string;
  role: string;
  dateOfBirth?: string | null;
  commissionRate: number;
}

interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;

  loadEmployees: () => Promise<void>;
  addEmployee: (data: {
    name: string;
    role?: string;
    dateOfBirth?: string;
    commissionRate?: number;
  }) => Promise<{ success: boolean; error?: string }>;
  editEmployee: (
    id: string,
    data: {
      name?: string;
      role?: string;
      dateOfBirth?: string;
      commissionRate?: number;
    },
  ) => Promise<{ success: boolean; error?: string }>;
  removeEmployee: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: [],
  loading: false,
  error: null,

  loadEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const res = await EmployeeService.getEmployees();
      set({ employees: res.data ?? [], loading: false });
    } catch (error: any) {
      const message =
        error.response?.data?.error ?? "Failed to fetch employees";
      set({ loading: false, error: message });
    }
  },

  addEmployee: async (data) => {
    try {
      const res = await EmployeeService.createEmployee(data);
      const item = res.data ?? res;
      set((state) => ({ employees: [...state.employees, item] }));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to create employee",
      };
    }
  },

  editEmployee: async (id, data) => {
    try {
      const res = await EmployeeService.updateEmployee(id, data);
      const item = res.data ?? res;
      set((state) => ({
        employees: state.employees.map((e) =>
          e.id === id ? { ...e, ...item } : e,
        ),
      }));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to update employee",
      };
    }
  },

  removeEmployee: async (id) => {
    try {
      await EmployeeService.deleteEmployee(id);
      set((state) => ({
        employees: state.employees.filter((e) => e.id !== id),
      }));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to delete employee",
      };
    }
  },
}));
