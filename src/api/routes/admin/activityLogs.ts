import { http } from "../../config/http";

export const getTenantActivityLogs = async (
  tenantKey: string,
  params?: { page?: number; per_page?: number },
) => {
  return http.get("api/admin/activity-logs", {
    params: {
      tenantKey,
      ...params,
    },
  });
};
