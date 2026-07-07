// proxy.ts
import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN = (
  process.env.ROOT_DOMAIN ||
  process.env.NEXT_PUBLIC_ROOT_DOMAIN ||
  process.env.PLATFORM_ROOT_DOMAIN ||
  ""
)
  .toLowerCase()
  .trim();
const RESERVED = new Set(
  (process.env.RESERVED_SUBDOMAINS || "www,api")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

function getHostname(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
  return host.toLowerCase().split(":")[0];
}

function extractSubdomain(hostname: string) {
  if (!ROOT_DOMAIN) return null;

  const suffix = "." + ROOT_DOMAIN;
  if (!hostname.endsWith(suffix)) return null;

  const sub = hostname.slice(0, -suffix.length);
  if (!sub || sub === "www") return null;
  if (!/^[a-z0-9-]+$/.test(sub)) return null;
  if (RESERVED.has(sub)) return null;

  return sub;
}

function normalizeTenantScopedAppPath(pathname: string, tenant: string) {
  const parts = pathname.split("/").filter(Boolean);
  const first = parts[0]?.toLowerCase();
  const second = parts[1]?.toLowerCase();

  if (first === "signin" || first === "signup") {
    return `/_sites/${tenant}/${first}`;
  }

  if (first === tenant && second === "designer") {
    return `/designer/${tenant}`;
  }

  if (first === tenant && second === "admin") {
    return `/admin/${tenant}`;
  }

  if (first === "designer") {
    return `/designer/${tenant}`;
  }

  if (first === "admin") {
    return `/admin/${tenant}`;
  }

  return null;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_sites")
  ) {
    return NextResponse.next();
  }

  if (/\.[^/]+$/.test(pathname)) {
    return NextResponse.next();
  }

  const hostname = getHostname(req);
  const tenant = extractSubdomain(hostname);

  if (!tenant) {
    return NextResponse.next();
  }

  const rewriteUrl = req.nextUrl.clone();
  const appPath = normalizeTenantScopedAppPath(pathname, tenant);

  if (appPath) {
    rewriteUrl.pathname = appPath;
    return NextResponse.rewrite(rewriteUrl);
  }

  rewriteUrl.pathname = `/_sites/${tenant}`;
  rewriteUrl.searchParams.set("path", pathname);

  return NextResponse.rewrite(rewriteUrl);
}
