const INTERNAL_SITE_SEGMENTS = new Set(["_sites", "%5Fsites"]);
const RESERVED_HOST_PREFIXES = new Set(["www", "api"]);

function getHostname() {
  if (typeof window === "undefined") return "";
  return window.location.hostname.toLowerCase();
}

function getConfiguredRootDomain() {
  return (
    process.env.NEXT_PUBLIC_ROOT_DOMAIN || process.env.PLATFORM_ROOT_DOMAIN || ""
  )
    .toLowerCase()
    .trim();
}

export function isTenantSubdomain(hostname: string) {
  const configuredRoot = getConfiguredRootDomain();

  if (!configuredRoot || !hostname.endsWith(`.${configuredRoot}`)) return false;

  const subdomain = hostname.slice(0, -(configuredRoot.length + 1));
  return Boolean(subdomain) && !RESERVED_HOST_PREFIXES.has(subdomain);
}

export function isTenantSiteLocation(routeSegments: string[] = []) {
  const firstSegment = routeSegments[0]?.toLowerCase();
  if (INTERNAL_SITE_SEGMENTS.has(firstSegment ?? "") || firstSegment === "sites") {
    return true;
  }

  return isTenantSubdomain(getHostname());
}

export function getTenantBasePath(tenantKey: string | null | undefined) {
  if (!tenantKey) return "";
  if (typeof window === "undefined") return `/sites/${tenantKey}`;

  const parts = window.location.pathname.split("/").filter(Boolean);
  const first = parts[0]?.toLowerCase();
  const second = parts[1]?.toLowerCase();

  if ((first === "sites" || first === "_sites" || first === "%5fsites") && second === tenantKey.toLowerCase()) {
    return `/sites/${tenantKey}`;
  }

  // On the bare root host, a tenant-aware renderer still needs to keep
  // navigation inside /sites/<tenant>. Tenant subdomains can use clean paths.
  const hostname = getHostname();
  if (hostname && !isTenantSubdomain(hostname) && !hostname.startsWith("api.")) {
    return `/sites/${tenantKey}`;
  }

  return "";
}

export function prefixTenantBasePath(basePath: string, href: string) {
  if (!basePath) return href;

  if (
    /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(href) ||
    href.startsWith("/api/") ||
    href.startsWith("/_next/") ||
    href.startsWith("/sites/") ||
    href.startsWith("/_sites/")
  ) {
    return href;
  }

  const normalizedHref = href.startsWith("/") ? href : `/${href}`;
  return `${basePath}${normalizedHref}`;
}
