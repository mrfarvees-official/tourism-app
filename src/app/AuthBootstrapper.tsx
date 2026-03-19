// AuthBootstrapper.tsx
"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/shared/redux/store";
import { authMe } from "@/src/shared/redux/store/authSlice";
import { redirectToTenantIfNeeded, isBaseHost } from "@/src/utils/tenant";
import { useBootstrapGate } from "@/src/app/BootstrapGate";
import { usePathname, useRouter } from "next/navigation";

export function AuthBootstrapper() {
  const { setAuthReady } = useBootstrapGate();

  const dispatch = useDispatch<AppDispatch>();
  const { user, authStatus, meChecked } = useSelector((s: RootState) => s.auth);

  const router = useRouter();
  const pathname = usePathname();

  const booted = useRef(false);
  const redirected = useRef(false);
  const markedReady = useRef(false);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    dispatch(authMe());
  }, [dispatch]);

  useEffect(() => {
    if (!meChecked) return;
    if (markedReady.current) return;
    markedReady.current = true;
    setAuthReady(true);
  }, [meChecked, setAuthReady]);

  useEffect(() => {
    if (!meChecked) return;
    if (redirected.current) return;

    const isTenantSubdomain = typeof window !== "undefined" && !isBaseHost();

    // allow tenant root to stay unauthenticated
    if ((authStatus !== "authenticated" || !user)) {
      if (isTenantSubdomain && pathname === "/") return;

      if (pathname.toLowerCase() !== "/signin") {
        redirected.current = true;
        router.replace("/SignIn");
      }
      return;
    }

    if (!isBaseHost()) return;

    redirected.current = true;
    redirectToTenantIfNeeded(user, pathname || "/");
  }, [meChecked, authStatus, user, pathname, router]);

  return null;
}