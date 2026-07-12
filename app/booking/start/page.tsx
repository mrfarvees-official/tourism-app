"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/src/shared/ui/Container";
import { AddonSelector, BookingForm, PriceBreakdown, TravelerForm } from "@/src/shared/components/tourism";
import { http } from "@/src/api/config/http";
import { activityService } from "@/src/api/services/activityService";
import { destinationService } from "@/src/api/services/destinationService";
import { packageService } from "@/src/api/services/packageService";
import { tourismServiceService } from "@/src/api/services/tourismServiceService";
import type { TourismItem } from "@/src/shared/tourism/demoData";

type BookingDraft = {
  tenantKey: string;
  customerName: string;
  customerEmail: string;
  destinationSlug: string;
  packageSlug: string;
  serviceSlug: string;
  activitySlug: string;
  travelDate: string;
  returnDate: string;
  adults: number;
  children: number;
  infants: number;
  notes: string;
};

const initialDraft: BookingDraft = {
  tenantKey: "lanka-trails",
  customerName: "Ayesha Khan",
  customerEmail: "ayesha.khan@example.com",
  destinationSlug: "",
  packageSlug: "",
  serviceSlug: "",
  activitySlug: "",
  travelDate: "2026-08-14",
  returnDate: "2026-08-20",
  adults: 2,
  children: 0,
  infants: 0,
  notes: "Airport pickup needed.",
};

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(value);
}

