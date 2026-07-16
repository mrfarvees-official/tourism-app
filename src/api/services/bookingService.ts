import { http } from "../config/http";

export const bookingService = {
  createPublic: (tenantKey: string, payload: Record<string, unknown>) =>
    http.post(`/api/public/${tenantKey}/bookings`, payload),
  listCustomer: () => http.get("/api/customer/bookings"),
  showCustomer: (bookingId: string | number) => http.get(`/api/customer/bookings/${bookingId}`),
  settleCustomerPayment: (tenantKey: string, bookingId: string | number, payload: Record<string, unknown>) =>
    http.post(`/api/customer/bookings/${bookingId}/payments`, { tenantKey, ...payload }),
  listAdmin: (tenantKey: string) =>
    http.get("/api/admin/bookings", { params: { tenantKey } }),
  showAdmin: (tenantKey: string, bookingId: string | number) =>
    http.get(`/api/admin/bookings/${bookingId}`, { params: { tenantKey } }),
};
