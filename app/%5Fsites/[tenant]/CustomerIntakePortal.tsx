"use client";

import React, { useMemo, useState } from "react";
import { useContactSettings } from "@/src/api/hooks/settings/useContactSettings";
import {
  buildPayPalSandboxUrl,
  decodeCustomerPortalSession,
  isCustomerPortalSessionExpired,
  type CustomerPortalSession,
} from "@/src/utils/customerPortal";

type Props = {
  tenant: string;
  token?: string;
};

type TravelerRow = {
  full_name: string;
  date_of_birth: string;
  nationality: string;
  passport_number: string;
  passport_expiry: string;
  visa_type: string;
  gender: string;
};

type PrimaryContact = {
  name: string;
  email: string;
  phone: string;
  nationality: string;
  passport_number: string;
  visa_type: string;
  notes: string;
};

const emptyTraveler = (): TravelerRow => ({
  full_name: "",
  date_of_birth: "",
  nationality: "",
  passport_number: "",
  passport_expiry: "",
  visa_type: "",
  gender: "",
});

const emptyPrimary = (): PrimaryContact => ({
  name: "",
  email: "",
  phone: "",
  nationality: "",
  passport_number: "",
  visa_type: "",
  notes: "",
});

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-28 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
      />
    </label>
  );
}

function ExpiredView({ tenant }: { tenant: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4efe7] px-6 text-slate-900">
      <div className="max-w-lg rounded-[2rem] border border-slate-200 bg-white px-8 py-10 text-center shadow-xl">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{tenant}</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Link expired</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          This customer intake session has expired. The page is no longer available.
        </p>
      </div>
    </main>
  );
}

