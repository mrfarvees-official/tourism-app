import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const originalEnv = {
  NEXT_PUBLIC_ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
  NEXT_PUBLIC_APP_PORT: process.env.NEXT_PUBLIC_APP_PORT,
  NEXT_PUBLIC_RESERVED_SUBDOMAINS: process.env.NEXT_PUBLIC_RESERVED_SUBDOMAINS,
};

async function loadPortalModule(env?: Record<string, string | undefined>) {
  vi.resetModules();

  process.env.NEXT_PUBLIC_ROOT_DOMAIN = env?.NEXT_PUBLIC_ROOT_DOMAIN;
  process.env.NEXT_PUBLIC_APP_PORT = env?.NEXT_PUBLIC_APP_PORT;
  process.env.NEXT_PUBLIC_RESERVED_SUBDOMAINS = env?.NEXT_PUBLIC_RESERVED_SUBDOMAINS;

  return import("../src/utils/customerPortal");
}

describe("customer portal utilities", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-13T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    process.env.NEXT_PUBLIC_ROOT_DOMAIN = originalEnv.NEXT_PUBLIC_ROOT_DOMAIN;
    process.env.NEXT_PUBLIC_APP_PORT = originalEnv.NEXT_PUBLIC_APP_PORT;
    process.env.NEXT_PUBLIC_RESERVED_SUBDOMAINS = originalEnv.NEXT_PUBLIC_RESERVED_SUBDOMAINS;
    vi.restoreAllMocks();
  });

  it("creates a normalized session with defaults and trimmed values", async () => {
    const { createCustomerPortalSession } = await loadPortalModule();
    const session = createCustomerPortalSession({
      tenantKey: "  lanka-trails  ",
      customerName: "  Asha  ",
      customerEmail: "  ash@example.com ",
      partialPaymentAmount: " 1500 ",
      prefill: {
        name: "  Asha ",
        subject: "  Inquiry ",
      },
    });

    expect(session.tenantKey).toBe("lanka-trails");
    expect(session.customerName).toBe("Asha");
    expect(session.customerEmail).toBe("ash@example.com");
    expect(session.partialPaymentAmount).toBe("1500");
    expect(session.currency).toBe("LKR");
    expect(session.prefill).toEqual({
      name: "Asha",
      email: undefined,
      phone: undefined,
      subject: "Inquiry",
      message: undefined,
    });
    expect(session.sessionId).toMatch(/^session_/);
  });

  it("round-trips a session through base64url encoding", async () => {
    const { createCustomerPortalSession, encodeCustomerPortalSession, decodeCustomerPortalSession } =
      await loadPortalModule();

    vi.spyOn(Math, "random").mockReturnValue(0.12345678);

    const session = createCustomerPortalSession({
      tenantKey: "  hill-country  ",
      customerName: "Mila",
      currency: "USD",
      sessionId: "session_fixed",
    });

    const token = encodeCustomerPortalSession(session);
    const decoded = decodeCustomerPortalSession(token);

    expect(decoded).toEqual(session);
    expect(decoded?.currency).toBe("USD");
  });

  it("returns null for an invalid customer portal token", async () => {
    const { decodeCustomerPortalSession } = await loadPortalModule();

    expect(decodeCustomerPortalSession("not-a-token")).toBeNull();
    expect(decodeCustomerPortalSession("")).toBeNull();
    expect(decodeCustomerPortalSession(null)).toBeNull();
  });

  it("flags expired and valid sessions correctly", async () => {
    const { createCustomerPortalSession, isCustomerPortalSessionExpired } = await loadPortalModule();

    const active = createCustomerPortalSession({
      tenantKey: "lanka-trails",
      expiresAt: "2026-07-14T00:00:00.000Z",
      sessionId: "session_active",
    });
    const expired = createCustomerPortalSession({
      tenantKey: "lanka-trails",
      expiresAt: "2026-07-12T23:59:59.000Z",
      sessionId: "session_expired",
    });

    expect(isCustomerPortalSessionExpired(active)).toBe(false);
    expect(isCustomerPortalSessionExpired(expired)).toBe(true);
    expect(isCustomerPortalSessionExpired(undefined)).toBe(true);
  });

  it("builds a local customer intake link when subdomain routing is disabled", async () => {
    const { buildCustomerIntakeLink } = await loadPortalModule({
      NEXT_PUBLIC_ROOT_DOMAIN: "",
      NEXT_PUBLIC_APP_PORT: "",
    });

    expect(buildCustomerIntakeLink("lanka-trails", "abc123")).toBe(
      `${window.location.origin}/_sites/lanka-trails/customer-intake?token=abc123`,
    );
  });

  it("builds a tenant subdomain url when subdomain routing is enabled", async () => {
    const { buildPublicTenantUrl } = await loadPortalModule({
      NEXT_PUBLIC_ROOT_DOMAIN: "example.com",
      NEXT_PUBLIC_APP_PORT: "3001",
    });

    expect(buildPublicTenantUrl("lanka-trails", "/customer-intake", { token: "abc123" })).toBe(
      "http://lanka-trails.example.com:3001/customer-intake?token=abc123",
    );
  });

  it("falls back to the base origin for reserved tenant names", async () => {
    const { buildPublicTenantUrl } = await loadPortalModule({
      NEXT_PUBLIC_ROOT_DOMAIN: "example.com",
      NEXT_PUBLIC_APP_PORT: "3001",
    });

    expect(buildPublicTenantUrl("api", "/customer-intake", { token: "abc123" })).toBe(
      `${window.location.origin}/customer-intake?token=abc123`,
    );
  });

  it("builds a mailto draft with encoded content", async () => {
    const { buildMailtoDraft } = await loadPortalModule();

    expect(
      buildMailtoDraft({
        to: "hello@travel.example",
        subject: "Trip plan",
        body: "Line 1\nLine 2",
      }),
    ).toBe("mailto:hello%40travel.example?subject=Trip%20plan&body=Line%201%0ALine%202");
  });

  it("builds a PayPal sandbox url with default currency and optional fields", async () => {
    const { buildPayPalSandboxUrl } = await loadPortalModule();

    const url = buildPayPalSandboxUrl({
      businessEmail: "sales@travel.example",
      amount: "1500",
      itemName: "Airport transfer",
      returnUrl: "https://example.com/return",
      cancelUrl: "https://example.com/cancel",
      custom: "order-1",
    });

    expect(url).toContain("https://www.sandbox.paypal.com/cgi-bin/webscr?");
    expect(url).toContain("business=sales%40travel.example");
    expect(url).toContain("currency_code=LKR");
    expect(url).toContain("return=https%3A%2F%2Fexample.com%2Freturn");
    expect(url).toContain("cancel_return=https%3A%2F%2Fexample.com%2Fcancel");
    expect(url).toContain("custom=order-1");
  });

  it("calculates the default expiry window in hours", async () => {
    const { getCustomerPortalExpiryIso } = await loadPortalModule();

    expect(getCustomerPortalExpiryIso()).toBe("2026-07-14T00:00:00.000Z");
    expect(getCustomerPortalExpiryIso(2)).toBe("2026-07-13T02:00:00.000Z");
  });
});
