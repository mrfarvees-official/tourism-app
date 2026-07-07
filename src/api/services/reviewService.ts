import { http } from "../config/http";

export const reviewService = {
  listPublic: (tenantKey: string) => http.get(`/api/public/${tenantKey}/reviews`),
  createCustomer: (payload: unknown) => http.post("/api/customer/reviews", payload),
  listCustomer: () => http.get("/api/customer/reviews"),
  listAdmin: (tenantKey: string) => http.get("/api/admin/reviews", { params: { tenantKey } }),
};
