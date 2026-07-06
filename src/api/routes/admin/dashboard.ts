import { http } from "../../config/http";

export const getTenantDashboard = async (tenantKey: string) => {
  return http.get("api/tenant/dashboard", {
    params: { tenantKey },
  });
};
