"use client";

import React from "react";
import { FaChevronLeft, FaChevronRight, FaClockRotateLeft, FaFileLines, FaFolderOpen, FaImage, FaUsers } from "react-icons/fa6";
import type { DashboardData } from "@/src/api/hooks/admin/useDashboard";
import { useTenantActivityLogs } from "@/src/api/hooks/admin/useActivityLogs";
import { formatBytes, formatDateLong } from "./panelUtils";

type Props = {
  tenant: string;
  dashboard: DashboardData | null;
  loading: boolean;
};

const ACTIVITY_PAGE_SIZE = 7;

function buildPageList(currentPage: number, lastPage: number) {
  if (lastPage <= 7) {
    return Array.from({ length: lastPage }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, lastPage, currentPage - 1, currentPage, currentPage + 1]);
  return Array.from(pages)
    .filter((page) => page >= 1 && page <= lastPage)
    .sort((a, b) => a - b);
}

export default function HomePanel({ tenant, dashboard, loading }: Props) {
  const summary = dashboard?.summary;
  const [activityPage, setActivityPage] = React.useState(1);
  const { items: activity, meta: activityMeta, loading: activityLoading, errors: activityErrors } = useTenantActivityLogs(
    tenant,
    activityPage,
    ACTIVITY_PAGE_SIZE,
  );

  React.useEffect(() => {
    setActivityPage(1);
  }, [tenant]);

  React.useEffect(() => {
    const lastPage = activityMeta?.last_page ?? 1;
    if (activityPage > lastPage) {
      setActivityPage(lastPage);
    }
  }, [activityMeta?.last_page, activityPage]);

  const pageNumbers = React.useMemo(
    () => buildPageList(activityMeta?.current_page ?? 1, activityMeta?.last_page ?? 1),
    [activityMeta?.current_page, activityMeta?.last_page],
  );

  return (
    <div className="min-h-[calc(100vh-2px)] bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.12),transparent_34%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] text-fg">
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 text-slate-50 shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.24),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.18),transparent_40%)]" />
          <div className="relative grid gap-6 p-6 sm:p-8 xl:grid-cols-[1.25fr_0.75fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300">
                <FaFolderOpen />
                {tenant}
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Admin overview built for fast scanning, not busywork.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Keep a live read on the tenant workspace with current counts up top and a paginated activity log underneath.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-slate-200">
                  Pages {loading ? "..." : summary?.pages_total ?? 0}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-slate-200">
                  Records {loading ? "..." : summary?.records_total ?? 0}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-slate-200">
                  Members {loading ? "..." : summary?.members_total ?? 0}
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Last update</p>
                <p className="mt-3 text-xl font-semibold">{formatDateLong(summary?.updated_at)}</p>
                <p className="mt-2 text-sm text-slate-300">Latest content, media, or member activity reflected in the summary.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Media footprint</p>
                <p className="mt-3 text-xl font-semibold">{formatBytes(summary?.media_bytes ?? 0)}</p>
                <p className="mt-2 text-sm text-slate-300">{loading ? "Loading totals..." : `${summary?.media_total ?? 0} assets in the library`}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Pages"
            value={loading ? "..." : String(summary?.pages_total ?? 0)}
            caption={`${summary?.pages_published ?? 0} published`}
            icon={<FaFileLines />}
          />
          <StatCard
            label="Media"
            value={loading ? "..." : String(summary?.media_total ?? 0)}
            caption={formatBytes(summary?.media_bytes ?? 0)}
            icon={<FaImage />}
          />
          <StatCard
            label="Records"
            value={loading ? "..." : String(summary?.records_total ?? 0)}
            caption={`${summary?.invites_total ?? 0} invites`}
            icon={<FaClockRotateLeft />}
          />
          <StatCard
            label="Members"
            value={loading ? "..." : String(summary?.members_total ?? 0)}
            caption={`${summary?.owners_total ?? 0} owner(s)`}
            icon={<FaUsers />}
          />
        </section>

        <section className="mt-6 overflow-hidden rounded-[2rem] border border-border bg-menu shadow-sm">
          <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-muted">
                <FaClockRotateLeft />
                Recent activity
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-title">Workspace log</h2>
              <p className="mt-1 text-sm text-muted">
                Persisted admin changes and tracked actions, paginated from the backend.
              </p>
            </div>
            <div className="text-sm text-muted">
              <span className="font-semibold text-title">{activityMeta?.total ?? 0}</span> total events
            </div>
          </div>

          <div className="px-5 py-5 sm:px-6">
            {activityErrors?.[0] ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {activityErrors[0]}
              </div>
            ) : null}

            <div className="space-y-3">
              {activityLoading ? (
                Array.from({ length: ACTIVITY_PAGE_SIZE }, (_, index) => (
                  <div key={index} className="animate-pulse rounded-2xl border border-border bg-bg px-4 py-4">
                    <div className="h-4 w-40 rounded bg-slate-200" />
                    <div className="mt-3 h-3 w-full rounded bg-slate-200" />
                    <div className="mt-2 h-3 w-2/3 rounded bg-slate-200" />
                  </div>
                ))
              ) : activity.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-bg px-4 py-10 text-center text-sm text-muted">
                  No activity has been recorded yet.
                </div>
              ) : (
                activity.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-border bg-bg px-4 py-4 shadow-[0_1px_0_rgba(15,23,42,0.03)]">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-title">{item.label}</p>
                          <p className="mt-1 text-sm text-muted">{item.summary ?? item.route ?? "Tracked admin action"}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                            <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-700">{item.action}</span>
                            <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-700">{item.actor_name}</span>
                            {item.actor_email ? <span>{item.actor_email}</span> : null}
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 text-right text-xs text-muted">
                        <p>{formatDateLong(item.timestamp)}</p>
                        {item.method ? <p className="mt-1 font-medium uppercase tracking-[0.25em]">{item.method}</p> : null}
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">
                Showing {activityMeta?.from ?? 0}-{activityMeta?.to ?? 0} of {activityMeta?.total ?? 0}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActivityPage((current) => Math.max(1, current - 1))}
                  disabled={activityPage <= 1 || activityLoading}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg px-3 py-2 text-sm font-semibold text-title transition hover:bg-hover hover:text-hover_text disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaChevronLeft className="h-3.5 w-3.5" />
                  Prev
                </button>

                {pageNumbers.map((pageNumber, index) => {
                  const previousPage = pageNumbers[index - 1];
                  const isGap = previousPage !== undefined && pageNumber - previousPage > 1;

                  return (
                    <React.Fragment key={pageNumber}>
                      {isGap ? <span className="px-1 text-sm text-muted">...</span> : null}
                      <button
                        type="button"
                        onClick={() => setActivityPage(pageNumber)}
                        disabled={activityLoading}
                        className={`h-10 min-w-10 rounded-xl border px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          pageNumber === (activityMeta?.current_page ?? 1)
                            ? "border-primary bg-primary text-white"
                            : "border-border bg-bg text-title hover:bg-hover hover:text-hover_text"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    </React.Fragment>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setActivityPage((current) => current + 1)}
                  disabled={activityLoading || activityPage >= (activityMeta?.last_page ?? 1)}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg px-3 py-2 text-sm font-semibold text-title transition hover:bg-hover hover:text-hover_text disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <FaChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  caption,
  icon,
}: {
  label: string;
  value: string;
  caption: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border bg-menu p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-title">{value}</p>
          <p className="mt-1 text-sm text-muted">{caption}</p>
        </div>
        <div className="rounded-2xl bg-bg p-3 text-primary">{icon}</div>
      </div>
    </div>
  );
}
