import { http } from "../config/http";

export const reviewService = {
  listPublic: (tenantKey: string) => http.get(`/api/public/${tenantKey}/reviews`),
  createCustomer: (payload: unknown) => http.post("/api/customer/reviews", payload),
  listCustomer: () => http.get("/api/customer/reviews"),
  listAdmin: (tenantKey: string) => http.get("/api/admin/reviews", { params: { tenantKey } }),
  showCustomer: (reviewId: string | number) => http.get(`/api/customer/reviews/${reviewId}`),
  showAdmin: (tenantKey: string, reviewId: string | number) =>
    http.get(`/api/admin/reviews/${reviewId}`, { params: { tenantKey } }),
  updateAdmin: (tenantKey: string, reviewId: string | number, payload: unknown) =>
    http.patch(`/api/admin/reviews/${reviewId}`, payload, { params: { tenantKey } }),
};
