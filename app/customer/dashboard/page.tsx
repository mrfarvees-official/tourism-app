"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Container from "@/src/shared/ui/Container";
import { http } from "@/src/api/config/http";
import { activityService } from "@/src/api/services/activityService";
import { packageService } from "@/src/api/services/packageService";
import { tourismServiceService } from "@/src/api/services/tourismServiceService";
import CustomerDashboardCmsShell from "./CustomerDashboardCmsShell";
import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  ClipboardList,
  MessageSquareText,
  Sparkles,
  Star,
  ShieldCheck,
  PhoneCall,
} from "lucide-react";

type TourismCollectionItem = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  status: string;
  amount?: string;
  image?: string;
  fields?: Record<string, unknown>;
  href?: string;
};

type DashboardBooking = {
  id: string;
  reference: string;
  packageName: string;
  destination: string;
  travelDate: string;
  returnDate: string;
  travelersCount: number;
  totalAmount: number;
  paidAmount: number;
  currency: string;
  bookingStatus: string;
  paymentStatus: string;
  notes: string;
  addOns: string[];
  supportContact: string;
  itinerary: string[];
};

type DashboardReview = {
  id: string;
  title: string;
  message: string;
  rating: number;
  status: string;
  createdAt: string;
};

type DashboardData = {
  tenant: {
    key: string;
    name: string;
    supportEmail: string;
  };
  profile: {
    name: string;
    email: string;
    phone: string;
    loyaltyTier: string;
    updatedAt: string;
  };
  summary: {
    upcomingTrips: number;
    completedTrips: number;
    pendingPayments: number;
    totalSpent: string;
    reviewCount: number;
    loyaltyTier: string;
  };
  nextTrip: DashboardBooking | null;
  bookings: DashboardBooking[];
  reviews: DashboardReview[];
  tasks: Array<{
    id: string;
    title: string;
    detail: string;
    status: "open" | "in_progress" | "done" | "attention";
    actionLabel?: string;
    href?: string;
  }>;
  support: Array<{
    id: string;
    title: string;
    detail: string;
    updatedAt: string;
  }>;
};

type CatalogCollections = {
  packages: TourismCollectionItem[];
  services: TourismCollectionItem[];
  activities: TourismCollectionItem[];
};

function formatDate(value: string) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function buildTenantHref(tenantKey: string, href: string) {
  if (!href.startsWith("/")) {
    return href;
  }

  return `/sites/${tenantKey}${href}`;
}

function badgeClass(status: string) {
  switch (status) {
    case "confirmed":
    case "paid":
    case "done":
      return "bg-emerald-100 text-emerald-700";
    case "pending":
    case "partial":
    case "open":
      return "bg-amber-100 text-amber-800";
    case "attention":
      return "bg-rose-100 text-rose-700";
    case "completed":
      return "bg-sky-100 text-sky-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function readCollectionItems(payload: unknown): TourismCollectionItem[] {
  const record = asRecord(payload);
  const candidates = [
    Array.isArray(payload) ? payload : null,
    record?.data,
    record?.items,
    payload,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as TourismCollectionItem[];
    }

    const nested = asRecord(candidate);
    if (!nested) {
      continue;
    }

    if (Array.isArray(nested.data)) {
      return nested.data as TourismCollectionItem[];
    }

    if (Array.isArray(nested.items)) {
      return nested.items as TourismCollectionItem[];
    }
  }

  return [];
}

