import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/src/shared/ui/Container";
import { ArrowLeft, CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import { http } from "@/src/api/config/http";
import BookingSettlementCard from "./BookingSettlementCard";
import CustomerPortalAuthButton from "@/src/shared/common/CustomerPortalAuthButton";

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

export default async function CustomerBookingDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ payment?: string }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const response = await http.get(`/api/customer/bookings/${encodeURIComponent(id)}`, {
    params: { tenantKey: "lanka-trails" },
  });
  const booking = response.data?.data as
    | {
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
        paymentDueDate: string;
        notes: string;
        addOns: string[];
        supportContact: string;
        itinerary: string[];
      }
        | null;

  if (!booking) {
    notFound();
  }

  return (
    <Container className="py-8 sm:py-12">
      <div className="flex items-center justify-between gap-3">
        <Link href="/customer/bookings" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" />
          Back to bookings
        </Link>
        <CustomerPortalAuthButton compact surface="light" />
      </div>

      <section className="mt-4 rounded-[2rem] border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Booking details</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-title">
              {booking.reference}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              Review trip logistics, payment progress, traveler counts, and the next action without leaving the page.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone(booking.bookingStatus)}`}>
              {booking.bookingStatus}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone(booking.paymentStatus)}`}>
              {booking.paymentStatus}
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-border bg-slate-50 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Info label="Package" value={booking.packageName} />
                <Info label="Destination" value={booking.destination} />
                <Info label="Travel date" value={formatDate(booking.travelDate)} />
                <Info label="Return date" value={formatDate(booking.returnDate)} />
                <Info label="Travelers" value={String(booking.travelersCount)} />
                <Info label="Payment due" value={formatDate(booking.paymentDueDate)} />
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-border bg-white p-5">
              <h2 className="text-xl font-semibold text-title">Itinerary</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {booking.itinerary.map((item, index) => (
                  <div key={item} className="rounded-2xl border border-border bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Stop {index + 1}</p>
                    <p className="mt-2 font-semibold text-title">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-border bg-white p-5">
              <h2 className="text-xl font-semibold text-title">Payment summary</h2>
              <div className="mt-4 space-y-3 text-sm">
                <Row label="Total" value={formatMoney(booking.totalAmount, booking.currency)} />
                <Row label="Paid" value={formatMoney(booking.paidAmount, booking.currency)} />
                <Row label="Balance" value={formatMoney(Math.max(booking.totalAmount - booking.paidAmount, 0), booking.currency)} />
              </div>
              <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                {booking.notes || "No booking notes recorded."}
              </div>
            </div>

            {booking.paymentStatus !== "paid" ? (
              <BookingSettlementCard
                tenantKey="lanka-trails"
                bookingId={id}
                reference={booking.reference}
                amountDue={Math.max(booking.totalAmount - booking.paidAmount, 0)}
                currency={booking.currency}
                initialPaidAmount={booking.paidAmount}
                paymentStatus={booking.paymentStatus}
                defaultOpen={resolvedSearchParams.payment === "open"}
              />
            ) : null}

            <div className="rounded-[1.75rem] border border-border bg-white p-5">
              <h2 className="text-xl font-semibold text-title">Quick contacts</h2>
              <div className="mt-4 space-y-3 text-sm">
                <a href={`mailto:${booking.supportContact}`} className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3">
                  <Mail className="h-4 w-4 text-primary" />
                  {booking.supportContact}
                </a>
                <a href="tel:+94771234567" className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3">
                  <Phone className="h-4 w-4 text-primary" />
                  Call support
                </a>
                <div className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  {booking.destination}
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  {booking.reference}
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-border bg-slate-950 p-5 text-white">
              <h2 className="text-xl font-semibold">Next step</h2>
              <p className="mt-3 text-sm leading-6 text-white/75">
                Use this booking page to confirm pickup details, settle payment, or request changes before travel.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/booking/start" className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950">
                  New booking
                </Link>
                <Link href="/customer/reviews" className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white">
                  Leave review
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 font-semibold text-title">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-title">{value}</span>
    </div>
  );
}
