"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Update = { key: string; value: string | null };

type Ctx = {
  setParam: (key: string, value: string | null) => void;
  getParam: (key: string) => string | null;
};

const QueryParamContext = React.createContext<Ctx | null>(null);

export function QueryParamProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // pending updates batched into a single replace
  const pendingRef = React.useRef<Update[]>([]);
  const scheduledRef = React.useRef(false);
  const lastHrefRef = React.useRef<string | null>(null);

  const flush = React.useCallback(() => {
    scheduledRef.current = false;

    const sp = new URLSearchParams(window.location.search); // latest
    for (const u of pendingRef.current) {
      if (u.value == null || u.value === "") sp.delete(u.key);
      else sp.set(u.key, u.value);
    }
    pendingRef.current = [];

    const qs = sp.toString();
    const href = qs ? `${pathname}?${qs}` : pathname;

    if (href === lastHrefRef.current) return;
    lastHrefRef.current = href;

    React.startTransition(() => {
      router.replace(href, { scroll: false });
    });
  }, [pathname, router]);

  const setParam = React.useCallback(
    (key: string, value: string | null) => {
      pendingRef.current.push({ key, value });

      if (!scheduledRef.current) {
        scheduledRef.current = true;
        // batch in same tick (so multiple components updating together becomes 1 replace)
        queueMicrotask(flush);
      }
    },
    [flush]
  );

  const getParam = React.useCallback(
    (key: string) => searchParams.get(key),
    [searchParams]
  );

  return (
    <QueryParamContext.Provider value={{ setParam, getParam }}>
      {children}
    </QueryParamContext.Provider>
  );
}

export function useQueryParamApi() {
  const ctx = React.useContext(QueryParamContext);
  if (!ctx) throw new Error("useQueryParamApi must be used inside QueryParamProvider");
  return ctx;
}
