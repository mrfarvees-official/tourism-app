"use client";

import { useMemo, useState, type FormEvent } from "react";
import Container from "@/src/shared/ui/Container";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AddonSelector, BookingForm, PriceBreakdown, TravelerForm } from "@/src/shared/components/tourism";
import { http } from "@/src/api/config/http";

type BookingDraft = {
  tenantKey: string;
  customerName: string;
  customerEmail: string;
  destination: string;
  packageName: string;
  travelDate: string;
  returnDate: string;
  adults: number;
  children: number;
  infants: number;
  totalAmount: number;
  paidAmount: number;
  notes: string;
};

const initialDraft: BookingDraft = {
  tenantKey: "lanka-trails",
  customerName: "Ayesha Khan",
  customerEmail: "ayesha.khan@example.com",
  destination: "Sigiriya",
  packageName: "Sri Lanka Highlights",
  travelDate: "2026-08-14",
  returnDate: "2026-08-20",
  adults: 2,
  children: 0,
  infants: 0,
  totalAmount: 370000,
  paidAmount: 185000,
  notes: "Airport pickup needed.",
};

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function BookingStartPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<BookingDraft>(initialDraft);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addonTotal = useMemo(() => Math.round(draft.totalAmount * 0.12), [draft.totalAmount]);
  const totalTravelers = draft.adults + draft.children + draft.infants;

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await http.post(`/api/public/${encodeURIComponent(draft.tenantKey)}/bookings`, {
        customer_name: draft.customerName,
        customer_email: draft.customerEmail,
        package_name: draft.packageName,
        destination: draft.destination,
        travel_date: draft.travelDate,
        return_date: draft.returnDate,
        adults: draft.adults,
        children: draft.children,
        infants: draft.infants,
        total_amount: draft.totalAmount,
        paid_amount: draft.paidAmount,
        notes: draft.notes,
      });
      const payload = response.data?.data as
        | {
            reference?: string;
            booking_reference?: string;
            customer_name?: string;
            customer_email?: string;
            package_name?: string;
            destination?: string;
            travel_date?: string;
            return_date?: string;
            total_amount?: number;
            paid_amount?: number;
            status?: string;
            payment_status?: string;
          }
        | undefined;
      const bookingId = payload?.reference ?? payload?.booking_reference ?? "";
      router.push(
        `/booking/confirmation?bookingId=${encodeURIComponent(bookingId)}&customerName=${encodeURIComponent(payload?.customer_name ?? draft.customerName)}&customerEmail=${encodeURIComponent(payload?.customer_email ?? draft.customerEmail)}&packageName=${encodeURIComponent(payload?.package_name ?? draft.packageName)}&destination=${encodeURIComponent(payload?.destination ?? draft.destination)}&travelDate=${encodeURIComponent(payload?.travel_date ?? draft.travelDate)}&totalAmount=${encodeURIComponent(String(payload?.total_amount ?? draft.totalAmount))}&paidAmount=${encodeURIComponent(String(payload?.paid_amount ?? draft.paidAmount))}&bookingStatus=${encodeURIComponent(payload?.status ?? "pending")}&paymentStatus=${encodeURIComponent(payload?.payment_status ?? "unpaid")}`,
      );
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to create booking.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container className="py-8 sm:py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <BookingForm
          title="Start a booking request"
          description="Collect customer details, travelers, and add-ons before you submit a live booking into the backend."
          onSubmit={submitBooking}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Tenant key" value={draft.tenantKey} onChange={(value) => setDraft((current) => ({ ...current, tenantKey: value }))} />
            <Field label="Customer name" value={draft.customerName} onChange={(value) => setDraft((current) => ({ ...current, customerName: value }))} />
            <Field label="Customer email" value={draft.customerEmail} onChange={(value) => setDraft((current) => ({ ...current, customerEmail: value }))} />
            <Field label="Destination" value={draft.destination} onChange={(value) => setDraft((current) => ({ ...current, destination: value }))} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Package" value={draft.packageName} onChange={(value) => setDraft((current) => ({ ...current, packageName: value }))} />
            <Field label="Notes" value={draft.notes} onChange={(value) => setDraft((current) => ({ ...current, notes: value }))} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field type="date" label="Travel date" value={draft.travelDate} onChange={(value) => setDraft((current) => ({ ...current, travelDate: value }))} />
            <Field type="date" label="Return date" value={draft.returnDate} onChange={(value) => setDraft((current) => ({ ...current, returnDate: value }))} />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Adults", "adults"],
              ["Children", "children"],
              ["Infants", "infants"],
            ].map(([label, key]) => (
              <label key={label} className="grid gap-2 text-sm font-medium">
                <span>{label}</span>
                <input
                  className="h-11 rounded-xl border border-border px-3"
                  type="number"
                  min="0"
                  value={draft[key as keyof Pick<BookingDraft, "adults" | "children" | "infants">]}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      [key]: Number(event.target.value || 0),
                    }))
                  }
                />
              </label>
            ))}
          </div>

          <TravelerForm>
            <h3 className="text-lg font-semibold text-title">Traveler overview</h3>
            <p className="mt-1 text-sm text-slate-600">
              This booking will submit {totalTravelers} traveler{totalTravelers === 1 ? "" : "s"} to the backend API.
            </p>
          </TravelerForm>

          <AddonSelector>
            <h3 className="text-lg font-semibold text-title">Booking notes</h3>
            <p className="mt-1 text-sm text-slate-600">
              Use the notes field for pickup changes, dietary requests, or room preferences before submission.
            </p>
          </AddonSelector>

          {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800">{error}</div> : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit booking"}
            </button>
            <Link href="/customer/bookings" className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-title">
              View bookings
            </Link>
          </div>
        </BookingForm>

        <PriceBreakdown
          subtotal={currency(Math.max(draft.totalAmount - addonTotal, 0))}
          addonTotal={currency(addonTotal)}
          discountTotal="LKR 0"
          taxTotal="LKR 0"
          total={currency(draft.totalAmount)}
        />
      </div>
    </Container>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      <span>{label}</span>
      <input className="h-11 rounded-xl border border-border px-3" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
