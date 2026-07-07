import { http } from "../config/http";

export const accommodationService = {
  list: (tenantKey: string) => http.get("/api/admin/accommodations", { params: { tenantKey } }),
  show: (tenantKey: string, id: string | number) =>
    http.get(`/api/admin/accommodations/${id}`, { params: { tenantKey } }),
};
