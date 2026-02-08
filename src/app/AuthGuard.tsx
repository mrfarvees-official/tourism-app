"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({
  tenant,
  children,
}: {
  tenant: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

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

    if (isUnauthed && pathname.toLowerCase() !== "/signin") {
      router.replace(`/SignIn?next=${encodeURIComponent(`/${tenant}`)}`);
    }
  }, [isChecking, isUnauthed, pathname, router, tenant]);

  if (isChecking) return null;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
