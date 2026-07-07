import Container from "@/src/shared/ui/Container";
import { BookingStatusBadge, PaymentStatusBadge } from "@/src/shared/components/tourism";
import Link from "next/link";

function firstValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function formatMoney(value: string | number | undefined) {
  const amount = typeof value === "number" ? value : Number(value ?? 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export default async function BookingConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const bookingReference = firstValue(params.bookingId) ?? "TBK-2026-000000";
  const customerName = firstValue(params.customerName) ?? "Customer";
  const customerEmail = firstValue(params.customerEmail) ?? "unknown@example.com";
  const packageName = firstValue(params.packageName) ?? "Custom Booking";
  const destination = firstValue(params.destination) ?? "Sri Lanka";
  const travelDate = firstValue(params.travelDate) ?? "";
  const totalAmount = firstValue(params.totalAmount) ?? "0";
  const paidAmount = firstValue(params.paidAmount) ?? "0";
  const bookingStatus = firstValue(params.bookingStatus) ?? "pending";
  const paymentStatus = firstValue(params.paymentStatus) ?? "unpaid";

  return (
    <Container className="py-10 sm:py-14">
      <section className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Confirmation</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-title sm:text-5xl">
          Booking received
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Your booking was sent to the backend API and the reference below can be used for follow-up.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <BookingStatusBadge value={bookingStatus} tone="warning" />
          <PaymentStatusBadge value={paymentStatus} tone="danger" />
        </div>

        <dl className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            ["Reference", bookingReference],
            ["Customer", customerName],
            ["Email", customerEmail],
            ["Travel date", travelDate || "Not set"],
            ["Package", packageName],
            ["Destination", destination],
            ["Total", formatMoney(totalAmount)],
            ["Paid", formatMoney(paidAmount)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-border bg-slate-50 p-4">
              <dt className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</dt>
              <dd className="mt-2 text-sm font-semibold text-title">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/customer/bookings" className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white">
            View bookings
          </Link>
          <Link href="/booking/start" className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-title">
            Start another booking
          </Link>
        </div>
      </section>
    </Container>
  );
}

