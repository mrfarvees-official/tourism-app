import { http } from "../config/http";

export const destinationService = {
  list: (tenantKey: string) => http.get(`/api/public/${tenantKey}/destinations`),
  show: (tenantKey: string, slug: string) =>
    http.get(`/api/public/${tenantKey}/destinations/${slug}`),
};
