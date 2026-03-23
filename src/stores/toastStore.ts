import { create } from "zustand";

export const useToastStore = create((set) => ({
  toasts: [],
  addToast: (message: string, type: string = "info", duration = 3000) => {
    const id = (Date.now() + Math.random()).toString();
    set((state: { toasts: any }) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));
    return id;
  },

  removeToast: (id: string) => {
    set((state: { toasts: any[] }) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));
