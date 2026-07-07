"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Container from "@/src/shared/ui/Container";
import { http } from "@/src/api/config/http";
import { ArrowRight, CalendarDays, CreditCard, Search } from "lucide-react";

type Booking = {
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
};

function formatDate(value: string) {
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

function tone(status: string) {
  switch (status) {
    case "confirmed":
    case "paid":
    case "completed":
      return "bg-emerald-100 text-emerald-700";
    case "pending":
    case "partial":
      return "bg-amber-100 text-amber-800";
    case "cancelled":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadBookings() {
      try {
        setLoading(true);
        setError(null);
        const response = await http.get("/api/customer/bookings", {
          params: { tenantKey: "lanka-trails" },
        });
        if (active) {
          setBookings((response.data?.data ?? []) as Booking[]);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load bookings.");
          setBookings([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadBookings();

    return () => {
      active = false;
    };
  }, []);

  const filteredBookings = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return bookings;

    return bookings.filter((booking) =>
      [booking.reference, booking.packageName, booking.destination, booking.bookingStatus, booking.paymentStatus]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [bookings, query]);

  const totals = useMemo(
    () => ({
      upcoming: bookings.filter((booking) => ["confirmed", "pending"].includes(booking.bookingStatus)).length,
      paid: bookings.filter((booking) => booking.paymentStatus === "paid").length,
      revenue: bookings.reduce((sum, booking) => sum + booking.paidAmount, 0),
    }),
    [bookings],
  );

  return (
    <Container className="py-8 sm:py-12">
      <section className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Customer bookings</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-title sm:text-5xl">
              Manage every trip in one place
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              Check dates, payment status, traveler counts, and notes without opening multiple screens.
            </p>
          </div>
          <Link href="/booking/start" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white">
            Start a booking
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["Bookings", loading ? "..." : String(bookings.length), CalendarDays],
            ["Paid", loading ? "..." : String(totals.paid), CreditCard],
            ["Revenue", loading ? "..." : formatMoney(totals.revenue, "LKR"), CreditCard],
          ].map(([label, value, Icon]) => (
            <div key={label as string} className="rounded-2xl border border-border bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
                  <p className="mt-2 text-2xl font-semibold text-title">{value as string}</p>
                </div>
                <div className="rounded-2xl bg-white p-3 text-slate-700">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex items-center gap-3 rounded-2xl border border-border bg-slate-50 px-4 py-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by reference, package, or destination"
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
          <p className="text-sm text-slate-500">
            {loading ? "Loading bookings..." : `${filteredBookings.length} matching booking${filteredBookings.length === 1 ? "" : "s"}`}
          </p>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800">{error}</div>
        ) : null}

        <div className="mt-6 grid gap-4">
          {filteredBookings.map((booking) => (
            <article key={booking.id} className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold text-title">{booking.reference}</h2>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone(booking.bookingStatus)}`}>
                      {booking.bookingStatus}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone(booking.paymentStatus)}`}>
                      {booking.paymentStatus}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-primary">{booking.packageName}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{booking.destination}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span>Travel: {formatDate(booking.travelDate)}</span>
                    <span>Return: {formatDate(booking.returnDate)}</span>
                    <span>Travelers: {booking.travelersCount}</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 lg:w-64">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Amount</p>
                  <p className="mt-2 text-2xl font-semibold text-title">
                    {formatMoney(booking.totalAmount, booking.currency)}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Paid {formatMoney(booking.paidAmount, booking.currency)}
                  </p>
                  <Link
                    href={`/customer/bookings/${booking.reference}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                  >
                    Open details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}

          {!loading && filteredBookings.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-border bg-slate-50 p-8 text-center text-slate-600">
              No bookings match your search.
            </div>
          ) : null}
        </div>
      </section>
    </Container>
  );
}
