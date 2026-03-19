export type TenantKey = string;

const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "")
  .toLowerCase()
  .trim();

const APP_PORT = (process.env.NEXT_PUBLIC_APP_PORT || "").trim();

const RESERVED = new Set(
  (process.env.NEXT_PUBLIC_RESERVED_SUBDOMAINS || "www,api")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
);

function getTenantKey(user: any): TenantKey | null {
  const key =
    user?.tenants?.[0]?.key ??
    user?.tenant_key ??
    user?.tenantKey ??
    user?.tenant?.key ??
    user?.tenant?.slug;

  return typeof key === "string" && key.trim().length ? key.trim() : null;
}

function isCustomer(user: any): boolean {
  const tenants = Array.isArray(user?.tenants) ? user.tenants : [];
  return tenants.some(
    (t: any) =>
      (t?.status ?? "").toLowerCase() === "active" &&
      (t?.role ?? "").toLowerCase() === "customer"
  );
}

function getSubdomain(hostname: string) {
  if (!ROOT_DOMAIN) return null;

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
  if (!ROOT_DOMAIN) return false;

  const host = window.location.hostname.toLowerCase();
  return host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}`;
}

export function redirectToTenantIfNeeded(user: any, path = "/") {
  if (typeof window === "undefined") return;
  if (!ROOT_DOMAIN) return;

  const hostname = window.location.hostname.toLowerCase();
  const sub = getSubdomain(hostname);
  const tenantKey = getTenantKey(user);
  const currentPath = window.location.pathname;

  // allow admin pages to stay
  if (currentPath.startsWith("/admin")) return;

  // allow designer tenant pages to stay
  if (currentPath.startsWith("/designer/")) return;

  // non-customer/admin/owner -> base admin
  if (!isCustomer(user)) {
    const adminPath = tenantKey ? `/admin/${tenantKey}` : "/admin";
    const adminTarget = `${window.location.protocol}//${ROOT_DOMAIN}${portPart()}${adminPath}`;

    if (window.location.href !== adminTarget) {
      window.location.replace(adminTarget);
    }
    return;
  }

  // customer with no tenant -> base admin
  if (!tenantKey) {
    const adminTarget = `${window.location.protocol}//${ROOT_DOMAIN}${portPart()}/admin`;

    if (window.location.href !== adminTarget) {
      window.location.replace(adminTarget);
    }
    return;
  }

  // already on tenant subdomain, stay there
  if (sub) return;

  // only redirect from base host
  if (!isBaseHost()) return;

  if (RESERVED.has(tenantKey.toLowerCase())) return;

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const target = `${window.location.protocol}//${tenantKey}.${ROOT_DOMAIN}${portPart()}${cleanPath}`;

  if (window.location.href !== target) {
    window.location.replace(target);
  }
}

export function redirectToBase(path = "/") {
  if (typeof window === "undefined") return;
  if (!ROOT_DOMAIN) return;

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const target = `${window.location.protocol}//${ROOT_DOMAIN}${portPart()}${cleanPath}`;

  if (window.location.href !== target) {
    window.location.replace(target);
  }
}