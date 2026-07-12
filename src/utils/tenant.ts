export type TenantKey = string;

type TenantLike = {
  key?: string;
  role?: string;
  slug?: string;
  status?: string;
};

type UserLike = {
  tenant?: TenantLike;
  tenantKey?: string;
  tenant_key?: string;
  tenants?: TenantLike[];
};

const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "")
  .toLowerCase()
  .trim();

const APP_PORT = (process.env.NEXT_PUBLIC_APP_PORT || "").trim();

function isIpLikeHost(value: string) {
  return (
    /^(\d{1,3}\.){3}\d{1,3}$/.test(value) ||
    /^[0-9a-f:]+$/i.test(value) ||
    value.includes(":")
  );
}

export const USE_SUBDOMAIN_ROUTING = Boolean(ROOT_DOMAIN) && !isIpLikeHost(ROOT_DOMAIN);

const RESERVED = new Set(
  (process.env.NEXT_PUBLIC_RESERVED_SUBDOMAINS || "www,api")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
);

function getTenantKey(user: UserLike | null | undefined): TenantKey | null {
  const key =
    user?.tenants?.[0]?.key ??
    user?.tenant_key ??
    user?.tenantKey ??
    user?.tenant?.key ??
    user?.tenant?.slug;

  return typeof key === "string" && key.trim().length ? key.trim() : null;
}

export function isCustomer(user: UserLike | null | undefined): boolean {
  const tenants = Array.isArray(user?.tenants) ? user.tenants : [];
  return tenants.some(
    (t) =>
      (t?.status ?? "").toLowerCase() === "active" &&
      (t?.role ?? "").toLowerCase() === "customer"
  );
}

export function hasAdminAccess(user: UserLike | null | undefined): boolean {
  const tenants = Array.isArray(user?.tenants) ? user.tenants : [];
  return tenants.some(
    (t) =>
      (t?.status ?? "").toLowerCase() === "active" &&
      (t?.role ?? "").toLowerCase() !== "customer"
  );
}

function getCustomerDashboardTarget() {
  if (!USE_SUBDOMAIN_ROUTING) {
    return `${window.location.origin}/customer/dashboard`;
  }

  return `${window.location.protocol}//${ROOT_DOMAIN}${portPart()}/customer/dashboard`;
}

function getSubdomain(hostname: string) {
  if (!USE_SUBDOMAIN_ROUTING) return null;

  if (hostname === ROOT_DOMAIN) return null;

  const suffix = "." + ROOT_DOMAIN;
  if (!hostname.endsWith(suffix)) return null;

  const sub = hostname.slice(0, -suffix.length).toLowerCase();
  if (!sub) return null;
  if (RESERVED.has(sub)) return null;

  return sub;
}

function portPart() {
  if (typeof window === "undefined") return APP_PORT ? `:${APP_PORT}` : "";
  const p = APP_PORT || window.location.port;
  return p ? `:${p}` : "";
}

export function isBaseHost() {
  if (typeof window === "undefined") return false;
  if (!ROOT_DOMAIN || !USE_SUBDOMAIN_ROUTING) return true;

  const host = window.location.hostname.toLowerCase();
  return host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}`;
}

export function redirectToTenantIfNeeded(user: UserLike | null | undefined, path = "/") {
  if (typeof window === "undefined") return;
  const tenantKey = getTenantKey(user);
  const currentPath = window.location.pathname;
  const canAccessAdmin = hasAdminAccess(user);
  const isAdminPath = currentPath.startsWith("/admin");
  const isTenantPath = currentPath.startsWith("/_sites/");

  // allow designer tenant pages to stay
  if (currentPath.startsWith("/designer/")) return;

  if (isAdminPath && !canAccessAdmin) {
    const customerTarget = getCustomerDashboardTarget();

    if (window.location.href !== customerTarget) {
      window.location.replace(customerTarget);
    }
    return;
  }

  // privileged users stay on admin routes
  if (isAdminPath) return;

  // non-customer/admin/owner -> tenant site
  if (canAccessAdmin) {
    const adminPath = tenantKey ? `/admin/${tenantKey}` : "/admin";
    const adminTarget = USE_SUBDOMAIN_ROUTING
      ? `${window.location.protocol}//${ROOT_DOMAIN}${portPart()}${adminPath}`
      : `${window.location.origin}${adminPath}`;

    if (window.location.href !== adminTarget) {
      window.location.replace(adminTarget);
    }
    return;
  }

  // customer-only accounts without a tenant land on the customer dashboard
  if (!tenantKey) {
    const customerTarget = getCustomerDashboardTarget();

    if (window.location.href !== customerTarget) {
      window.location.replace(customerTarget);
    }
    return;
  }

  // already on tenant page, stay there
  if (isTenantPath) return;

  // already on tenant subdomain, stay there
  const hostname = window.location.hostname.toLowerCase();
  const sub = getSubdomain(hostname);
  if (sub) return;

  // only redirect from base host
  if (!isBaseHost()) return;

  if (RESERVED.has(tenantKey.toLowerCase())) return;

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const target = USE_SUBDOMAIN_ROUTING
    ? `${window.location.protocol}//${tenantKey}.${ROOT_DOMAIN}${portPart()}${cleanPath}`
    : `${window.location.origin}/_sites/${tenantKey}${cleanPath}`;

  if (window.location.href !== target) {
    window.location.replace(target);
  }
}

export function redirectToBase(path = "/") {
  if (typeof window === "undefined") return;

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const target = USE_SUBDOMAIN_ROUTING
    ? `${window.location.protocol}//${ROOT_DOMAIN}${portPart()}${cleanPath}`
    : `${window.location.origin}${cleanPath}`;

  if (window.location.href !== target) {
    window.location.replace(target);
  }
}
