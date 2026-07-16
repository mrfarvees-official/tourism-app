"use client";

import React, { useMemo, useState } from "react";
import { bookingService } from "@/src/api/services/bookingService";
import { activityService } from "@/src/api/services/activityService";
import { destinationService } from "@/src/api/services/destinationService";
import { packageService } from "@/src/api/services/packageService";
import { useContactSettings } from "@/src/api/hooks/settings/useContactSettings";
import { tourismServiceService } from "@/src/api/services/tourismServiceService";
import {
  decodeCustomerPortalSession,
  isCustomerPortalSessionExpired,
  type CustomerPortalSession,
} from "@/src/utils/customerPortal";
import type { TourismItem } from "@/src/shared/tourism/demoData";

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

type TripCategory = "destination" | "package" | "service" | "activity";

type CardBrand = "visa" | "mastercard" | "credit_card" | "american_express";

type CardDraft = {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  brand: CardBrand;
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

const initialCardDraft: CardDraft = {
  cardholderName: "Ayesha Khan",
  cardNumber: "4111 1111 1111 1111",
  expiry: "12/29",
  cvc: "123",
  brand: "visa",
};

const categoryLabels: Record<TripCategory, string> = {
  destination: "Destination",
  package: "Package",
  service: "Service",
  activity: "Activity",
};

function parseAmount(value?: string | number | null) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const normalized = String(value ?? "");
  const amount = Number(normalized.replace(/[^0-9.-]+/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

function readItems(payload: unknown): TourismItem[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload as TourismItem[];
  }

  const record = payload as { data?: unknown; items?: unknown; destinations?: unknown; packages?: unknown; services?: unknown; activities?: unknown };
  if (Array.isArray(record.data)) {
    return record.data as TourismItem[];
  }
  if (Array.isArray(record.items)) {
    return record.items as TourismItem[];
  }
  if (Array.isArray(record.destinations)) {
    return record.destinations as TourismItem[];
  }
  if (Array.isArray(record.packages)) {
    return record.packages as TourismItem[];
  }
  if (Array.isArray(record.services)) {
    return record.services as TourismItem[];
  }
  if (Array.isArray(record.activities)) {
    return record.activities as TourismItem[];
  }

  return [];
}

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

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: TourismItem[];
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
      >
        {options.length === 0 ? <option value="">No options available</option> : null}
        {options.map((item) => (
          <option key={item.slug} value={item.slug}>
            {item.title}
          </option>
        ))}
      </select>
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function formatMoney(value: number, currency = "LKR") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
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
  }>({ type: "idle", message: "" });
  const [activeCategory, setActiveCategory] = useState<TripCategory>("package");
  const [items, setItems] = useState<TourismItem[]>([]);
  const [cardDraft, setCardDraft] = useState<CardDraft>(initialCardDraft);
  const [selectedSlug, setSelectedSlug] = useState("");

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
    let active = true;

    const loadItems = async () => {
      try {
        const response =
          activeCategory === "destination"
            ? await destinationService.list(tenant)
            : activeCategory === "package"
              ? await packageService.list(tenant)
              : activeCategory === "service"
                ? await tourismServiceService.list(tenant)
                : await activityService.list(tenant);

        if (!active) {
          return;
        }

        const nextItems = readItems(response.data?.data ?? response.data);
        setItems(nextItems);
        setSelectedSlug(nextItems[0]?.slug ?? "");
      } catch {
        if (active) {
          setItems([]);
        }
      }
    };

    void loadItems();

    return () => {
      active = false;
    };
  }, [activeCategory, tenant]);

  if (expired) {
    return <ExpiredView tenant={tenant} />;
  }

  const selectedItem = items.find((item) => item.slug === selectedSlug) ?? items[0];
  const selectedTotal = Math.max(parseAmount(selectedItem?.amount), 0);
  const depositAmount = Math.max(Math.round(selectedTotal * 0.1), 0);
  const cardDigits = cardDraft.cardNumber.replace(/\D/g, "");
  const paymentReady = Boolean(
    cardDraft.cardholderName.trim() &&
      cardDigits.length >= 13 &&
      cardDraft.expiry.trim() &&
      cardDraft.cvc.trim().length >= 3 &&
      selectedTotal > 0,
  );

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (settingsLoading) {
      return;
    }

    setStatus({ type: "saving", message: "Submitting customer details..." });

    try {
      const response = await bookingService.createPublic(tenant, {
        customer_name: primaryContact.name || session?.customerName || "Customer",
        customer_email: primaryContact.email || session?.customerEmail || "",
        customer_phone: primaryContact.phone || session?.customerPhone || "",
        destination: activeCategory === "destination" ? (selectedItem?.title ?? "Sri Lanka") : "",
        destination_slug: activeCategory === "destination" ? (selectedItem?.slug ?? "") : "",
        package_name: activeCategory === "package" ? (selectedItem?.title ?? "Custom Booking") : "",
        package_slug: activeCategory === "package" ? (selectedItem?.slug ?? "") : "",
        service_name: activeCategory === "service" ? (selectedItem?.title ?? "") : "",
        service_slug: activeCategory === "service" ? (selectedItem?.slug ?? "") : "",
        activity_name: activeCategory === "activity" ? (selectedItem?.title ?? "") : "",
        activity_slug: activeCategory === "activity" ? (selectedItem?.slug ?? "") : "",
        travel_date: session?.createdAt ? new Date(session.createdAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        return_date: session?.expiresAt ? new Date(session.expiresAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        adults: travelers.length || 1,
        children: 0,
        infants: 0,
        travelers_count: travelers.length || 1,
        total_amount: selectedTotal,
        paid_amount: depositAmount,
        booking_status: "pending",
        payment_status: "partial",
        payment_amount: depositAmount,
        payment_method: "card",
        payment_brand: cardDraft.brand,
        card_last4: cardDigits.slice(-4),
        card_holder_name: cardDraft.cardholderName,
        notes: primaryContact.notes || session?.note || "",
        route_summary: selectedItem?.title ?? "",
        trip_story: String(selectedItem?.fields?.story ?? ""),
        trip_highlights: [selectedItem?.fields?.highlights, selectedItem?.fields?.includes, selectedItem?.fields?.coverage].filter(Boolean),
        add_ons: [selectedItem?.fields?.includes, selectedItem?.fields?.coverage].filter(Boolean),
        itinerary: [selectedItem?.title].filter((value): value is string => Boolean(value)),
        destination_story: activeCategory === "destination" ? String(selectedItem?.fields?.story ?? "") : "",
        package_story: activeCategory === "package" ? String(selectedItem?.fields?.story ?? "") : "",
        service_story: activeCategory === "service" ? String(selectedItem?.fields?.story ?? "") : "",
        activity_story: activeCategory === "activity" ? String(selectedItem?.fields?.story ?? "") : "",
        support_contact: settings.reply_to_email || settings.email || "support@lankatrails.example",
        token,
      });

      const payload = response.data?.data as { reference?: string; booking_reference?: string } | undefined;
      const bookingReference = payload?.reference ?? payload?.booking_reference ?? "booking";
      setStatus({
        type: "success",
        message: `Booking ${bookingReference} created and deposit recorded.`,
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
                Fill in every traveler&apos;s details, select the trip components, then complete the dummy card deposit.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:max-w-4xl">
              {[
                ["Session", "24 hours"],
                ["Mode", "Dummy card"],
                ["Currency", "LKR"],
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
              <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Trip selection</h2>
                  <p className="text-sm text-slate-500">
                    Choose one category, then pick the backend item you want to book.
                  </p>
                </div>
                <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  10% deposit
                </div>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {(Object.keys(categoryLabels) as TripCategory[]).map((category) => {
                  const isActive = activeCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                      }`}
                    >
                      {categoryLabels[category]}
                    </button>
                  );
                })}
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <SelectField
                  label={categoryLabels[activeCategory]}
                  value={selectedSlug}
                  onChange={setSelectedSlug}
                  options={items}
                />
                <div className="rounded-[1.5rem] bg-[#fbfaf7] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Selection summary</p>
                  <div className="mt-3 space-y-2 text-sm text-slate-700">
                    <p className="font-medium text-slate-900">{selectedItem?.title ?? "No item selected"}</p>
                    <p>{selectedItem?.subtitle ?? "Items load directly from the backend for the active category."}</p>
                    <p className="text-slate-500">
                      Amount: {selectedItem ? formatMoney(selectedTotal) : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Selected total</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{formatMoney(selectedTotal)}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Deposit due</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{formatMoney(depositAmount)}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Travelers</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{travelers.length}</p>
                </div>
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
                  <h2 className="text-xl font-semibold">Card payment</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    This is a dummy card checkout. When you press pay, the booking and the 10% deposit are recorded in the backend.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Stat label="Total" value={formatMoney(selectedTotal)} />
                  <Stat label="Deposit" value={formatMoney(depositAmount)} />
                  <Stat label="Status" value="Dummy card" />
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Field
                  label="Cardholder name"
                  value={cardDraft.cardholderName}
                  onChange={(value) => setCardDraft((current) => ({ ...current, cardholderName: value }))}
                  placeholder="Name on card"
                />
                <Field
                  label="Card number"
                  value={cardDraft.cardNumber}
                  onChange={(value) => setCardDraft((current) => ({ ...current, cardNumber: value }))}
                  placeholder="4111 1111 1111 1111"
                />
                <Field
                  label="Expiry"
                  value={cardDraft.expiry}
                  onChange={(value) => setCardDraft((current) => ({ ...current, expiry: value }))}
                  placeholder="12/29"
                />
                <Field
                  label="CVC"
                  value={cardDraft.cvc}
                  onChange={(value) => setCardDraft((current) => ({ ...current, cvc: value }))}
                  placeholder="123"
                />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-[1fr_180px]">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Card brand</span>
                  <select
                    value={cardDraft.brand}
                    onChange={(event) =>
                      setCardDraft((current) => ({ ...current, brand: event.target.value as CardBrand }))
                    }
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  >
                    <option value="visa">VISA</option>
                    <option value="mastercard">MASTER Card</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="american_express">American Express</option>
                  </select>
                </label>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Payment amount</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{formatMoney(depositAmount)}</p>
                  <p className="mt-1 text-xs text-slate-500">Session hint: {partialPaymentAmount}.</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={settingsLoading || !paymentReady}
                  className="rounded-full bg-[#0f1720] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Pay and save booking
                </button>
                <span className="text-sm text-slate-500">
                  Payment is stored as a booking deposit, not charged to a real gateway.
                </span>
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
