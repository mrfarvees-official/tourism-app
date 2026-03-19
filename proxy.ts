// proxy.ts
import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN = (process.env.ROOT_DOMAIN || "").toLowerCase().trim();
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
  rewriteUrl.pathname = `/_sites/${tenant}${pathname === "/" ? "" : pathname}`;

  return NextResponse.rewrite(rewriteUrl);
}