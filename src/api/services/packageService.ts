import { http } from "../config/http";

export const packageService = {
  list: (tenantKey: string) => http.get(`/api/public/${tenantKey}/packages`),
  show: (tenantKey: string, slug: string) =>
    http.get(`/api/public/${tenantKey}/packages/${slug}`),
};
