"use client";

import { useState, type FormEvent } from "react";
import { bookingService } from "@/src/api/services/bookingService";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/shared/components/dailog";

type Props = {
  tenantKey: string;
  bookingId: string;
  reference: string;
  amountDue: number;
  currency: string;
  initialPaidAmount: number;
  paymentStatus: string;
  defaultOpen?: boolean;
};

type CardBrand = "visa" | "mastercard" | "credit_card" | "american_express";

const initialForm = {
  cardholderName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
  brand: "visa" as CardBrand,
};

export default function BookingSettlementCard({
  tenantKey,
  bookingId,
  reference,
  amountDue,
  currency,
  initialPaidAmount,
  paymentStatus,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [paid, setPaid] = useState(paymentStatus === "paid");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);

  const remainingAmount = Math.max(amountDue, 0);
  const fullyPaidAmount = Math.max(initialPaidAmount + remainingAmount, 0);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      if (!form.cardholderName.trim() || !form.cardNumber.trim() || !form.expiry.trim() || !form.cvc.trim()) {
        throw new Error("Fill in the card details to settle the payment.");
      }

      const response = await bookingService.settleCustomerPayment(tenantKey, bookingId, {
        payment_method: "card",
        payment_brand: form.brand,
        card_last4: form.cardNumber.replace(/\D/g, "").slice(-4),
        card_holder_name: form.cardholderName,
        amount: remainingAmount,
        status: "paid",
      });

      const settled = response.data?.data as { payment_status?: string; paid_amount?: number } | undefined;
      setPaid((settled?.payment_status ?? "paid") === "paid");
      setMessage(`Payment success for ${reference}. The booking is now marked as paid.`);
      setOpen(false);
      setForm(initialForm);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to settle payment.");
    } finally {
      setSubmitting(false);
    }
  }

  if (paid || remainingAmount <= 0) {
    return (
      <section className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
        <p className="text-xs uppercase tracking-[0.24em] text-emerald-700">Payment complete</p>
        <h2 className="mt-2 text-xl font-semibold">This booking is fully paid</h2>
        <p className="mt-2 text-sm leading-6 text-emerald-800">
          The backend has already recorded the full payment for {reference}.
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="rounded-[1.75rem] border border-border bg-slate-950 p-5 text-white">
        <p className="text-xs uppercase tracking-[0.24em] text-white/55">Settle payment</p>
        <h2 className="mt-2 text-xl font-semibold">Pay the remaining balance</h2>
        <p className="mt-2 text-sm leading-6 text-white/70">
          Open the card popup to pay the rest of the booking balance. This will mark the booking as paid in the backend.
        </p>

        <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75 md:grid-cols-3">
          <Stat label="Booking" value={reference} />
          <Stat label="Paid so far" value={formatMoney(initialPaidAmount, currency)} />
          <Stat label="Balance due" value={formatMoney(remainingAmount, currency)} />
        </div>

        {message ? <div className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white">{message}</div> : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950"
          >
            Pay full payment
          </button>
          <span className="text-sm text-white/55">Card popup opens for the full remaining 90%.</span>
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="left-1/2 top-1/2 w-[calc(100%-1.5rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.75rem] border border-border bg-[#f8f0df] p-0 text-slate-900 shadow-2xl"
        >
          <div className="border-b border-black/5 bg-white/70 px-5 py-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Card payment</DialogTitle>
              <DialogDescription className="text-sm text-slate-600">
                Pay the remaining balance for {reference}. The backend will record the payment and mark the booking as paid.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={submit} className="grid gap-5 px-5 py-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Cardholder name" value={form.cardholderName} onChange={(value) => setForm((current) => ({ ...current, cardholderName: value }))} />
              <Field label="Card number" value={form.cardNumber} onChange={(value) => setForm((current) => ({ ...current, cardNumber: value }))} />
              <Field label="Expiry" value={form.expiry} onChange={(value) => setForm((current) => ({ ...current, expiry: value }))} />
              <Field label="CVC" value={form.cvc} onChange={(value) => setForm((current) => ({ ...current, cvc: value }))} />
              <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                <span>Card brand</span>
                <select
                  value={form.brand}
                  onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value as CardBrand }))}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-slate-900 outline-none"
                >
                  <option value="visa">VISA</option>
                  <option value="mastercard">MASTER Card</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="american_express">American Express</option>
                </select>
              </label>
            </div>

            <div className="grid gap-3 rounded-2xl border border-white/40 bg-white/70 p-4 text-sm text-slate-700 md:grid-cols-3">
              <Stat label="Booking" value={reference} tone="slate" />
              <Stat label="Charge" value={formatMoney(remainingAmount, currency)} tone="slate" />
              <Stat label="Fully paid total" value={formatMoney(fullyPaidAmount, currency)} tone="slate" />
            </div>

            {message ? <div className="rounded-2xl bg-slate-950 px-4 py-3 text-sm text-white">{message}</div> : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {submitting ? "Processing..." : "Pay full payment now"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-slate-900 outline-none"
      />
    </label>
  );
}

function Stat({ label, value, tone = "white" }: { label: string; value: string; tone?: "white" | "slate" }) {
  const labelClass = tone === "white" ? "text-white/50" : "text-slate-400";
  const valueClass = tone === "white" ? "text-white" : "text-slate-900";

  return (
    <div>
      <p className={`text-[11px] uppercase tracking-[0.22em] ${labelClass}`}>{label}</p>
      <p className={`mt-1 font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}
