import { http } from "../config/http";

export const paymentService = {
  createIntakePayment: (tenantKey: string, payload: unknown) =>
    http.post(`/api/public/${tenantKey}/payments/intake`, payload),
  settleBookingPayment: (tenantKey: string, bookingId: string | number, payload: unknown) =>
    http.post(`/api/customer/bookings/${bookingId}/payments`, { tenantKey, ...payload }),
  listCustomer: () => http.get("/api/customer/payments"),
  listAdmin: (tenantKey: string) => http.get("/api/admin/payments", { params: { tenantKey } }),
};
