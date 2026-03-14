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

// owner check (based on your JSON shape)
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
  const suffix = "." + ROOT_DOMAIN;
  if (!hostname.endsWith(suffix)) return null;
  const sub = hostname.slice(0, -suffix.length);
  return sub || null;
}

function portPart() {
  const p = APP_PORT || window.location.port;
  return p ? `:${p}` : "";
}

export function isBaseHost() {
  if (typeof window === "undefined") return false;
  if (!ROOT_DOMAIN) return false;

  return window.location.hostname.toLowerCase() === ROOT_DOMAIN;
}

export function redirectToTenantIfNeeded(user: any, path = "/") {
  if (typeof window === "undefined") return;
  if (!ROOT_DOMAIN) return;

  const hostname = window.location.hostname.toLowerCase();
  const sub = getSubdomain(hostname);

  const tenantKey = getTenantKey(user);

  // IMPORTANT: if you're already on /admin (or /admin), don't redirect to tenant site
  const currentPath = window.location.pathname;
  if (currentPath.startsWith("/admin")) {
    return;
  }

  // Build per-tenant admin path (choose ONE that matches your folder: /admin)
  const adminPath = tenantKey ? `/admin/${tenantKey}` : "/admin"; // or `/admin/${tenantKey}`

  // RULE 1: Owners go to base /admin/<tenantKey>
  if (!isCustomer(user)) {
    // If no tenant key, just go base /admin (or your fallback)
    const adminTarget = `${window.location.protocol}//${ROOT_DOMAIN}${portPart()}${adminPath}`;
    if (window.location.href !== adminTarget) window.location.replace(adminTarget);
    return;
  }

  // RULE 2: Not a customer (no tenantKey) => base /admin (or tenant picker)
  if (!tenantKey) {
    const adminTarget = `${window.location.protocol}//${ROOT_DOMAIN}${portPart()}/admin`;
    if (window.location.href !== adminTarget) window.location.replace(adminTarget);
    return;
  }

  // Existing behavior: only redirect from base host -> tenant site
  if (sub && sub.length) return;
  if (!isBaseHost()) return;

  if (RESERVED.has(tenantKey.toLowerCase())) return;

  const target = `${window.location.protocol}//${tenantKey}.${ROOT_DOMAIN}${portPart()}${path}`;

  if (window.location.href !== target) {
    window.location.replace(target);
  }
}

export function redirectToBase(path = "/") {
  if (typeof window === "undefined") return;
  if (!ROOT_DOMAIN) return;

  const target = `${window.location.protocol}//${ROOT_DOMAIN}${portPart()}${path}`;
  if (window.location.href !== target) window.location.replace(target);
}
