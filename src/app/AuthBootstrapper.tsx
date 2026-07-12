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

  const isPublicPath = (value: string) => {
    const normalized = (value || "/").toLowerCase();
    const root = normalized.split("/").filter(Boolean)[0] ?? "";

    return (
      normalized === "/" ||
      normalized === "/customer-intake" ||
      [
        "destinations",
        "packages",
        "services",
        "activities",
        "contact",
        "booking",
        "customer",
      ].includes(root)
    );
  };

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

    const normalizedPath = (pathname || "/").toLowerCase();
    const isBaseHome = isBaseHost() && normalizedPath === "/";
    const isAuthPage = normalizedPath === "/signin" || normalizedPath === "/signup";
    const isPublicRoute = isPublicPath(normalizedPath);

    // allow public site routes to stay unauthenticated
    if (authStatus !== "authenticated" || !user) {
      if (isPublicRoute) return;

      redirected.current = true;
      router.replace("/SignIn");
      return;
    }

    // keep the public homepage available even after login
    if (isBaseHome) return;

    // auth pages on the base host should resolve back to the public homepage
    if (isBaseHost() && isAuthPage) {
      redirected.current = true;
      router.replace("/");
      return;
    }

    if (!isBaseHost()) return;

    redirected.current = true;
    redirectToTenantIfNeeded(user, pathname || "/");
  }, [meChecked, authStatus, user, pathname, router]);

  return null;
}
