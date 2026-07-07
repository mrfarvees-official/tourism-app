import { http } from "../config/http";

export const adminBusinessDashboardService = {
  get: (tenantKey: string) =>
    http.get("/api/admin/business-dashboard", {
      params: { tenantKey },
    }),
};
