import { http } from "../config/http";

export const inquiryService = {
  createPublic: (tenantKey: string, payload: unknown) =>
    http.post(`/api/public/${tenantKey}/inquiries`, payload),
  listAdmin: (tenantKey: string) =>
    http.get("/api/admin/inquiries", { params: { tenantKey } }),
  showAdmin: (tenantKey: string, inquiryId: string | number) =>
    http.get(`/api/admin/inquiries/${inquiryId}`, { params: { tenantKey } }),
};
