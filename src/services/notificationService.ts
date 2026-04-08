import { axiosInstance } from "../api/api";

const BASE = (businessId: string): string =>
  `/businesses/${businessId}/notifications`;

export const NotificationService = {
  getAll: (businessId: string, unreadOnly = false) =>
    axiosInstance
      .get(BASE(businessId), { params: unreadOnly ? { unreadOnly: true } : {} })
      .then((r) => r.data),

  getUnreadCount: (businessId: string) =>
    axiosInstance.get(`${BASE(businessId)}/unread-count`).then((r) => r.data),

  markAsRead: (businessId: string, id: string) =>
    axiosInstance.patch(`${BASE(businessId)}/${id}/read`).then((r) => r.data),

  markAllAsRead: (businessId: string) =>
    axiosInstance.patch(`${BASE(businessId)}/read-all`).then((r) => r.data),

  deleteOne: (businessId: string, id: string) =>
    axiosInstance.delete(`${BASE(businessId)}/${id}`).then((r) => r.data),

  clearRead: (businessId: string) =>
    axiosInstance.delete(`${BASE(businessId)}/clear-read`).then((r) => r.data),
};
