import { csrf, http } from "../../config/http";

export type ContactSettingsPayload = {
  tenantKey: string;
  email: string;
  google_app_key: string;
  reply_to_email?: string;
  sender_name?: string;
  payment_provider?: string;
  payment_business_email?: string;
  payment_client_id?: string;
  payment_client_secret?: string;
  payment_currency?: string;
  payment_brand_name?: string;
  payment_partial_amount?: string;
  payment_note?: string;
};

export type ContactInquiryCustomer = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  [key: string]: unknown;
};

export type ContactInquiryPayload = {
  tenantKey: string;
  pageSlug?: string;
  source?: string;
  customer?: ContactInquiryCustomer;
  [key: string]: unknown;
};

export type CustomerIntakeInvitePayload = {
  token: string;
  intakeLink: string;
};

export const getContactSettings = async (tenantKey: string) => {
  return http.get(`api/company/bootstrap/contact-settings?tenantKey=${encodeURIComponent(tenantKey)}`);
};

export const updateContactSettings = async (payload: ContactSettingsPayload) => {
  await csrf();
  return http.patch("api/company/bootstrap/contact-settings", payload);
};

function asString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  return value as Record<string, unknown>;
}

export function buildContactInquiryPayload(
  tenantKey: string,
  payload: Record<string, unknown>,
  options?: { pageSlug?: string; source?: string },
): ContactInquiryPayload {
  const customer = asRecord(payload.customer) ?? asRecord(payload.contact) ?? {};
  const mergedCustomer: ContactInquiryCustomer = {
    ...customer,
    name: asString(customer.name ?? payload.name),
    email: asString(customer.email ?? payload.email),
    phone: asString(customer.phone ?? payload.phone),
    subject: asString(customer.subject ?? payload.subject),
    message: asString(customer.message ?? payload.message),
  };

  return {
    tenantKey,
    pageSlug: options?.pageSlug ?? asString(payload.pageSlug),
    source: options?.source ?? asString(payload.source) ?? "website-contact-form",
    ...payload,
    tenant_key: tenantKey,
    customer: mergedCustomer,
  };
}

export const sendContactInquiry = async (
  tenantKey: string,
  payload: Record<string, unknown>,
) => {
  return http.post(`api/live/${encodeURIComponent(tenantKey)}/contact`, payload);
};

export const sendCustomerIntakeInvite = async (
  tenantKey: string,
  payload: CustomerIntakeInvitePayload,
) => {
  return http.post(`api/live/${encodeURIComponent(tenantKey)}/customer-intake/send`, payload);
};
