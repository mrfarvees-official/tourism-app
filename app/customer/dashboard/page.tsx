"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import Link from "next/link";
import Container from "@/src/shared/ui/Container";
import { http } from "@/src/api/config/http";
import CustomerDashboardCmsShell from "./CustomerDashboardCmsShell";
import CustomerPortalAuthButton from "@/src/shared/common/CustomerPortalAuthButton";
import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  ClipboardList,
  MapPinned,
  MessageSquareText,
  PhoneCall,
  Sparkles,
  Star,
  ShieldCheck,
  Ticket,
} from "lucide-react";

type DashboardBooking = {
  id: string;
  reference: string;
  packageName: string;
  destination: string;
  serviceName?: string;
  activityName?: string;
  travelDate: string;
  returnDate: string;
  travelersCount: number;
  totalAmount: number;
  paidAmount: number;
  currency: string;
  bookingStatus: string;
  paymentStatus: string;
  paymentDueDate?: string;
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

function InfoBlock({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-title">{value}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p>
    </div>
  );
}

function BookingList({
  title,
  eyebrow,
  description,
  items,
  emptyText,
  tenantKey,
}: {
  title: string;
  eyebrow: string;
  description: string;
  items: DashboardBooking[];
  emptyText: string;
  tenantKey: string;
}) {
  return (
    <section className="rounded-[1.75rem] border border-border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-title">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {items.length ? (
          items.slice(0, 3).map((booking) => (
            <article key={booking.id} className="rounded-2xl border border-border bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{booking.reference}</p>
                  <h3 className="mt-2 text-lg font-semibold text-title">{booking.packageName}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {booking.destination}
                    {booking.serviceName ? ` · ${booking.serviceName}` : ""}
                    {booking.activityName ? ` · ${booking.activityName}` : ""}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(booking.paymentStatus)}`}>
                    {booking.paymentStatus}
                  </span>
                  <Link
                    href={buildTenantHref(tenantKey, `/customer/bookings/${booking.reference}`)}
                    className="text-sm font-semibold text-primary"
                  >
                    Open
                  </Link>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                <span>Travel {formatDate(booking.travelDate)}</span>
                <span>Paid {formatMoney(booking.paidAmount, booking.currency)}</span>
                <span>Total {formatMoney(booking.totalAmount, booking.currency)}</span>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-slate-50 p-8 text-center text-sm text-slate-500">
            {emptyText}
          </div>
        )}
      </div>
    </section>
  );
}

export default function CustomerDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);
        const response = await http.get("/api/customer/dashboard", {
          params: { tenantKey: "lanka-trails" },
        });

        if (active) {
          setDashboard((response.data?.data ?? null) as DashboardData | null);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load your dashboard.");
          setDashboard(null);
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
      { label: "Upcoming trips", value: dashboard?.summary.upcomingTrips ?? "0", icon: CalendarDays },
      { label: "Pending payments", value: dashboard?.summary.pendingPayments ?? "0", icon: CreditCard },
      { label: "Completed trips", value: dashboard?.summary.completedTrips ?? "0", icon: ShieldCheck },
      { label: "Reviews shared", value: dashboard?.summary.reviewCount ?? "0", icon: Star },
    ],
    [dashboard],
  );

  const tenantKey = dashboard?.tenant.key ?? "lanka-trails";
  const upcomingTrips = (dashboard?.bookings ?? []).filter((booking) =>
    ["confirmed", "pending", "checked_in"].includes(booking.bookingStatus) && booking.bookingStatus !== "cancelled",
  );
  const pendingPayments = (dashboard?.bookings ?? []).filter(
    (booking) => booking.paymentStatus !== "paid" && booking.bookingStatus !== "cancelled",
  );
  const completedTrips = (dashboard?.bookings ?? []).filter((booking) => booking.bookingStatus === "completed");

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
              <CustomerPortalAuthButton />
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
          <div className="mt-6 rounded-[1.75rem] border border-rose-200 bg-rose-50 p-5 text-rose-800">{error}</div>
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
                    <InfoPair label="Reference" value={dashboard.nextTrip.reference} />
                    <InfoPair label="Travel date" value={formatDate(dashboard.nextTrip.travelDate)} />
                    <InfoPair label="Destination" value={dashboard.nextTrip.destination} />
                    <InfoPair label="Travelers" value={String(dashboard.nextTrip.travelersCount)} />
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={buildTenantHref(tenantKey, `/customer/bookings/${dashboard.nextTrip.reference}`)}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Open booking
                  </Link>
                  {dashboard.nextTrip.paymentStatus !== "paid" ? (
                    <Link
                      href={buildTenantHref(tenantKey, `/customer/bookings/${dashboard.nextTrip.reference}?payment=open`)}
                      className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-title"
                    >
                      Pay full payment
                    </Link>
                  ) : null}
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
                    <Row label="Total amount" value={formatMoney(dashboard.nextTrip.totalAmount, dashboard.nextTrip.currency)} />
                    <Row label="Paid so far" value={formatMoney(dashboard.nextTrip.paidAmount, dashboard.nextTrip.currency)} />
                    <Row
                      label="Payment status"
                      value={dashboard.nextTrip.paymentStatus}
                      badgeClassName={badgeClass(dashboard.nextTrip.paymentStatus)}
                    />
                    <Row label="Payment due" value={formatDate(dashboard.nextTrip.paymentDueDate ?? dashboard.nextTrip.travelDate)} />
                    <Row label="Support contact" value={dashboard.nextTrip.supportContact} />
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

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <BookingList
            title="Upcoming trips"
            eyebrow="Booked"
            description="Confirmed or pending bookings that are still ahead of travel."
            items={upcomingTrips}
            emptyText="No upcoming trips yet."
            tenantKey={tenantKey}
          />
          <BookingList
            title="Pending payments"
            eyebrow="Action needed"
            description="Bookings that still need a payment settlement."
            items={pendingPayments}
            emptyText="No pending payments."
            tenantKey={tenantKey}
          />
          <BookingList
            title="Completed trips"
            eyebrow="Done"
            description="Trips that have already been completed."
            items={completedTrips}
            emptyText="No completed trips yet."
            tenantKey={tenantKey}
          />
        </div>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.75rem] border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Reviews shared</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-title">Your feedback history</h2>
              </div>
              <Link href={buildTenantHref(tenantKey, "/customer/reviews")} className="text-sm font-semibold text-primary">
                Leave review
              </Link>
            </div>

            <div className="mt-5 grid gap-4">
              {dashboard?.reviews?.length ? (
                dashboard.reviews.slice(0, 3).map((review) => (
                  <article key={review.id} className="rounded-2xl border border-border bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-title">{review.title}</h3>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                        {review.rating} star{review.rating === 1 ? "" : "s"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{review.message}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">
                      {formatDate(review.createdAt)}
                    </p>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-slate-50 p-8 text-center text-sm text-slate-500">
                  No reviews shared yet.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <InfoBlock
              icon={MapPinned}
              label="Upcoming trips"
              value={String(dashboard?.summary.upcomingTrips ?? 0)}
              detail="Trips already booked and still ahead of travel."
            />
            <InfoBlock
              icon={Ticket}
              label="Payment balance"
              value={String(dashboard?.summary.pendingPayments ?? 0)}
              detail="Bookings that need a settlement payment."
            />
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
          </div>
        </section>

        <section className="mt-6 rounded-[1.75rem] border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <MessageSquareText className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Support</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-title">Recent notes</h2>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {dashboard?.support.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border p-4">
                <p className="font-semibold text-title">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{item.detail}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">{formatDate(item.updatedAt)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[1.75rem] border border-border bg-slate-950 p-6 text-white shadow-sm">
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
      </Container>
    </CustomerDashboardCmsShell>
  );
}

function InfoPair({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 font-semibold text-title">{value}</p>
    </div>
  );
}

function Row({
  label,
  value,
  badgeClassName,
}: {
  label: string;
  value: string;
  badgeClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className={`font-semibold text-title ${badgeClassName ? `rounded-full px-3 py-1 text-xs ${badgeClassName}` : ""}`}>
        {value}
      </span>
    </div>
  );
}
