"use client";

import React from "react";
import { FaChartLine, FaClock, FaDiagramProject, FaImage, FaLayerGroup } from "react-icons/fa6";
import type { DashboardData } from "@/src/api/hooks/admin/useDashboard";

type Props = {
  tenant: string;
  dashboard: DashboardData | null;
};

export default function AnalyticsPanel({ tenant, dashboard }: Props) {
  const summary = dashboard?.summary;
  const schemas = dashboard?.schemas ?? [];

  return (
    <div className="min-h-[calc(100vh-2px)] bg-bg text-fg">
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="border-b border-border pb-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-muted">
            <FaChartLine />
            {tenant}
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Analytics</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            Summary signals from the content-heavy parts of the tenant.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="bg-menu px-5 py-4 shadow-sm">
            <FaLayerGroup className="text-muted" />
            <p className="mt-4 text-2xl font-semibold">{summary?.records_total ?? 0}</p>
            <p className="mt-1 text-sm text-muted">Content records</p>
          </div>
          <div className="bg-menu px-5 py-4 shadow-sm">
            <FaImage className="text-muted" />
            <p className="mt-4 text-2xl font-semibold">{summary?.media_total ?? 0}</p>
            <p className="mt-1 text-sm text-muted">Media assets</p>
          </div>
          <div className="bg-menu px-5 py-4 shadow-sm">
            <FaDiagramProject className="text-muted" />
            <p className="mt-4 text-2xl font-semibold">{schemas.length}</p>
            <p className="mt-1 text-sm text-muted">Schemas loaded</p>
          </div>
          <div className="bg-menu px-5 py-4 shadow-sm">
            <FaClock className="text-muted" />
            <p className="mt-4 text-2xl font-semibold">{summary?.updated_at ? "Fresh" : "Idle"}</p>
            <p className="mt-1 text-sm text-muted">Workspace state</p>
          </div>
        </div>

        <section className="mt-6 bg-menu px-6 py-5 shadow-sm">
          <h2 className="text-lg font-semibold">Schema inventory</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {schemas.length === 0 ? (
              <p className="text-sm text-muted">No schemas were loaded.</p>
            ) : (
              schemas.map((schema, index) => (
                <div key={`${String(schema.menu ?? "schema")}-${index}`} className="border-b border-border pb-3">
                  <p className="font-medium">{String(schema.name ?? schema.menu ?? "Schema")}</p>
                  <p className="mt-1 text-xs text-muted">
                    {String(schema.menu ?? "")} • v{String(schema.version ?? "")} • {String(schema.status ?? "")}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
