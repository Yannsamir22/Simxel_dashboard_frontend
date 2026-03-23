import { axiosInstance } from "../api/api";

const BASE = "/businesses/:businessId/packages";

export class PackageService {
  static fetchPackages = () => axiosInstance.get(BASE).then((r) => r.data);

  static getPackageById = (id: string) =>
    axiosInstance.get(`${BASE}/${id}`).then((r) => r.data);

  static createPackage = (data: {
    name: string;
    price: number;
    serviceIds: string[];
  }) => axiosInstance.post(BASE, data).then((r) => r.data);

  static updatePackage = (
    id: string,
    data: { name?: string; price?: number; serviceIds?: string[] },
  ) => axiosInstance.put(`${BASE}/${id}`, data).then((r) => r.data);

  static deletePackage = (id: string) =>
    axiosInstance.delete(`${BASE}/${id}`).then((r) => r.data);
}
