"use client";

import React from "react";
import {
  FaCarSide,
  FaChartLine,
  FaHotel,
  FaImage,
  FaLocationDot,
  FaPersonHiking,
  FaSuitcaseRolling,
  FaUsers,
} from "react-icons/fa6";
import { FaConciergeBell } from "react-icons/fa";
import { motion } from "framer-motion";
import { adminBusinessDashboardService } from "@/src/api/services/adminBusinessDashboardService";

type Period = "yearly" | "monthly";

type ResourceKey = "packages" | "destinations" | "services" | "activities" | "stays" | "transport" | "customers" | "media";

type TimelinePoint = {
  label: string;
  value: number;
};

type ResourceAnalytics = {
  key: ResourceKey;
  label: string;
  total: number;
  active: number;
  draft: number;
  updated_at?: string | null;
  series: TimelinePoint[];
};

type DashboardResponse = {
  tenant?: {
    name?: string;
    key?: string;
  };
  filters?: {
    period?: Period;
    year?: number;
    month?: number | null;
    label?: string;
    labels?: string[];
  };
  resources?: ResourceAnalytics[];
};

type Props = {
  tenant: string;
};

const RESOURCE_META: Record<
  ResourceKey,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    accent: string;
    soft: string;
  }
> = {
  packages: {
    label: "Packages",
    icon: FaSuitcaseRolling,
    accent: "#2563eb",
    soft: "#dbeafe",
  },
  destinations: {
    label: "Destinations",
    icon: FaLocationDot,
    accent: "#0f766e",
    soft: "#ccfbf1",
  },
  services: {
    label: "Services",
    icon: FaConciergeBell,
    accent: "#7c3aed",
    soft: "#ede9fe",
  },
  activities: {
    label: "Activities",
    icon: FaPersonHiking,
    accent: "#ea580c",
    soft: "#ffedd5",
  },
  stays: {
    label: "Stays",
    icon: FaHotel,
    accent: "#be185d",
    soft: "#fce7f3",
  },
  transport: {
    label: "Transport",
    icon: FaCarSide,
    accent: "#059669",
    soft: "#d1fae5",
  },
  customers: {
    label: "Customers",
    icon: FaUsers,
    accent: "#9333ea",
    soft: "#f3e8ff",
  },
  media: {
    label: "Media assets",
    icon: FaImage,
    accent: "#475569",
    soft: "#e2e8f0",
  },
};

const PERIOD_OPTIONS: Array<{ value: Period; label: string }> = [
  { value: "yearly", label: "Yearly" },
  { value: "monthly", label: "Monthly" },
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function unwrapDashboard(payload: unknown): DashboardResponse | null {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
  const record = payload as Record<string, unknown>;
  const candidate = record.data && typeof record.data === "object" && !Array.isArray(record.data) ? (record.data as Record<string, unknown>).data ?? record.data : record;
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return null;
  return candidate as DashboardResponse;
}

function formatDelta(value: number) {
  if (value === 0) return "flat";
  return value > 0 ? `+${value}` : `${value}`;
}

function formatCount(value: number) {
  return new Intl.NumberFormat(undefined).format(value);
}

function getYearOptions() {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, index) => currentYear - 4 + index);
}