function parseAmount(value?: string) {
  const amount = Number((value ?? "").replace(/[^0-9.-]+/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

function findItemBySlug(items: TourismItem[], slug: string) {
  return items.find((item) => item.slug === slug) ?? items[0];
}

function getFieldText(item: TourismItem | undefined, key: string, fallback = "") {
  const value = item?.fields?.[key];
  return typeof value === "string" && value.trim() !== "" ? value : fallback;
}

function storyPoints(...values: Array<string | undefined>) {
  return values.filter((value): value is string => Boolean(value && value.trim())).slice(0, 4);
}

type Collections = {
  destinations: TourismItem[];
  packages: TourismItem[];
  services: TourismItem[];
  activities: TourismItem[];
};

const emptyCollections: Collections = {
  destinations: [],
  packages: [],
  services: [],
  activities: [],
};

function readItems(payload: unknown): TourismItem[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  const record = payload as { data?: unknown; items?: unknown };
  if (Array.isArray(record.data)) {
    return record.data as TourismItem[];
  }
  if (Array.isArray(record.items)) {
    return record.items as TourismItem[];
  }

  return [];
}

export default function BookingStartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [draft, setDraft] = useState<BookingDraft>(initialDraft);
  const [collections, setCollections] = useState<Collections>(emptyCollections);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadCollections = async () => {
      try {
        const [destinationResponse, packageResponse, serviceResponse, activityResponse] = await Promise.all([
          destinationService.list(draft.tenantKey),
          packageService.list(draft.tenantKey),
          tourismServiceService.list(draft.tenantKey),
          activityService.list(draft.tenantKey),
        ]);

        if (!active) {
          return;
        }

        setCollections({
          destinations: readItems(destinationResponse.data?.data),
          packages: readItems(packageResponse.data?.data),
          services: readItems(serviceResponse.data?.data),
          activities: readItems(activityResponse.data?.data),
        });
      } catch {
        if (active) {
          setCollections(emptyCollections);
        }
      }
    };

    void loadCollections();

    return () => {
      active = false;
    };
  }, [draft.tenantKey]);

  useEffect(() => {
    const itemSlug = searchParams.get("item")?.trim();
    if (!collections.destinations.length && !collections.packages.length && !collections.services.length && !collections.activities.length) {
      return;
    }

    const destination = collections.destinations.find((item) => item.slug === itemSlug);
    const pkg = collections.packages.find((item) => item.slug === itemSlug);
    const service = collections.services.find((item) => item.slug === itemSlug);
    const activity = collections.activities.find((item) => item.slug === itemSlug);

    const nextDestinationSlug = destination?.slug ?? collections.destinations[0]?.slug ?? draft.destinationSlug;
    const nextPackageSlug = pkg?.slug ?? collections.packages[0]?.slug ?? draft.packageSlug;
    const nextServiceSlug = service?.slug ?? collections.services[0]?.slug ?? draft.serviceSlug;
    const nextActivitySlug = activity?.slug ?? collections.activities[0]?.slug ?? draft.activitySlug;

    setDraft((current) => ({
      ...current,
      destinationSlug: nextDestinationSlug,
      packageSlug: nextPackageSlug,
      serviceSlug: nextServiceSlug,
      activitySlug: nextActivitySlug,
      notes: destination
        ? `We want a story-led trip around ${destination.title}.`
        : pkg
          ? `We are booking the ${pkg.title} route.`
          : current.notes,
    }));
  }, [collections, draft.destinationSlug, draft.packageSlug, draft.serviceSlug, draft.activitySlug, searchParams]);

  const selectedDestination = useMemo(
    () => findItemBySlug(collections.destinations, draft.destinationSlug),
    [collections.destinations, draft.destinationSlug],
  );
  const selectedPackage = useMemo(
    () => findItemBySlug(collections.packages, draft.packageSlug),
    [collections.packages, draft.packageSlug],
  );
  const selectedService = useMemo(
    () => findItemBySlug(collections.services, draft.serviceSlug),
    [collections.services, draft.serviceSlug],
  );
  const selectedActivity = useMemo(
    () => findItemBySlug(collections.activities, draft.activitySlug),
    [collections.activities, draft.activitySlug],
  );

  const travelerCount = draft.adults + draft.children + draft.infants;
  const packageBase = parseAmount(selectedPackage?.amount);
  const serviceBase = parseAmount(selectedService?.amount);
  const activityBase = parseAmount(selectedActivity?.amount);
  const journeyPremium = 150000;
  const estimatedTotal = packageBase + serviceBase + activityBase + journeyPremium || 370000;
  const estimatedDeposit = Math.round(estimatedTotal * 0.5);
  const addonTotal = Math.max(estimatedTotal - packageBase, 0);

  const storyCards = [
    {
      label: "Destination mood",
      title: selectedDestination?.title ?? "Sri Lanka",
      detail:
        getFieldText(selectedDestination, "story") ||
        selectedDestination?.description ||
        "A curated arrival route with local pacing and enough room to breathe.",
    },
    {
      label: "Package arc",
      title: selectedPackage?.title ?? "Custom Journey",
      detail:
        getFieldText(selectedPackage, "story") ||
        selectedPackage?.description ||
        "A clear sequence of stops, transfers, and stays that keeps the trip coherent.",
    },
    {
      label: "Support layer",
      title: selectedService?.title ?? "Private support",
      detail:
        getFieldText(selectedService, "story") ||
        selectedService?.description ||
        "Add transport or on-ground support that reduces friction during travel.",
    },
    {
      label: "Experience add-on",
      title: selectedActivity?.title ?? "Curated activity",
      detail:
        getFieldText(selectedActivity, "story") ||
        selectedActivity?.description ||
        "An extra experience that adds context and memory to the booking.",
    },
  ];

  const tripHighlights = storyPoints(
    getFieldText(selectedDestination, "highlights"),
    getFieldText(selectedPackage, "includes"),
    getFieldText(selectedService, "coverage"),
    getFieldText(selectedActivity, "includes"),
  );

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const totalAmount = Math.max(estimatedTotal, 0);
    const paidAmount = estimatedDeposit;
    const routeSummary = [
      selectedDestination?.title,
      selectedPackage?.title,
      selectedService?.title,
      selectedActivity?.title,
    ]
      .filter(Boolean)
      .join(" · ");
    const journeyStory = [
      getFieldText(selectedDestination, "story"),
      getFieldText(selectedPackage, "story"),
      getFieldText(selectedService, "story"),
      getFieldText(selectedActivity, "story"),
    ]
      .filter(Boolean)
      .join(" ");

    try {
      const response = await http.post(`/api/public/${encodeURIComponent(draft.tenantKey)}/bookings`, {
        customer_name: draft.customerName,
        customer_email: draft.customerEmail,
        destination: selectedDestination?.title ?? "Sri Lanka",
        destination_slug: selectedDestination?.slug,
        package_name: selectedPackage?.title ?? "Custom Booking",
        package_slug: selectedPackage?.slug,
        service_name: selectedService?.title ?? "",
        service_slug: selectedService?.slug,
        activity_name: selectedActivity?.title ?? "",
        activity_slug: selectedActivity?.slug,
        travel_date: draft.travelDate,
        return_date: draft.returnDate,
        adults: draft.adults,
        children: draft.children,
        infants: draft.infants,
        travelers_count: travelerCount,
        total_amount: totalAmount,
        paid_amount: paidAmount,
        notes: draft.notes,
        trip_story: journeyStory,
        journey_story: journeyStory,
        route_summary: routeSummary,
        trip_highlights: tripHighlights,
        package_story: getFieldText(selectedPackage, "story"),
        destination_story: getFieldText(selectedDestination, "story"),
        service_story: getFieldText(selectedService, "story"),
        activity_story: getFieldText(selectedActivity, "story"),
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
            route_summary?: string;
            trip_story?: string;
          }
        | undefined;
      const bookingId = payload?.reference ?? payload?.booking_reference ?? "";
      router.push(
        `/booking/confirmation?bookingId=${encodeURIComponent(bookingId)}&customerName=${encodeURIComponent(payload?.customer_name ?? draft.customerName)}&customerEmail=${encodeURIComponent(payload?.customer_email ?? draft.customerEmail)}&packageName=${encodeURIComponent(payload?.package_name ?? selectedPackage?.title ?? "Custom Booking")}&destination=${encodeURIComponent(payload?.destination ?? selectedDestination?.title ?? "Sri Lanka")}&travelDate=${encodeURIComponent(payload?.travel_date ?? draft.travelDate)}&returnDate=${encodeURIComponent(payload?.return_date ?? draft.returnDate)}&totalAmount=${encodeURIComponent(String(payload?.total_amount ?? totalAmount))}&paidAmount=${encodeURIComponent(String(payload?.paid_amount ?? paidAmount))}&bookingStatus=${encodeURIComponent(payload?.status ?? "pending")}&paymentStatus=${encodeURIComponent(payload?.payment_status ?? "unpaid")}&routeSummary=${encodeURIComponent(payload?.route_summary ?? routeSummary)}&tripStory=${encodeURIComponent(payload?.trip_story ?? journeyStory)}`,
      );
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to create booking.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container className="py-8 sm:py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.94fr]">
        <BookingForm
          title="Start a story-led booking"
          description="Choose a destination, package, service, and activity, then submit the request with the journey context your team needs."
          onSubmit={submitBooking}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Tenant key" value={draft.tenantKey} onChange={(value) => setDraft((current) => ({ ...current, tenantKey: value }))} />
            <Field label="Customer name" value={draft.customerName} onChange={(value) => setDraft((current) => ({ ...current, customerName: value }))} />
            <Field label="Customer email" value={draft.customerEmail} onChange={(value) => setDraft((current) => ({ ...current, customerEmail: value }))} />
            <SelectField
              label="Destination"
              value={draft.destinationSlug}
              onChange={(value) => setDraft((current) => ({ ...current, destinationSlug: value }))}
              options={collections.destinations.map((item) => ({ value: item.slug, label: item.title }))}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              label="Package"
              value={draft.packageSlug}
              onChange={(value) => setDraft((current) => ({ ...current, packageSlug: value }))}
              options={collections.packages.map((item) => ({ value: item.slug, label: item.title }))}
            />
            <SelectField
              label="Service"
              value={draft.serviceSlug}
              onChange={(value) => setDraft((current) => ({ ...current, serviceSlug: value }))}
              options={collections.services.map((item) => ({ value: item.slug, label: item.title }))}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              label="Activity"
              value={draft.activitySlug}
              onChange={(value) => setDraft((current) => ({ ...current, activitySlug: value }))}
              options={collections.activities.map((item) => ({ value: item.slug, label: item.title }))}
            />
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
              This booking will submit {travelerCount} traveler{travelerCount === 1 ? "" : "s"} to the backend API.
            </p>
          </TravelerForm>

          <AddonSelector>
            <h3 className="text-lg font-semibold text-title">Booking narrative</h3>
            <p className="mt-1 text-sm text-slate-600">
              Keep the notes focused on pickup, pacing, room preferences, and any special context the team should carry into the trip design.
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

        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-white/60">Trip preview</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              A booking page that reads like a trip outline
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
              The selected destination, package, service, and activity are combined into one narrative so the booking request already tells the story of the trip.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <MiniMetric label="Travelers" value={`${travelerCount}`} />
              <MiniMetric label="Estimated total" value={currency(estimatedTotal)} />
              <MiniMetric label="Deposit" value={currency(estimatedDeposit)} />
              <MiniMetric label="Route" value={selectedPackage?.subtitle ?? "Custom"} />
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            {storyCards.map((card) => (
              <article key={card.label} className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{card.label}</p>
                <h3 className="mt-2 text-xl font-semibold text-title">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{card.detail}</p>
              </article>
            ))}
          </div>

          <section className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-title">Trip highlights</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {tripHighlights.length ? (
                tripHighlights.map((item) => (
                  <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                    {item}
                  </span>
                ))
              ) : (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                  Selected items will appear here
                </span>
              )}
            </div>
            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              {[
                ["Destination", selectedDestination?.title ?? "Sri Lanka"],
                ["Package", selectedPackage?.title ?? "Custom Booking"],
                ["Service", selectedService?.title ?? "None"],
                ["Activity", selectedActivity?.title ?? "None"],
                ["Journey story", selectedPackage?.fields?.story ? "Included" : "Ready"],
                ["Total", currency(estimatedTotal)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-slate-50 px-4 py-3">
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{label}</dt>
                  <dd className="mt-1 font-semibold text-title">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <PriceBreakdown
            subtotal={currency(Math.max(packageBase, 0))}
            addonTotal={currency(Math.max(addonTotal, 0))}
            discountTotal="LKR 0"
            taxTotal="LKR 0"
            total={currency(estimatedTotal)}
          />
        </div>
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

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      <span>{label}</span>
      <select className="h-11 rounded-xl border border-border bg-white px-3" value={value} onChange={(event) => onChange(event.target.value)}>
        {!options.length ? <option value="">Loading options...</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
