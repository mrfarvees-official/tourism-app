"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/shared/redux/store";
import { logout } from "@/src/shared/redux/store/authSlice";

type Props = {
  className?: string;
  compact?: boolean;
  surface?: "dark" | "light";
};

export default function CustomerPortalAuthButton({ className = "", compact = false, surface = "dark" }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const status = useSelector((state: RootState) => state.auth.authStatus);

  const isAuthenticated = status === "authenticated";

  const baseClass = compact
    ? "inline-flex items-center rounded-xl border px-4 py-2.5 text-sm font-semibold transition"
    : "inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition";
  const darkClass = "border-white/15 bg-white/10 text-white hover:bg-white/15";
  const lightClass = "border-slate-200 bg-white text-slate-900 hover:bg-slate-50";

  async function handleLogout() {
    try {
      await dispatch(logout({ redirectTo: "/SignIn" })).unwrap();
    } finally {
      router.replace("/SignIn");
    }
  }

  if (!isAuthenticated) {
    return (
      <Link
        href="/SignIn"
        className={`${baseClass} ${surface === "dark" ? darkClass : lightClass} ${className}`}
      >
        Sign in
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      className={`${baseClass} ${surface === "dark" ? "border-white/15 bg-white text-slate-950 hover:bg-slate-100" : lightClass} ${className}`}
    >
      Sign out
    </button>
  );
}
