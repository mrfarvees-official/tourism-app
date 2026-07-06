"use client";

import React from "react";
import { FaRoute, FaMapLocationDot } from "react-icons/fa6";
import type { DashboardData } from "@/src/api/hooks/admin/useDashboard";
import { formatDate } from "./panelUtils";

type Props = {
  tenant: string;
  dashboard: DashboardData | null;
};

export default function ToursPanel({ tenant, dashboard }: Props) {
  const tours = dashboard?.categories?.tours ?? [];
  const pages = dashboard?.pages ?? [];

  return (
    <div className="min-h-[calc(100vh-2px)] bg-bg text-fg">
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="border-b border-border pb-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-muted">
            <FaMapLocationDot />
            {tenant}
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Tours</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            Content that maps to tours, packages, destinations, and curated travel collections.
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="bg-menu px-6 py-5 shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <h2 className="text-lg font-semibold">Tour records</h2>
                <p className="mt-1 text-sm text-muted">Matched from content schema menus and titles.</p>
              </div>
              <FaRoute className="text-muted" />
            </div>
            <div className="mt-4 space-y-3">
              {tours.length === 0 ? (
                <p className="py-6 text-sm text-muted">No tour-style records were found yet.</p>
              ) : (
                tours.map((item, index) => (
                  <div key={`${String(item.title ?? "tour")}-${index}`} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
                    <p className="font-medium">{String(item.title ?? "Untitled tour")}</p>
                    <p className="mt-1 text-sm text-muted">{String(item.preview ?? "")}</p>
                    <p className="mt-1 text-xs text-muted">
                      {String(item.menu ?? "")} • {formatDate(String(item.updated_at ?? ""))}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="bg-bg px-6 py-5">
            <h2 className="text-lg font-semibold">Published pages</h2>
            <p className="mt-1 text-sm text-muted">Pages currently available in the tenant workspace.</p>
            <div className="mt-4 space-y-3">
              {pages.length === 0 ? (
                <p className="text-sm text-muted">No pages yet.</p>
              ) : (
                pages.slice(0, 5).map((page, index) => (
                  <div key={`${String(page.slug ?? "page")}-${index}`} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
                    <p className="font-medium">{String(page.title ?? page.slug ?? "Page")}</p>
                    <p className="mt-1 text-xs text-muted">
                      /{String(page.slug ?? "")} • {String(page.status ?? "draft")}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
