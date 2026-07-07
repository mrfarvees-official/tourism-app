import { http } from "../config/http";

type Query = Record<string, string | number | boolean | null | undefined>;

export const createResourceService = (basePath: string) => ({
  list: (params?: Query) => http.get(basePath, { params }),
  show: (slugOrId: string | number, params?: Query) =>
    http.get(`${basePath}/${slugOrId}`, { params }),
  store: (payload: unknown, params?: Query) =>
    http.post(basePath, payload, { params }),
  update: (slugOrId: string | number, payload: unknown, params?: Query) =>
    http.put(`${basePath}/${slugOrId}`, payload, { params }),
  remove: (slugOrId: string | number, params?: Query) =>
    http.delete(`${basePath}/${slugOrId}`, { params }),
});