export default function CustomerIntakePortal({ tenant, token }: Props) {
  const session = useMemo<CustomerPortalSession | null>(
    () => decodeCustomerPortalSession(token),
    [token],
  );
  const expired = !session || isCustomerPortalSessionExpired(session);
  const { settings, loading: settingsLoading } = useContactSettings(tenant);
  const [primaryContact, setPrimaryContact] = useState<PrimaryContact>(() =>
    emptyPrimary(),
  );
  const [travelers, setTravelers] = useState<TravelerRow[]>(() => [emptyTraveler()]);
  const [partialPaymentAmount, setPartialPaymentAmount] = useState(
    session?.partialPaymentAmount ?? settings.payment_partial_amount ?? "100",
  );
  const [status, setStatus] = useState<{
    type: "idle" | "saving" | "success" | "error";
    message: string;
    paymentUrl?: string;
  }>({ type: "idle", message: "" });
  const [currentUrl, setCurrentUrl] = useState("");

  React.useEffect(() => {
    if (!session) return;

    setPrimaryContact((current) => ({
      ...current,
      name: session.customerName ?? current.name,
      email: session.customerEmail ?? current.email,
      phone: session.customerPhone ?? current.phone,
      notes: session.note ?? current.notes,
    }));
    setPartialPaymentAmount(session.partialPaymentAmount ?? settings.payment_partial_amount ?? "100");
  }, [session, settings.payment_partial_amount]);

  React.useEffect(() => {
    if (!session?.prefill) return;

    setPrimaryContact((current) => ({
      ...current,
      name: session.prefill?.name ?? current.name,
      email: session.prefill?.email ?? current.email,
      phone: session.prefill?.phone ?? current.phone,
      notes:
        session.prefill?.message ??
        session.prefill?.subject ??
        session.note ??
        current.notes,
      visa_type: session.prefill?.subject ?? current.visa_type,
    }));
  }, [session?.prefill, session?.note]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  if (expired) {
    return <ExpiredView tenant={tenant} />;
  }

  const addTraveler = () => setTravelers((current) => [...current, emptyTraveler()]);
  const updateTraveler = (index: number, key: keyof TravelerRow, value: string) => {
    setTravelers((current) =>
      current.map((traveler, travelerIndex) =>
        travelerIndex === index ? { ...traveler, [key]: value } : traveler,
      ),
    );
  };
  const removeTraveler = (index: number) => {
    setTravelers((current) => (current.length === 1 ? current : current.filter((_, i) => i !== index)));
  };

  const paymentBusinessEmail = settings.payment_business_email?.trim();
  const currency = "LKR";
  const paymentLabel = settings.payment_brand_name?.trim() || session.brandName || tenant;

  const paymentUrl =
    status.paymentUrl ??
    (paymentBusinessEmail
      ? buildPayPalSandboxUrl({
          businessEmail: paymentBusinessEmail,
          amount: partialPaymentAmount || settings.payment_partial_amount || "100",
          currency,
          itemName: `${paymentLabel} partial payment`,
          returnUrl: currentUrl || undefined,
          cancelUrl: currentUrl || undefined,
          custom: session.sessionId,
        })
      : "");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (settingsLoading) {
      return;
    }

    setStatus({ type: "saving", message: "Submitting customer details..." });

    try {
      const response = await fetch("/api/customer-intakes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          primaryContact,
          travelers,
          paymentUrl,
          paymentStatus: paymentBusinessEmail ? "pending" : "not_required",
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { data?: Record<string, unknown>; error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Failed to submit customer details.");
      }

      setStatus({
        type: "success",
        message: "Customer information saved. Continue to sandbox payment when ready.",
        paymentUrl,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to submit customer details.",
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#f5efe6] text-slate-900">
      <div className="w-full">
        <section className="border-b border-black/10 bg-[#0f1720] px-5 py-6 text-white sm:px-8 lg:px-12">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">{tenant}</p>
              <h1 className="max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Customer visa intake and partial payment
              </h1>
              <p className="max-w-4xl text-sm leading-7 text-white/70 sm:text-base">
                Fill in every traveler&apos;s details, then continue to the sandbox payment flow for the partial amount.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:max-w-4xl">
              {[
                ["Session", "24 hours"],
                ["Gateway", settings.payment_provider ?? "paypal_sandbox"],
                ["Currency", currency],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">{label}</p>
                  <p className="mt-2 text-sm font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-5 sm:px-8 lg:px-12">
          <section className="rounded-[1.75rem] border border-slate-200 bg-white px-5 py-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="rounded-2xl border border-slate-200 bg-[#fbfaf7] px-4 py-3 text-sm text-slate-600">
                Session expires on {new Date(session.expiresAt).toLocaleString()}.
              </div>
              <div className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Complete all fields before payment
              </div>
            </div>
          </section>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <section className="rounded-[1.75rem] border border-slate-200 bg-white px-5 py-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <div className="mb-5 flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">Primary contact</h2>
                  <p className="text-sm text-slate-500">Use the main booking contact details.</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field
                  label="Full name"
                  value={primaryContact.name}
                  onChange={(value) => setPrimaryContact((current) => ({ ...current, name: value }))}
                  placeholder="Customer name"
                />
                <Field
                  label="Email"
                  value={primaryContact.email}
                  onChange={(value) => setPrimaryContact((current) => ({ ...current, email: value }))}
                  type="email"
                  placeholder="customer@example.com"
                />
                <Field
                  label="Phone"
                  value={primaryContact.phone}
                  onChange={(value) => setPrimaryContact((current) => ({ ...current, phone: value }))}
                  placeholder="+94..."
                />
                <Field
                  label="Nationality"
                  value={primaryContact.nationality}
                  onChange={(value) =>
                    setPrimaryContact((current) => ({ ...current, nationality: value }))
                  }
                  placeholder="Sri Lankan"
                />
                <Field
                  label="Passport number"
                  value={primaryContact.passport_number}
                  onChange={(value) =>
                    setPrimaryContact((current) => ({ ...current, passport_number: value }))
                  }
                  placeholder="N1234567"
                />
                <Field
                  label="Visa type"
                  value={primaryContact.visa_type}
                  onChange={(value) =>
                    setPrimaryContact((current) => ({ ...current, visa_type: value }))
                  }
                  placeholder="Tourist visa"
                />
              </div>

              <div className="mt-4">
                <TextAreaField
                  label="Notes"
                  value={primaryContact.notes}
                  onChange={(value) =>
                    setPrimaryContact((current) => ({ ...current, notes: value }))
                  }
                  placeholder="Trip notes, arrival city, or any special requirements"
                />
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 bg-white px-5 py-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Travelers</h2>
                  <p className="text-sm text-slate-500">Add one row for each person in the booking.</p>
                </div>
                <button
                  type="button"
                  onClick={addTraveler}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Add person
                </button>
              </div>

              <div className="space-y-4">
                {travelers.map((traveler, index) => (
                  <div
                    key={`traveler-${index}`}
                    className="rounded-[1.5rem] border border-slate-200 bg-[#fcfbf8] p-4"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-slate-800">Person {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeTraveler(index)}
                        className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      <Field
                        label="Full name"
                        value={traveler.full_name}
                        onChange={(value) => updateTraveler(index, "full_name", value)}
                        placeholder="Traveler name"
                      />
                      <Field
                        label="Date of birth"
                        value={traveler.date_of_birth}
                        onChange={(value) => updateTraveler(index, "date_of_birth", value)}
                        type="date"
                      />
                      <Field
                        label="Nationality"
                        value={traveler.nationality}
                        onChange={(value) => updateTraveler(index, "nationality", value)}
                        placeholder="Nationality"
                      />
                      <Field
                        label="Gender"
                        value={traveler.gender}
                        onChange={(value) => updateTraveler(index, "gender", value)}
                        placeholder="Gender"
                      />
                      <Field
                        label="Passport number"
                        value={traveler.passport_number}
                        onChange={(value) => updateTraveler(index, "passport_number", value)}
                        placeholder="Passport number"
                      />
                      <Field
                        label="Passport expiry"
                        value={traveler.passport_expiry}
                        onChange={(value) => updateTraveler(index, "passport_expiry", value)}
                        type="date"
                      />
                      <div className="xl:col-span-3">
                        <Field
                          label="Visa type"
                          value={traveler.visa_type}
                          onChange={(value) => updateTraveler(index, "visa_type", value)}
                          placeholder="Tourist / business / transit"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-[#e7d9c1] bg-[#f8f0df] px-5 py-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <h2 className="text-xl font-semibold">Partial payment</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Use the sandbox gateway to collect the deposit after the form is saved.
                  </p>
                </div>
                <div className="min-w-[240px]">
                  <Field
                    label="Amount"
                    value={partialPaymentAmount}
                    onChange={setPartialPaymentAmount}
                    type="number"
                    placeholder={settings.payment_partial_amount ?? "100"}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-[#0f1720] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Save details
                </button>
                {paymentBusinessEmail ? (
                  <a
                    href={paymentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Continue to sandbox payment
                  </a>
                ) : (
                  <span className="text-sm text-slate-500">
                    Configure the PayPal sandbox business email first.
                  </span>
                )}
              </div>

              {status.type !== "idle" ? (
                <p
                  className={[
                    "mt-4 text-sm",
                    status.type === "error" ? "text-red-700" : "text-emerald-700",
                  ].join(" ")}
                >
                  {status.message}
                </p>
              ) : null}
            </section>
          </form>
        </div>
      </div>
    </main>
  );
}
