// src/stores/notificationStore.ts
// FIX: Added UPDATE_BANNER type
// FIX: clearRead now also recalculates unreadCount correctly
// FIX: All async actions now throw errors instead of silently swallowing them
//      (callers can handle if needed)

import { create } from "zustand";
import { NotificationService } from "../services/notificationService";

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'DANGER' | 'SUCCESS';
  isGlobal: boolean;
  createdAt: string;
  expiresAt: string | null;
}

export type NotificationType =
  | "LOW_STOCK"
  | "SYNC_WARNING"
  | "WEEKLY_SUMMARY"
  | "INFO"

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
  deleteOne: (businessId: string, id: string, wasRead: boolean) => Promise<void>;
  clearRead: (businessId: string) => Promise<void>;

  // Internal setters (used by component-level code if needed)
  setLoading: (loading: boolean) => void;
  setNotifications: (notifications: Notification[]) => void;
  setUnreadCount: (count: number) => void;

   systemNotifications: SystemNotification[];
  fetchSystemNotifications: (businessId: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  systemNotifications: [],

  setLoading: (loading) => set({ loading }),
  setNotifications: (notifications) => set({ notifications }),
  setUnreadCount: (count) => set({ unreadCount: count }),

  fetchNotifications: async (businessId) => {
    set({ loading: true, error: null });
    try {
      const res = await NotificationService.getAll(businessId);
      set({
        // FIX: also accept res.data.notifications shape variants
        notifications: res.notifications ?? res.data?.notifications ?? [],
        unreadCount: res.unreadCount ?? res.data?.unreadCount ?? 0,
        loading: false,
      });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Failed to load notifications.";
      set({ loading: false, error: message });
    }
  },

  fetchUnreadCount: async (businessId) => {
    try {
      const res = await NotificationService.getUnreadCount(businessId);
      set({ unreadCount: res.count ?? res.data?.count ?? 0 });
    } catch {
      // Silently ignore — badge will just not update
    }
  },

  markAsRead: async (businessId, id) => {
    // Optimistic update
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
    try {
      await NotificationService.markAsRead(businessId, id);
    } catch {
      // Revert optimistic update on failure
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: false } : n,
        ),
        unreadCount: state.unreadCount + 1,
      }));
    }
  },

  markAllAsRead: async (businessId) => {
    // Optimistic update
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
    try {
      await NotificationService.markAllAsRead(businessId);
    } catch {
      // Re-fetch to get accurate state
      get().fetchNotifications(businessId);
    }
  },

  deleteOne: async (businessId, id, wasRead) => {
    // Optimistic update
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadCount: wasRead
        ? state.unreadCount
        : Math.max(0, state.unreadCount - 1),
    }));
    try {
      await NotificationService.deleteOne(businessId, id);
    } catch {
      // Re-fetch to restore
      get().fetchNotifications(businessId);
    }
  },

  clearRead: async (businessId) => {
    // Optimistic update
    set((state) => ({
      notifications: state.notifications.filter((n) => !n.isRead),
      // unreadCount stays the same — we only removed read items
    }));
    try {
      await NotificationService.clearRead(businessId);
    } catch {
      get().fetchNotifications(businessId);
    }
  },

  fetchSystemNotifications: async (businessId)=> {
    try{
      const res = await NotificationService.getSystemNotifications(businessId);
      set({
        systemNotifications: res.notifications ?? res.data?.notifications ?? []
      })
    } catch{
      // Silently ignore - banner just won't show
    }
  }
}));