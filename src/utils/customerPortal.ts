type CustomerPortalSessionInput = {
  tenantKey: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  partialPaymentAmount?: string;
  currency?: string;
  brandName?: string;
  note?: string;
  prefill?: {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
  };
  createdAt?: string;
  expiresAt?: string;
  sessionId?: string;
};

export type CustomerPortalSession = Required<Pick<CustomerPortalSessionInput, "tenantKey">> & {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  partialPaymentAmount?: string;
  currency: string;
  brandName?: string;
  note?: string;
  prefill?: {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
  };
  createdAt: string;
  expiresAt: string;
  sessionId: string;
};

const DEFAULT_CURRENCY = "LKR";
const DEFAULT_TTL_HOURS = 24;

function padBase64(input: string) {
  return input + "=".repeat((4 - (input.length % 4)) % 4);
}

function encodeBase64Url(value: string) {
  if (typeof window !== "undefined" && typeof window.btoa === "function") {
    return window
      .btoa(unescape(encodeURIComponent(value)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }

  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "utf8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }

  throw new Error("Base64 encoding is not available in this environment.");
}

function decodeBase64Url(value: string) {
  const normalized = padBase64(value.replace(/-/g, "+").replace(/_/g, "/"));

  if (typeof window !== "undefined" && typeof window.atob === "function") {
    return decodeURIComponent(
      Array.from(window.atob(normalized))
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    );
  }

  if (typeof Buffer !== "undefined") {
    return Buffer.from(normalized, "base64").toString("utf8");
  }

  throw new Error("Base64 decoding is not available in this environment.");
}

export function getCustomerPortalExpiryIso(hours = DEFAULT_TTL_HOURS) {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

export function createCustomerPortalSession(input: CustomerPortalSessionInput): CustomerPortalSession {
  const createdAt = input.createdAt ?? new Date().toISOString();
  const expiresAt = input.expiresAt ?? getCustomerPortalExpiryIso();
  const sessionId = input.sessionId ?? `session_${Math.random().toString(36).slice(2, 10)}`;

  return {
    tenantKey: input.tenantKey.trim(),
    customerName: input.customerName?.trim() || undefined,
    customerEmail: input.customerEmail?.trim() || undefined,
    customerPhone: input.customerPhone?.trim() || undefined,
    partialPaymentAmount: input.partialPaymentAmount?.trim() || undefined,
    currency: input.currency?.trim() || DEFAULT_CURRENCY,
    brandName: input.brandName?.trim() || undefined,
    note: input.note?.trim() || undefined,
    prefill: input.prefill
      ? {
          name: input.prefill.name?.trim() || undefined,
          email: input.prefill.email?.trim() || undefined,
          phone: input.prefill.phone?.trim() || undefined,
          subject: input.prefill.subject?.trim() || undefined,
          message: input.prefill.message?.trim() || undefined,
        }
      : undefined,
    createdAt,
    expiresAt,
    sessionId,
  };
}

export function encodeCustomerPortalSession(session: CustomerPortalSession) {
  return encodeBase64Url(JSON.stringify(session));
}

export function decodeCustomerPortalSession(token?: string | null): CustomerPortalSession | null {
  if (!token?.trim()) return null;

  try {
    const payload = JSON.parse(decodeBase64Url(token.trim())) as Partial<CustomerPortalSession>;
    if (!payload?.tenantKey || !payload?.expiresAt || !payload?.sessionId) {
      return null;
    }

    return createCustomerPortalSession({
      tenantKey: payload.tenantKey,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      partialPaymentAmount: payload.partialPaymentAmount,
      currency: payload.currency,
      brandName: payload.brandName,
      note: payload.note,
      prefill: payload.prefill,
      createdAt: payload.createdAt,
      expiresAt: payload.expiresAt,
      sessionId: payload.sessionId,
    });
  } catch {
    return null;
  }
}

export function isCustomerPortalSessionExpired(session?: CustomerPortalSession | null) {
  if (!session) return true;

  const expiry = new Date(session.expiresAt);
  if (Number.isNaN(expiry.getTime())) return true;

  return expiry.getTime() <= Date.now();
}

export function buildPublicTenantUrl(tenantKey: string, path: string, params?: Record<string, string>) {
  const query = new URLSearchParams(params);
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const suffix = query.toString() ? `${cleanPath}?${query.toString()}` : cleanPath;

  if (typeof window === "undefined") {
    return suffix;
  }

  const rootDomain = (
    process.env.NEXT_PUBLIC_ROOT_DOMAIN ||
    process.env.PLATFORM_ROOT_DOMAIN ||
    ""
  )
    .toLowerCase()
    .trim();
  const appPort = (process.env.NEXT_PUBLIC_APP_PORT || "").trim();

  if (!rootDomain) {
    return `${window.location.origin}${suffix}`;
  }

  const reserved = new Set(["www", "api"]);
  if (reserved.has(tenantKey.toLowerCase())) {
    return `${window.location.origin}${suffix}`;
  }

  const portPart = appPort ? `:${appPort}` : window.location.port ? `:${window.location.port}` : "";
  return `${window.location.protocol}//${tenantKey}.${rootDomain}${portPart}${suffix}`;
}

export function buildCustomerIntakeLink(tenantKey: string, token: string) {
  return buildPublicTenantUrl(tenantKey, "/customer-intake", { token });
}

export function buildMailtoDraft(options: {
  to: string;
  subject: string;
  body: string;
}) {
  return `mailto:${encodeURIComponent(options.to)}?subject=${encodeURIComponent(
    options.subject,
  )}&body=${encodeURIComponent(options.body)}`;
}

export function buildPayPalSandboxUrl(options: {
  businessEmail: string;
  amount: string;
  currency?: string;
  itemName: string;
  returnUrl?: string;
  cancelUrl?: string;
  custom?: string;
}) {
  const params = new URLSearchParams({
    cmd: "_xclick",
    business: options.businessEmail,
    item_name: options.itemName,
    amount: options.amount,
    currency_code: options.currency?.trim() || DEFAULT_CURRENCY,
  });

  if (options.returnUrl) params.set("return", options.returnUrl);
  if (options.cancelUrl) params.set("cancel_return", options.cancelUrl);
  if (options.custom) params.set("custom", options.custom);

  return `https://www.sandbox.paypal.com/cgi-bin/webscr?${params.toString()}`;
}
