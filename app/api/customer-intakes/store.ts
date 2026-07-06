import { createCustomerPortalSession, type CustomerPortalSession } from "@/src/utils/customerPortal";

export type CustomerTraveler = {
  full_name?: string;
  date_of_birth?: string;
  nationality?: string;
  passport_number?: string;
  passport_expiry?: string;
  visa_type?: string;
  gender?: string;
};

export type CustomerPrimaryContact = {
  name?: string;
  email?: string;
  phone?: string;
  nationality?: string;
  passport_number?: string;
  visa_type?: string;
  notes?: string;
};

export type CustomerPortalPrefill = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
};

export type CustomerIntakeSubmission = {
  id: string;
  tenantKey: string;
  sessionId: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  primaryContact: CustomerPrimaryContact;
  travelers: CustomerTraveler[];
  partialPaymentAmount: string;
  currency: string;
  paymentUrl?: string;
  paymentStatus: "pending" | "paid" | "expired" | "not_required";
  status: "draft" | "submitted";
};

type IntakeSessionRecord = CustomerPortalSession & {
  token: string;
};

type SessionCreateInput = {
  tenantKey: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  partialPaymentAmount?: string;
  currency?: string;
  brandName?: string;
  note?: string;
  prefill?: CustomerPortalPrefill;
};

const sessions = new Map<string, IntakeSessionRecord>();
const submissionsByTenant = new Map<string, CustomerIntakeSubmission[]>();

function nextId() {
  return `ci_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

export function createIntakeSession(input: SessionCreateInput) {
  const session = createCustomerPortalSession({
    tenantKey: input.tenantKey,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    partialPaymentAmount: input.partialPaymentAmount,
    currency: input.currency,
    brandName: input.brandName,
    note: input.note,
    prefill: input.prefill,
  });

  const record: IntakeSessionRecord = {
    ...session,
    token: "",
  };

  record.token = Buffer.from(JSON.stringify(session), "utf8")
    .toString("base64url");

  sessions.set(record.token, record);

  return record;
}

export function getIntakeSession(token: string) {
  const record = sessions.get(token);
  if (!record) return null;

  const expiresAt = new Date(record.expiresAt).getTime();
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    sessions.delete(token);
    return null;
  }

  return record;
}

export function storeCustomerSubmission(payload: {
  token: string;
  primaryContact: CustomerPrimaryContact;
  travelers: CustomerTraveler[];
  paymentUrl?: string;
  paymentStatus?: CustomerIntakeSubmission["paymentStatus"];
}) {
  const session = getIntakeSession(payload.token);
  if (!session) {
    return null;
  }

  const submission: CustomerIntakeSubmission = {
    id: nextId(),
    tenantKey: session.tenantKey,
    sessionId: session.sessionId,
    token: payload.token,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    primaryContact: payload.primaryContact,
    travelers: payload.travelers,
    partialPaymentAmount: session.partialPaymentAmount ?? "",
    currency: session.currency,
    paymentUrl: payload.paymentUrl,
    paymentStatus: payload.paymentStatus ?? (payload.paymentUrl ? "pending" : "not_required"),
    status: "submitted",
  };

  const current = submissionsByTenant.get(session.tenantKey) ?? [];
  submissionsByTenant.set(session.tenantKey, [submission, ...current].slice(0, 200));

  return submission;
}

export function listCustomerSubmissions(tenantKey: string) {
  return submissionsByTenant.get(tenantKey) ?? [];
}

export function normalizeSessionForResponse(session: IntakeSessionRecord) {
  return {
    ...session,
    expires_in_minutes: Math.max(0, Math.floor((new Date(session.expiresAt).getTime() - Date.now()) / 60000)),
  };
}
