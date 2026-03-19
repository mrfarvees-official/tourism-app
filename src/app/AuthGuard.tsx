// AuthGuard.tsx
"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { isBaseHost } from "@/src/utils/tenant";

export default function AuthGuard({
  tenant,
  children,
}: {
  tenant: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = useSelector((s: any) => s.auth.authStatus) as
    | "idle"
    | "loading"
    | "authenticated"
    | "unauthenticated"
    | undefined;

  const isAuthenticated = status === "authenticated";
  const isUnauthed = status === "unauthenticated";
  const isChecking = status === "idle" || status === "loading" || !status;

  useEffect(() => {
    if (isChecking) return;

    const isTenantSubdomain = typeof window !== "undefined" && !isBaseHost();

    // allow unauthenticated tenant homepage
    if (isUnauthed && isTenantSubdomain && pathname === "/") {
      return;
    }

    if (isUnauthed && pathname.toLowerCase() !== "/signin") {
      const qs = searchParams?.toString();
      const next = qs ? `${pathname}?${qs}` : pathname;
      router.replace(`/SignIn?next=${encodeURIComponent(next)}`);
    }
  }, [isChecking, isUnauthed, pathname, router, searchParams, tenant]);

  if (isChecking) return null;

  if (isUnauthed && typeof window !== "undefined" && !isBaseHost() && pathname === "/") {
    return <>{children}</>;
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}