function MultiLineChart({
  labels,
  resources,
}: {
  labels: string[];
  resources: ResourceAnalytics[];
}) {
  const width = 1200;
  const height = 500;
  const margin = { top: 36, right: 28, bottom: 72, left: 72 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const maxValue = Math.max(1, ...resources.flatMap((resource) => resource.series.map((point) => point.value)));
  const xStep = labels.length > 1 ? plotWidth / (labels.length - 1) : 0;
  const yScale = (value: number) => margin.top + plotHeight - (plotHeight * value) / maxValue;
  const xScale = (index: number) => margin.left + xStep * index;

  const yTicks = Array.from({ length: 6 }, (_, index) => Math.round((maxValue / 5) * (5 - index)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-title">Resource trends</h2>
          <p className="text-sm text-muted">Each resource is drawn as its own colored line across the selected period.</p>
        </div>
        <div className="text-xs uppercase tracking-[0.28em] text-muted">{labels.length} buckets</div>
      </div>

      <div className="rounded-3xl border border-border bg-white p-4">
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="h-[30rem] min-w-[48rem] w-full">
            <defs>
              <linearGradient id="chartArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="100%" stopColor="#f8fbff" stopOpacity="1" />
              </linearGradient>
            </defs>

            <rect x="0" y="0" width={width} height={height} rx="24" fill="url(#chartArea)" />

            <text x={margin.left} y={22} className="fill-title text-[14px] font-semibold">
              Resource trends
            </text>

            {yTicks.map((tick, index) => {
              const y = margin.top + (plotHeight / 5) * index;
              return (
                <g key={`y-${tick}-${index}`}>
                  <line x1={margin.left} x2={width - margin.right} y1={y} y2={y} stroke="#e5eaf1" />
                  <text x={margin.left - 14} y={y + 4} textAnchor="end" className="fill-muted text-[11px] font-medium">
                    {tick}
                  </text>
                </g>
              );
            })}

            <line x1={margin.left} x2={width - margin.right} y1={margin.top + plotHeight} y2={margin.top + plotHeight} stroke="#cbd5e1" />
            <line x1={margin.left} x2={margin.left} y1={margin.top} y2={margin.top + plotHeight} stroke="#cbd5e1" />

            {labels.map((label, index) => {
              const x = xScale(index);
              return (
                <g key={label}>
                  <line x1={x} x2={x} y1={margin.top + plotHeight} y2={margin.top + plotHeight + 6} stroke="#cbd5e1" />
                  <text x={x} y={height - 20} textAnchor="middle" className="fill-muted text-[11px] font-medium">
                    {label}
                  </text>
                </g>
              );
            })}

            {resources.map((resource) => {
              const meta = RESOURCE_META[resource.key];
              const values = labels.map((_, index) => resource.series[index]?.value ?? 0);
              const points = values.map((value, index) => ({
                x: xScale(index),
                y: yScale(value),
                value,
              }));
              const path = points
                .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
                .join(" ");

              return (
                <g key={resource.key}>
                  <path d={path} fill="none" stroke={meta.accent} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                  {points.map((point, index) => (
                    <g key={`${resource.key}-${index}`}>
                      <circle cx={point.x} cy={point.y} r="5.5" fill="#ffffff" stroke={meta.accent} strokeWidth="2.5" />
                      <circle cx={point.x} cy={point.y} r="2.2" fill={meta.accent} />
                    </g>
                  ))}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {resources.map((resource) => {
            const meta = RESOURCE_META[resource.key];
            return (
              <div key={resource.key} className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-title shadow-sm">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: meta.accent }} />
                {meta.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPanel({ tenant }: Props) {
  const currentYear = React.useMemo(() => new Date().getFullYear(), []);
  const currentMonth = React.useMemo(() => new Date().getMonth() + 1, []);
  const [period, setPeriod] = React.useState<Period>("yearly");
  const [year, setYear] = React.useState(currentYear);
  const [month, setMonth] = React.useState(currentMonth);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [dashboard, setDashboard] = React.useState<DashboardResponse | null>(null);

  const loadDashboard = React.useCallback(async () => {
    if (!tenant) return;

    setLoading(true);
    setError(null);

    try {
      const response = await adminBusinessDashboardService.get(tenant, {
        period,
        year,
        month: period === "monthly" ? month : undefined,
      });
      setDashboard(unwrapDashboard(response.data));
    } catch (requestError) {
      const typed = requestError as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      setDashboard(null);
      setError(typed?.response?.data?.message ?? typed?.response?.data?.error ?? typed?.message ?? "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }, [month, period, tenant, year]);

  React.useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const resources = React.useMemo(() => dashboard?.resources ?? [], [dashboard]);
  const labels = dashboard?.filters?.labels ?? resources[0]?.series.map((point) => point.label) ?? [];

  const cards = React.useMemo(
    () =>
      resources.map((resource) => {
        const meta = RESOURCE_META[resource.key];
        const trend = resource.series.map((point) => point.value);
        const delta = trend.length > 1 ? trend[trend.length - 1] - trend[0] : trend[0] ?? 0;

        return {
          ...resource,
          meta,
          trend,
          delta,
        };
      }),
    [resources],
  );

  const periodLabel =
    period === "monthly"
      ? `${MONTHS[month - 1]} ${year}`
      : `${year}`;

  return (
    <div className="min-h-[calc(100vh-2px)] bg-white text-fg">
      <div className="mx-auto max-w-[1680px] px-4 py-4 lg:px-6 lg:py-6">
        <div className="rounded-[28px] border border-border bg-gradient-to-br from-white via-bg to-slate-50 p-4 shadow-sm lg:p-5">
          <div className="flex flex-col gap-4 border-b border-border pb-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.38em] text-muted">
                <FaChartLine />
                {tenant}
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-title lg:text-4xl">Admin analytics</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                Track inventory, customers, and media assets across the selected year or month without leaving the admin shell.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-white/80 p-3 shadow-sm">
              <label className="grid gap-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted">View</span>
                <select
                  value={period}
                  onChange={(event) => setPeriod(event.target.value as Period)}
                  className="min-w-32 rounded-xl border border-border bg-bg px-3 py-2 text-sm font-medium text-title outline-none focus:border-primary"
                >
                  {PERIOD_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted">Year</span>
                <select
                  value={year}
                  onChange={(event) => setYear(Number(event.target.value))}
                  className="min-w-28 rounded-xl border border-border bg-bg px-3 py-2 text-sm font-medium text-title outline-none focus:border-primary"
                >
                  {getYearOptions().map((optionYear) => (
                    <option key={optionYear} value={optionYear}>
                      {optionYear}
                    </option>
                  ))}
                </select>
              </label>

              {period === "monthly" ? (
                <label className="grid gap-1">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-muted">Month</span>
                  <select
                    value={month}
                    onChange={(event) => setMonth(Number(event.target.value))}
                    className="min-w-36 rounded-xl border border-border bg-bg px-3 py-2 text-sm font-medium text-title outline-none focus:border-primary"
                  >
                    {MONTHS.map((optionMonth, index) => (
                      <option key={optionMonth} value={index + 1}>
                        {optionMonth}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              <button
                type="button"
                onClick={() => void loadDashboard()}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-title px-4 text-sm font-semibold text-bg transition hover:opacity-90"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.meta.icon;
              return (
                <motion.article
                  key={card.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="overflow-hidden rounded-3xl border border-border bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: card.meta.soft, color: card.meta.accent }}
                      >
                        <Icon className="text-lg" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.25em] text-muted">{card.meta.label}</p>
                        <p className="mt-1 truncate text-sm font-semibold text-title">{periodLabel}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-semibold tracking-tight text-title">{formatCount(card.total)}</p>
                      <p className={`mt-1 text-xs font-medium ${card.delta >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {formatDelta(card.delta)} this period
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted">
                    <span>{formatCount(card.active)} active</span>
                    <span>{formatCount(card.draft)} draft</span>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
            <section className="rounded-[28px] border border-border bg-white p-4 shadow-sm">
              {loading && resources.length === 0 ? (
                <div className="flex h-[28rem] items-center justify-center rounded-3xl border border-dashed border-border bg-bg text-sm text-muted">
                  Loading analytics...
                </div>
              ) : labels.length > 0 && resources.length > 0 ? (
                <MultiLineChart labels={labels} resources={resources} />
              ) : (
                <div className="flex h-[28rem] items-center justify-center rounded-3xl border border-dashed border-border bg-bg text-sm text-muted">
                  No analytics data found for the selected period.
                </div>
              )}
            </section>

            <section className="rounded-[28px] border border-border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-semibold text-title">Selected period</h2>
                  <p className="text-sm text-muted">{dashboard?.filters?.label ?? periodLabel}</p>
                </div>
                <div className="rounded-full border border-border bg-bg px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted">
                  {period}
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {cards.map((card) => (
                  <div key={`detail-${card.key}`} className="rounded-2xl border border-border bg-bg px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-title">{card.meta.label}</p>
                        <p className="text-xs text-muted">Total {formatCount(card.total)} records</p>
                      </div>
                      <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ backgroundColor: card.meta.soft, color: card.meta.accent }}>
                        {formatDelta(card.delta)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
