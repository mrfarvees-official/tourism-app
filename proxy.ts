import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN = process.env.PLATFORM_ROOT_DOMAIN || "";

function getHostname(req: NextRequest) {
  const host =
    req.headers.get("x-forwarded-host") ??
    req.headers.get("host") ??
    "";
  return host.toLowerCase().split(":")[0];
}

function extractSubdomain(hostname: string) {
  const suffix = "." + ROOT_DOMAIN;
  if (!ROOT_DOMAIN) return null;
  if (!hostname.endsWith(suffix)) return null;

  const sub = hostname.slice(0, -suffix.length);
  if (!sub || sub === "www") return null;
  if (!/^[a-z0-9-]+$/.test(sub)) return null;
  return sub;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

export function proxy(req: NextRequest) {
  if (!ROOT_DOMAIN) return NextResponse.next();

  const hostname = getHostname(req);
  const url = req.nextUrl;

  if (url.pathname.startsWith("/_sites/")) return NextResponse.next();

  const tenant = extractSubdomain(hostname);
  if (!tenant) return NextResponse.next();

  url.pathname = `/_sites/${tenant}${url.pathname}`;
  return NextResponse.rewrite(url);
}
