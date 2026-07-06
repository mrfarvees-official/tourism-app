"use client";

import React from "react";
import { FaArrowRight, FaBolt, FaFolderOpen } from "react-icons/fa6";
import type { DashboardData } from "@/src/api/hooks/admin/useDashboard";
import { formatBytes, formatDate } from "./panelUtils";

type Props = {
  tenant: string;
  dashboard: DashboardData | null;
  loading: boolean;
  onOpenContentStudio: () => void;
  onJumpToMenu: (menu: "media") => void;
};

export default function HomePanel({ tenant, dashboard, loading, onOpenContentStudio, onJumpToMenu }: Props) {
  const summary = dashboard?.summary;
  const activity = dashboard?.activity ?? [];

  return (
    <div className="min-h-[calc(100vh-2px)] bg-bg text-fg">
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="border-b border-border pb-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-muted">
            <FaFolderOpen />
            {tenant}
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Admin overview</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            A tenant-first control surface for pages, media, schemas, and activity.
          </p>
        </div>

        <div className="grid gap-3 py-6 sm:grid-cols-2 xl:grid-cols-4">
          <div className="bg-menu px-5 py-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Pages</p>
            <p className="mt-2 text-3xl font-semibold">{loading ? "..." : summary?.pages_total ?? 0}</p>
            <p className="mt-1 text-sm text-muted">{summary?.pages_published ?? 0} published</p>
          </div>
          <div className="bg-menu px-5 py-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Media</p>
            <p className="mt-2 text-3xl font-semibold">{loading ? "..." : summary?.media_total ?? 0}</p>
            <p className="mt-1 text-sm text-muted">{formatBytes(summary?.media_bytes ?? 0)}</p>
          </div>
          <div className="bg-menu px-5 py-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Schemas</p>
            <p className="mt-2 text-3xl font-semibold">{loading ? "..." : summary?.schemas_total ?? 0}</p>
            <p className="mt-1 text-sm text-muted">{summary?.schemas_enabled ?? 0} enabled</p>
          </div>
          <div className="bg-menu px-5 py-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Members</p>
            <p className="mt-2 text-3xl font-semibold">{loading ? "..." : summary?.members_total ?? 0}</p>
            <p className="mt-1 text-sm text-muted">{summary?.owners_total ?? 0} owner(s)</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="bg-menu px-6 py-5 shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <h2 className="text-lg font-semibold">Live actions</h2>
                <p className="mt-1 text-sm text-muted">Jump into the most common workflows.</p>
              </div>
              <FaBolt className="text-muted" />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={onOpenContentStudio}
                className="bg-bg px-4 py-4 text-left transition hover:bg-hover hover:text-hover_text"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-muted">Content</p>
                <p className="mt-2 text-base font-semibold">Open content studio</p>
              </button>
              <button
                type="button"
                onClick={() => onJumpToMenu("media")}
                className="bg-bg px-4 py-4 text-left transition hover:bg-hover hover:text-hover_text"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-muted">Media</p>
                <p className="mt-2 text-base font-semibold">Review uploaded images</p>
              </button>
            </div>
          </section>

          <section className="bg-menu px-6 py-5 shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <h2 className="text-lg font-semibold">Recent activity</h2>
                <p className="mt-1 text-sm text-muted">Latest changes from the tenant workspace.</p>
              </div>
              <FaArrowRight className="text-muted" />
            </div>
            <div className="mt-4 space-y-3">
              {activity.length === 0 ? (
                <p className="py-6 text-sm text-muted">No activity has been recorded yet.</p>
              ) : (
                activity.map((item, index) => (
                  <div key={`${String(item.type ?? "activity")}-${index}`} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
                    <p className="font-medium">{String(item.label ?? "Activity")}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
                      <span>{String(item.meta ?? item.type ?? "")}</span>
                      <span>{formatDate(String(item.timestamp ?? ""))}</span>
                    </div>
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
