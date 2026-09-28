import { csrf, http } from "../config/http";

export const bookingService = {
  createPublic: async (tenantKey: string, payload: Record<string, unknown>) => {
    // Laravel treats first-party API requests as stateful and validates CSRF
    // tokens on this public POST route.
    await csrf();
    return http.post(`/api/public/${encodeURIComponent(tenantKey)}/bookings`, payload);
  },
  listCustomer: () => http.get("/api/customer/bookings"),
  showCustomer: (bookingId: string | number) => http.get(`/api/customer/bookings/${bookingId}`),
  settleCustomerPayment: async (tenantKey: string, bookingId: string | number, payload: Record<string, unknown>) => {
    await csrf();
    return http.post(`/api/customer/bookings/${encodeURIComponent(bookingId)}/payments`, {
      tenantKey,
      ...payload,
    });
  },
  listAdmin: (tenantKey: string) =>
    http.get("/api/admin/bookings", { params: { tenantKey } }),
  showAdmin: (tenantKey: string, bookingId: string | number) =>
    http.get(`/api/admin/bookings/${bookingId}`, { params: { tenantKey } }),
};
