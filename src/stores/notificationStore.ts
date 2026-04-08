import { create } from "zustand";
import { NotificationService } from "../services/notificationService";

export type NotificationType =
  | "LOW_STOCK"
  | "SYNC_WARNING"
  | "WEEKLY_SUMMARY"
  | "INFO";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;

  fetchNotifications: (businessId: string) => Promise<void>;
  fetchUnreadCount: (businessId: string) => Promise<void>;
  markAsRead: (businessId: string, id: string) => Promise<void>;
  markAllAsRead: (businessId: string) => Promise<void>;
  deleteOne: (
    businessId: string,
    id: string,
    wasRead: boolean,
  ) => Promise<void>;
  clearRead: (businessId: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setNotifications: (notifications: Notification[]) => void;
  setUnreadCount: (count: number) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  setLoading: (loading) => set({ loading }),
  setNotifications: (notifications) => set({ notifications }),
  setUnreadCount: (count) => set({ unreadCount: count }),

  fetchNotifications: async (_businessId) => {
    set({ loading: true, error: null });
    try {
      const res = await NotificationService.getAll(_businessId);
      set({
        notifications: res.notifications ?? [],
        unreadCount: res.unreadCount ?? 0,
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err.response?.data?.error ?? "Failed to load notifications.",
      });
    }
  },

  fetchUnreadCount: async (_businessId) => {
    try {
      const res = await NotificationService.getUnreadCount(_businessId);
      set({ unreadCount: res.count ?? 0 });
    } catch {}
  },

  markAsRead: async (_businessId, id) => {
    try {
      await NotificationService.markAsRead(_businessId, id);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n,
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch {}
  },

  markAllAsRead: async (_businessId) => {
    try {
      await NotificationService.markAllAsRead(_businessId);
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch {}
  },

  deleteOne: async (_businessId, id, wasRead) => {
    try {
      await NotificationService.deleteOne(_businessId, id);
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: wasRead
          ? state.unreadCount
          : Math.max(0, state.unreadCount - 1),
      }));
    } catch {}
  },

  clearRead: async (_businessId) => {
    try {
      await NotificationService.clearRead(_businessId);
      set((state) => ({
        notifications: state.notifications.filter((n) => !n.isRead),
      }));
    } catch {}
  },
}));
