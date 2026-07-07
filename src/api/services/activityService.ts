import { http } from "../config/http";

export const activityService = {
  list: (tenantKey: string) => http.get(`/api/public/${tenantKey}/activities`),
  show: (tenantKey: string, slug: string) =>
    http.get(`/api/public/${tenantKey}/activities/${slug}`),
};