export default function CustomerDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [collections, setCollections] = useState<CatalogCollections>({
    packages: [],
    services: [],
    activities: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        const [dashboardResponse, packagesResponse, servicesResponse, activitiesResponse] = await Promise.all([
          http.get("/api/customer/dashboard", {
            params: { tenantKey: "lanka-trails" },
          }),
          packageService.list("lanka-trails"),
          tourismServiceService.list("lanka-trails"),
          activityService.list("lanka-trails"),
        ]);

        if (active) {
          setDashboard((dashboardResponse.data?.data ?? null) as DashboardData | null);
          setCollections({
            packages: readCollectionItems(packagesResponse.data),
            services: readCollectionItems(servicesResponse.data),
            activities: readCollectionItems(activitiesResponse.data),
          });
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load your dashboard.");
          setDashboard(null);
          setCollections({
            packages: [],
            services: [],
            activities: [],
          });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const summaryCards = useMemo(
    () => [
      {
        label: "Upcoming trips",
        value: dashboard?.summary.upcomingTrips ?? "0",
        icon: CalendarDays,
      },
      {
        label: "Pending payments",
        value: dashboard?.summary.pendingPayments ?? "0",
        icon: CreditCard,
      },
      {
        label: "Completed trips",
        value: dashboard?.summary.completedTrips ?? "0",
        icon: ShieldCheck,
      },
      {
        label: "Reviews shared",
        value: dashboard?.summary.reviewCount ?? "0",
        icon: Star,
      },
    ],
    [dashboard],
  );

  const tenantKey = dashboard?.tenant.key ?? "lanka-trails";
  const collectionGroups = [
    {
      key: "packages",
      title: "Packages",
      description: "Live package records from the public API.",
      href: `/sites/${tenantKey}/packages`,
      items: collections.packages,
      emptyText: "No active packages are published yet.",
    },
    {
      key: "services",
      title: "Services",
      description: "Active transport and support services pulled from the backend.",
      href: `/sites/${tenantKey}/services`,
      items: collections.services,
      emptyText: "No active services are published yet.",
    },
    {
      key: "activities",
      title: "Activities",
      description: "Curated experiences available through the public endpoint.",
      href: `/sites/${tenantKey}/activities`,
      items: collections.activities,
      emptyText: "No active activities are published yet.",
    },
  ];

  return (
    <CustomerDashboardCmsShell tenantKey={tenantKey} pageSlug="customer-dashboard">
      <Container className="flex min-h-screen flex-col py-8 sm:py-12">
      <section className="overflow-hidden rounded-[2.25rem] border border-border bg-gradient-to-br from-slate-950 via-slate-900 to-primary p-6 text-white shadow-2xl sm:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              <Sparkles className="h-4 w-4" />
              Customer dashboard
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Everything you need before, during, and after your trip.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
              Track bookings, settle payments, check support notes, and review your travel history from one dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={buildTenantHref(tenantKey, "/booking/start")}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Start new booking
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={buildTenantHref(tenantKey, "/customer/bookings")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              View bookings
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{card.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-title">{loading ? "..." : card.value}</p>
                </div>
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {error ? (
        <div className="mt-6 rounded-[1.75rem] border border-rose-200 bg-rose-50 p-5 text-rose-800">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-[1.75rem] border border-border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Next trip</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-title">
                {dashboard?.nextTrip?.packageName ?? "No trip selected"}
              </h2>
            </div>
            {dashboard?.nextTrip ? (
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(dashboard.nextTrip.bookingStatus)}`}>
                {dashboard.nextTrip.bookingStatus}
              </span>
            ) : null}
          </div>

          {dashboard?.nextTrip ? (
            <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Reference</p>
                    <p className="mt-2 font-semibold text-title">{dashboard.nextTrip.reference}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Travel date</p>
                    <p className="mt-2 font-semibold text-title">{formatDate(dashboard.nextTrip.travelDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Destination</p>
                    <p className="mt-2 font-semibold text-title">{dashboard.nextTrip.destination}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Travelers</p>
                    <p className="mt-2 font-semibold text-title">{dashboard.nextTrip.travelersCount}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={buildTenantHref(tenantKey, `/customer/bookings/${dashboard.nextTrip.reference}`)}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Open booking
                  </Link>
                  <a
                    href={`mailto:${dashboard.tenant.supportEmail}?subject=${encodeURIComponent(dashboard.nextTrip.reference)}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-title"
                  >
                    Contact support
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-white p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Payment snapshot</p>
                <div className="mt-3 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">Total amount</span>
                    <span className="font-semibold text-title">
                      {formatMoney(dashboard.nextTrip.totalAmount, dashboard.nextTrip.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">Paid so far</span>
                    <span className="font-semibold text-title">
                      {formatMoney(dashboard.nextTrip.paidAmount, dashboard.nextTrip.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">Payment status</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(dashboard.nextTrip.paymentStatus)}`}>
                      {dashboard.nextTrip.paymentStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">Support contact</span>
                    <span className="font-semibold text-title">{dashboard.nextTrip.supportContact}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-border bg-slate-50 p-8 text-center text-slate-600">
              No bookings yet. Start a booking to see trip details, payment tracking, and support actions here.
            </div>
          )}
        </section>

        <section className="rounded-[1.75rem] border border-border bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">To-do list</p>
          <div className="mt-4 space-y-3">
            {dashboard?.tasks?.map((task) => (
              <div key={task.id} className="rounded-2xl border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-title">{task.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{task.detail}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(task.status)}`}>
                    {task.status.replace("_", " ")}
                  </span>
                </div>
                {task.href && task.actionLabel ? (
                  <Link href={task.href} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    {task.actionLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[1.75rem] border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Bookings</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-title">Recent trips</h2>
            </div>
            <Link href={buildTenantHref(tenantKey, "/customer/bookings")} className="text-sm font-semibold text-primary">
              View all
            </Link>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-border">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Package</th>
                  <th className="px-4 py-3">Travel</th>
                  <th className="px-4 py-3">Payment</th>
                </tr>
              </thead>
              <tbody>
                {(dashboard?.bookings ?? []).slice(0, 5).map((booking) => (
                  <tr key={booking.id} className="border-t border-border">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-title">{booking.reference}</div>
                      <div className="mt-1 text-xs text-slate-500">{booking.destination}</div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{booking.packageName}</td>
                    <td className="px-4 py-4 text-slate-600">{formatDate(booking.travelDate)}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {!loading && (dashboard?.bookings?.length ?? 0) === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      No bookings yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-[1.75rem] border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Account</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-title">{dashboard?.profile.name ?? "Guest traveler"}</h2>
              </div>
            </div>
            <dl className="mt-5 grid gap-4 text-sm">
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Email</dt>
                <dd className="mt-2 font-semibold text-title">{dashboard?.profile.email ?? "Not set"}</dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Phone</dt>
                <dd className="mt-2 font-semibold text-title">{dashboard?.profile.phone ?? "Not set"}</dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Loyalty tier</dt>
                <dd className="mt-2 font-semibold text-title">{dashboard?.summary.loyaltyTier ?? "Explorer"}</dd>
              </div>
            </dl>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/customer/profile" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white">
                Edit profile
              </Link>
              <Link href="/customer/reviews" className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-title">
                Manage reviews
              </Link>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <MessageSquareText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Support</p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-title">Recent notes</h2>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {dashboard?.support.map((item) => (
                <div key={item.id} className="rounded-2xl border border-border p-4">
                  <p className="font-semibold text-title">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.detail}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">{formatDate(item.updatedAt)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-border bg-slate-950 p-6 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <PhoneCall className="h-5 w-5 text-white/80" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">Help</p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">Need a quick answer?</h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/75">
              Email the support desk directly when you need itinerary changes, payment follow-up, or travel advice.
            </p>
            <a
              href={`mailto:${dashboard?.tenant.supportEmail ?? "support@lankatrails.example"}`}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950"
            >
              {dashboard?.tenant.supportEmail ?? "support@lankatrails.example"}
            </a>
          </section>
        </div>
      </div>

      <section className="mt-6 min-h-screen rounded-[1.75rem] border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Catalog</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-title">
              Packages, services, and activities
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              These sections now load directly from the public backend index routes and only show active records.
            </p>
          </div>
          <div className="text-sm text-slate-500">
            Source: public API
          </div>
        </div>

        <div className="mt-6 grid min-h-[calc(100vh-14rem)] gap-5 xl:grid-cols-3">
          {collectionGroups.map((group) => (
            <section
              key={group.key}
              className="flex h-full min-h-full flex-col rounded-[1.5rem] border border-border bg-slate-50 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-title">{group.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{group.description}</p>
                </div>
                <Link href={group.href} className="text-sm font-semibold text-primary">
                  View all
                </Link>
              </div>

              <div className="mt-5 flex flex-1 flex-col gap-4">
                {group.items.length ? (
                  group.items.slice(0, 3).map((item) => (
                    <article
                      key={`${group.key}-${item.slug}-${item.id}`}
                      className="rounded-2xl border border-border bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                            {item.subtitle}
                          </p>
                          <h4 className="mt-2 text-lg font-semibold text-title">{item.title}</h4>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                        </div>
                        {item.amount ? (
                          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {item.amount}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(item.status)}`}>
                          {item.status}
                        </span>
                        <Link href={`/${group.key}/${item.slug}`} className="text-sm font-semibold text-primary">
                          Open detail
                        </Link>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="flex min-h-full flex-1 items-center justify-center rounded-2xl border border-dashed border-border bg-white p-6 text-center text-sm text-slate-500">
                    {group.emptyText}
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </section>
      </Container>
    </CustomerDashboardCmsShell>
  );
}
