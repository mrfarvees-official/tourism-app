// TenantBootstrapper.tsx
"use client";

import { useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/src/shared/redux/store/hooks";
import { fetchTenantBootstrap } from "@/src/shared/redux/store/tenantBootstrapSlice";
import { applyTenantThemeInline, resetToGlobalTheme } from "@/src/utils/runtimeConfig";
import { useBootstrapGate } from "@/src/app/BootstrapGate";

export default function TenantBootstrapper({ tenantKey }: { tenantKey?: string }) {
  const { setTenantReady } = useBootstrapGate();
  const markedReady = useRef(false);

  const dispatch = useAppDispatch();

  const status = useAppSelector((s) => s.tenantBootstrap.status);
  const appearance = useAppSelector((s) => s.tenantBootstrap.appearance);

  const { authStatus, meChecked } = useAppSelector((s) => s.auth);
  const isAuthed = meChecked && authStatus === "authenticated";

  const activeTheme = useMemo(() => {
    return appearance.themes.find((t) => t.id === appearance.activeThemeId);
  }, [appearance.themes, appearance.activeThemeId]);

  const resolvedTenantKey = useMemo(() => {
    if (tenantKey?.trim()) return tenantKey.trim();
    if (typeof window === "undefined") return "";

    const host = window.location.hostname.split(":")[0].toLowerCase();
    const parts = host.split(".");

    if (parts.length >= 3) return parts[0];
    if (parts.length === 2 && parts[1] === "localhost") return parts[0];

    const pathParts = window.location.pathname.split("/").filter(Boolean);

    if (pathParts[0] === "_sites" && pathParts[1]) return pathParts[1];
    if (pathParts[0] === "admin" && pathParts[1]) return pathParts[1];

    return "";
  }, [tenantKey]);

  useEffect(() => {
    if (!meChecked) return;
    if (!isAuthed) resetToGlobalTheme();
  }, [meChecked, isAuthed]);

  useEffect(() => {
    if (resolvedTenantKey) return;
    if (markedReady.current) return;
    markedReady.current = true;
    setTenantReady(true);
  }, [resolvedTenantKey, setTenantReady]);

  useEffect(() => {
    if (!resolvedTenantKey) return;
    if (!isAuthed) return;
    dispatch(fetchTenantBootstrap(resolvedTenantKey));
  }, [resolvedTenantKey, isAuthed, dispatch]);

  useEffect(() => {
    if (!resolvedTenantKey) return;

    if (!meChecked) return;

    if (!isAuthed) {
      if (!markedReady.current) {
        markedReady.current = true;
        setTenantReady(true);
      }
      return;
    }

    if (status === "loading") return;
    if (markedReady.current) return;

    markedReady.current = true;
    setTenantReady(true);
  }, [status, resolvedTenantKey, meChecked, isAuthed, setTenantReady]);

  useEffect(() => {
    if (!isAuthed) return;
    if (!activeTheme?.colors) return;

    const isDark = appearance.mode_default === "dark";
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    document.documentElement.classList.toggle("dark", isDark);

    applyTenantThemeInline(activeTheme.colors);

    if (activeTheme.custom_css) {
      const id = "tenant-custom-css";
      let style = document.getElementById(id) as HTMLStyleElement | null;
      if (!style) {
        style = document.createElement("style");
        style.id = id;
        document.head.appendChild(style);
      }
      style.textContent = activeTheme.custom_css;
    } else {
      const existing = document.getElementById("tenant-custom-css");
      if (existing) existing.remove();
    }
  }, [isAuthed, activeTheme, appearance.mode_default]);

  useEffect(() => {
    if (!isAuthed) return;
    if (!activeTheme?.colors) return;

    const reapply = () => applyTenantThemeInline(activeTheme.colors);
    window.addEventListener("tenant-theme-changed", reapply);
    return () => window.removeEventListener("tenant-theme-changed", reapply);
  }, [isAuthed, activeTheme]);

  return null;
}