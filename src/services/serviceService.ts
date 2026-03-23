import { axiosInstance } from "../api/api";

const BASE = "/businesses/:businessId/services";

export class ServiceService {
  static fetchServices = () => axiosInstance.get(BASE).then((r) => r.data);

  static getServiceById = (id: string) =>
    axiosInstance.get(`${BASE}/${id}`).then((r) => r.data);

  static createService = (data: { name: string; price: number }) =>
    axiosInstance.post(BASE, data).then((r) => r.data);

  static updateService = (
    id: string,
    data: { name?: string; price?: number },
  ) => axiosInstance.put(`${BASE}/${id}`, data).then((r) => r.data);

  static deleteService = (id: string) =>
    axiosInstance.delete(`${BASE}/${id}`).then((r) => r.data);
}
