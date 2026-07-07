"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import type { RootState } from "@/src/shared/redux/store";
import { hasAdminAccess } from "@/src/utils/tenant";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const status = useSelector((s: RootState) => s.auth.authStatus) as
    | "unknown"
    | "authenticated"
    | "guest"
    | undefined;
  const user = useSelector((s: RootState) => s.auth.user);

  const isChecking = status === "unknown" || !status;
  const isAuthenticated = status === "authenticated";
  const canAccessAdmin = hasAdminAccess(user);
  const isCustomerOnly = isAuthenticated && !canAccessAdmin;

  useEffect(() => {
    if (isChecking) return;

    if (status === "guest") {
      const next = pathname || "/admin";
      router.replace(`/SignIn?next=${encodeURIComponent(next)}`);
      return;
    }

    if (isCustomerOnly) {
      router.replace("/customer/dashboard");
    }
  }, [isChecking, isCustomerOnly, pathname, router, status]);

  if (isChecking) return null;
  if (status === "guest") return null;
  if (isCustomerOnly) return null;

  return <>{children}</>;
}
