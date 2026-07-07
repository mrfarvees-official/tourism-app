import { http } from "../config/http";

export const tourismServiceService = {
  list: (tenantKey: string) => http.get(`/api/public/${tenantKey}/services`),
  show: (tenantKey: string, slug: string) =>
    http.get(`/api/public/${tenantKey}/services/${slug}`),
};
