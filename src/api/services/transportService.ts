import { http } from "../config/http";

export const transportService = {
  list: (tenantKey: string) => http.get("/api/admin/transport-options", { params: { tenantKey } }),
  show: (tenantKey: string, id: string | number) =>
    http.get(`/api/admin/transport-options/${id}`, { params: { tenantKey } }),
};
