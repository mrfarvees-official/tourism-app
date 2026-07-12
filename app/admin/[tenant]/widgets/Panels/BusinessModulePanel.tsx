"use client";

import type { TourismItem } from "@/src/shared/tourism/demoData";
import CatalogManager, { type FieldConfig, type ResourceConfig } from "./CatalogManager";
import DestinationManager from "./DestinationManager";

type Props = {
  tenant: string;
  moduleKey: string;
  title: string;
  description: string;
};

function readText(row: TourismItem, key: string, fallback = "") {
  const record = row as Record<string, unknown>;
  const fields = record.fields && typeof record.fields === "object" && !Array.isArray(record.fields)
    ? (record.fields as Record<string, unknown>)
    : {};

  const candidates: unknown[] = [record[key], fields[key]];
  if (key === "name") candidates.push(record.title);
  if (key === "type") candidates.push(record.subtitle);

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim() !== "") {
      return candidate;
    }
    if (typeof candidate === "number") {
      return String(candidate);
    }
  }

  return fallback;
}

function readBoolean(row: TourismItem, key: string) {
  const record = row as Record<string, unknown>;
  const fields = record.fields && typeof record.fields === "object" && !Array.isArray(record.fields)
    ? (record.fields as Record<string, unknown>)
    : {};

  const candidate = record[key] ?? fields[key];
  return Boolean(candidate);
}

function readListText(row: TourismItem, key: string, fallback = "") {
  const record = row as Record<string, unknown>;
  const fields = record.fields && typeof record.fields === "object" && !Array.isArray(record.fields)
    ? (record.fields as Record<string, unknown>)
    : {};

  const candidate = record[key] ?? fields[key];
  if (Array.isArray(candidate)) {
    return candidate.map((value) => String(value)).join(", ");
  }

  if (typeof candidate === "string" && candidate.trim() !== "") {
    return candidate;
  }

  return fallback;
}

function toNumberValue(value: string | number | boolean | null | undefined) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const next = String(value ?? "").trim();
  if (next === "") {
    return null;
  }

  const parsed = Number(next);
  return Number.isFinite(parsed) ? parsed : null;
}

function splitListInput(value: string) {
  return value
    .split(/[\n,]+/g)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function commonFields(typeLabel: string, coverageLabel: string, vehicleLabel: string, responseLabel: string, pricingLabel: string): FieldConfig[] {
  return [
    { name: "slug", label: "Slug", type: "text", placeholder: "optional-slug", span: 2 },
    { name: "name", label: typeLabel, type: "text", placeholder: typeLabel },
    { name: "description", label: "Description", type: "textarea", span: 2 },
    { name: "type", label: typeLabel === "Package name" ? "Duration" : "Type", type: "text", placeholder: typeLabel },
    { name: "coverage", label: coverageLabel, type: "text", placeholder: coverageLabel },
    { name: "vehicle", label: vehicleLabel, type: "text", placeholder: vehicleLabel },
    { name: "response_time", label: responseLabel, type: "text", placeholder: responseLabel },
    { name: "pricing_model", label: pricingLabel, type: "text", placeholder: pricingLabel },
    { name: "season", label: "Highlights / Season", type: "text", placeholder: "Highlights or season", span: 2 },
    { name: "story", label: "Story", type: "textarea", span: 2 },
    { name: "price_label", label: "Price label", type: "text", placeholder: "LKR 185,000" },
    { name: "price_value", label: "Price value", type: "number", placeholder: "185000" },
    { name: "image_url", label: "Image URL", type: "asset", placeholder: "Select from media or paste a URL", span: 2 },
    { name: "featured", label: "Featured", type: "checkbox" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Draft", value: "draft" },
        { label: "Archived", value: "archived" },
      ],
    },
  ];
}

const packageConfig: ResourceConfig = {
  endpoint: "/api/admin/packages",
  singular: "package",
  editable: true,
  fields: commonFields("Package name", "Route summary", "Inclusions", "Best for", "Pace"),
  buildForm: (row) => ({
    slug: readText(row, "slug"),
    name: readText(row, "name", readText(row, "title")),
    description: readText(row, "description"),
    type: readText(row, "type", readText(row, "subtitle")),
    coverage: readText(row, "coverage", readText(row, "routeSummary", readText(row, "route_summary"))),
    vehicle: readText(row, "vehicle", readText(row, "includes", readText(row, "inclusions"))),
    response_time: readText(row, "response_time", readText(row, "best_for")),
    pricing_model: readText(row, "pricing_model", readText(row, "pace")),
    season: readText(row, "season", readText(row, "highlights")),
    story: readText(row, "story"),
    price_label: readText(row, "amount"),
    price_value: "",
    image_url: readText(row, "image_url", readText(row, "image")),
    featured: readBoolean(row, "featured"),
    status: readText(row, "status", "active"),
  }),
  buildPayload: (form) => ({
    slug: String(form.slug ?? ""),
    name: String(form.name ?? ""),
    description: String(form.description ?? ""),
    type: String(form.type ?? ""),
    coverage: String(form.coverage ?? ""),
    vehicle: String(form.vehicle ?? ""),
    response_time: String(form.response_time ?? ""),
    pricing_model: String(form.pricing_model ?? ""),
    season: String(form.season ?? ""),
    story: String(form.story ?? ""),
    price_label: String(form.price_label ?? ""),
    price_value: toNumberValue(form.price_value),
    image_url: String(form.image_url ?? ""),
    featured: Boolean(form.featured),
    status: String(form.status ?? "active"),
  }),
};

const serviceConfig: ResourceConfig = {
  endpoint: "/api/admin/services",
  singular: "service",
  editable: true,
  fields: commonFields("Service name", "Coverage", "Vehicle", "Response time", "Pricing model"),
  buildForm: (row) => ({
    slug: readText(row, "slug"),
    name: readText(row, "name", readText(row, "title")),
    description: readText(row, "description"),
    type: readText(row, "type", readText(row, "subtitle")),
    coverage: readText(row, "coverage", readText(row, "coverage")),
    vehicle: readText(row, "vehicle"),
    response_time: readText(row, "response_time", readText(row, "responseTime")),
    pricing_model: readText(row, "pricing_model"),
    season: "",
    story: readText(row, "story"),
    price_label: readText(row, "amount"),
    price_value: "",
    image_url: readText(row, "image_url", readText(row, "image")),
    featured: readBoolean(row, "featured"),
    status: readText(row, "status", "active"),
  }),
  buildPayload: (form) => ({
    slug: String(form.slug ?? ""),
    name: String(form.name ?? ""),
    description: String(form.description ?? ""),
    type: String(form.type ?? ""),
    coverage: String(form.coverage ?? ""),
    vehicle: String(form.vehicle ?? ""),
    response_time: String(form.response_time ?? ""),
    pricing_model: String(form.pricing_model ?? ""),
    story: String(form.story ?? ""),
    price_label: String(form.price_label ?? ""),
    price_value: toNumberValue(form.price_value),
    image_url: String(form.image_url ?? ""),
    featured: Boolean(form.featured),
    status: String(form.status ?? "active"),
  }),
};

const activityConfig: ResourceConfig = {
  endpoint: "/api/admin/activities",
  singular: "activity",
  editable: true,
  fields: commonFields("Activity name", "Duration", "Best for", "Pace", "Season"),
  buildForm: (row) => ({
    slug: readText(row, "slug"),
    name: readText(row, "name", readText(row, "title")),
    description: readText(row, "description"),
    type: readText(row, "type", readText(row, "subtitle")),
    coverage: readText(row, "coverage", readText(row, "duration")),
    vehicle: readText(row, "vehicle", readText(row, "best_for")),
    response_time: readText(row, "response_time", readText(row, "pace")),
    pricing_model: readText(row, "pricing_model", readText(row, "season")),
    season: readText(row, "season", readText(row, "highlights")),
    story: readText(row, "story"),
    price_label: readText(row, "amount"),
    price_value: "",
    image_url: readText(row, "image_url", readText(row, "image")),
    featured: readBoolean(row, "featured"),
    status: readText(row, "status", "active"),
  }),
  buildPayload: (form) => ({
    slug: String(form.slug ?? ""),
    name: String(form.name ?? ""),
    description: String(form.description ?? ""),
    type: String(form.type ?? ""),
    coverage: String(form.coverage ?? ""),
    vehicle: String(form.vehicle ?? ""),
    response_time: String(form.response_time ?? ""),
    pricing_model: String(form.pricing_model ?? ""),
    season: String(form.season ?? ""),
    story: String(form.story ?? ""),
    price_label: String(form.price_label ?? ""),
    price_value: toNumberValue(form.price_value),
    image_url: String(form.image_url ?? ""),
    featured: Boolean(form.featured),
    status: String(form.status ?? "active"),
  }),
};

const bookingConfig: ResourceConfig = {
  endpoint: "/api/admin/bookings",
  singular: "booking",
  editable: true,
  fields: [
    { name: "reference", label: "Reference", type: "text", placeholder: "TBK-2026-000101", span: 2 },
    { name: "customer_name", label: "Customer name", type: "text", placeholder: "Customer" },
    { name: "customer_email", label: "Customer email", type: "text", placeholder: "customer@example.com" },
    { name: "package_name", label: "Package name", type: "text", placeholder: "Sri Lanka Highlights" },
    { name: "package_slug", label: "Package slug", type: "text", placeholder: "sri-lanka-highlights" },
    { name: "destination", label: "Destination", type: "text", placeholder: "Sigiriya, Kandy, Ella" },
    { name: "destination_slug", label: "Destination slug", type: "text", placeholder: "sigiriya-kandy-ella" },
    { name: "service_name", label: "Service name", type: "text", placeholder: "Airport Transfer" },
    { name: "service_slug", label: "Service slug", type: "text", placeholder: "airport-transfer" },
    { name: "activity_name", label: "Activity name", type: "text", placeholder: "Tea Estate Walk" },
    { name: "activity_slug", label: "Activity slug", type: "text", placeholder: "tea-estate-walk" },
    { name: "travel_date", label: "Travel date", type: "text", placeholder: "2026-08-14" },
    { name: "return_date", label: "Return date", type: "text", placeholder: "2026-08-20" },
    { name: "adults", label: "Adults", type: "number", placeholder: "2" },
    { name: "children", label: "Children", type: "number", placeholder: "0" },
    { name: "infants", label: "Infants", type: "number", placeholder: "0" },
    { name: "travelers_count", label: "Travelers count", type: "number", placeholder: "2" },
    { name: "total_amount", label: "Total amount", type: "number", placeholder: "370000" },
    { name: "paid_amount", label: "Paid amount", type: "number", placeholder: "185000" },
    { name: "currency", label: "Currency", type: "text", placeholder: "LKR" },
    {
      name: "booking_status",
      label: "Booking status",
      type: "select",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
    {
      name: "payment_status",
      label: "Payment status",
      type: "select",
      options: [
        { label: "Unpaid", value: "unpaid" },
        { label: "Partial", value: "partial" },
        { label: "Paid", value: "paid" },
        { label: "Refunded", value: "refunded" },
      ],
    },
    { name: "payment_due_date", label: "Payment due date", type: "text", placeholder: "2026-08-07" },
    { name: "route_summary", label: "Route summary", type: "text", placeholder: "Sigiriya · Kandy · Ella", span: 2 },
    { name: "trip_story", label: "Trip story", type: "textarea", span: 2 },
    { name: "trip_highlights", label: "Trip highlights", type: "textarea", placeholder: "Airport transfer, Private driver", span: 2 },
    { name: "notes", label: "Notes", type: "textarea", span: 2 },
    { name: "destination_story", label: "Destination story", type: "textarea", span: 2 },
    { name: "package_story", label: "Package story", type: "textarea", span: 2 },
    { name: "service_story", label: "Service story", type: "textarea", span: 2 },
    { name: "activity_story", label: "Activity story", type: "textarea", span: 2 },
  ],
  buildForm: (row) => ({
    reference: readText(row, "reference", readText(row, "booking_reference")),
    customer_name: readText(row, "customer_name", readText(row, "title")),
    customer_email: readText(row, "customer_email"),
    package_name: readText(row, "package_name", readText(row, "packageName", readText(row, "subtitle"))),
    package_slug: readText(row, "package_slug"),
    destination: readText(row, "destination"),
    destination_slug: readText(row, "destination_slug"),
    service_name: readText(row, "service_name"),
    service_slug: readText(row, "service_slug"),
    activity_name: readText(row, "activity_name"),
    activity_slug: readText(row, "activity_slug"),
    travel_date: readText(row, "travel_date", readText(row, "travelDate")),
    return_date: readText(row, "return_date", readText(row, "returnDate")),
    adults: readText(row, "adults"),
    children: readText(row, "children"),
    infants: readText(row, "infants"),
    travelers_count: readText(row, "travelers_count", readText(row, "travelersCount")),
    total_amount: readText(row, "total_amount", readText(row, "totalAmount")),
    paid_amount: readText(row, "paid_amount", readText(row, "paidAmount")),
    currency: readText(row, "currency", "LKR"),
    booking_status: readText(row, "booking_status", readText(row, "status", "pending")),
    payment_status: readText(row, "payment_status", readText(row, "paymentStatus", "unpaid")),
    payment_due_date: readText(row, "payment_due_date", readText(row, "paymentDueDate")),
    route_summary: readText(row, "route_summary", readText(row, "routeSummary")),
    trip_story: readText(row, "trip_story", readText(row, "tripStory")),
    trip_highlights: readListText(row, "trip_highlights", readListText(row, "addOns")),
    notes: readText(row, "notes"),
    destination_story: readText(row, "destination_story"),
    package_story: readText(row, "package_story"),
    service_story: readText(row, "service_story"),
    activity_story: readText(row, "activity_story"),
  }),
  buildPayload: (form) => ({
    reference: String(form.reference ?? ""),
    customer_name: String(form.customer_name ?? ""),
    customer_email: String(form.customer_email ?? ""),
    package_name: String(form.package_name ?? ""),
    package_slug: String(form.package_slug ?? ""),
    destination: String(form.destination ?? ""),
    destination_slug: String(form.destination_slug ?? ""),
    service_name: String(form.service_name ?? ""),
    service_slug: String(form.service_slug ?? ""),
    activity_name: String(form.activity_name ?? ""),
    activity_slug: String(form.activity_slug ?? ""),
    travel_date: String(form.travel_date ?? ""),
    return_date: String(form.return_date ?? ""),
    adults: toNumberValue(form.adults),
    children: toNumberValue(form.children),
    infants: toNumberValue(form.infants),
    travelers_count: toNumberValue(form.travelers_count),
    total_amount: toNumberValue(form.total_amount),
    paid_amount: toNumberValue(form.paid_amount),
    currency: String(form.currency ?? "LKR") || "LKR",
    booking_status: String(form.booking_status ?? "pending"),
    payment_status: String(form.payment_status ?? "unpaid"),
    payment_due_date: String(form.payment_due_date ?? ""),
    route_summary: String(form.route_summary ?? ""),
    trip_story: String(form.trip_story ?? ""),
    trip_highlights: splitListInput(String(form.trip_highlights ?? "")),
    notes: String(form.notes ?? ""),
    destination_story: String(form.destination_story ?? ""),
    package_story: String(form.package_story ?? ""),
    service_story: String(form.service_story ?? ""),
    activity_story: String(form.activity_story ?? ""),
  }),
};

const stayConfig: ResourceConfig = {
  endpoint: "/api/admin/stays",
  singular: "stay",
  editable: true,
  fields: [
    { name: "slug", label: "Slug", type: "text", placeholder: "ella-view-resort", span: 2 },
    { name: "stay_name", label: "Stay name", type: "text", placeholder: "Ella View Resort" },
    { name: "description", label: "Description", type: "textarea", span: 2 },
    { name: "stay_type", label: "Stay type", type: "text", placeholder: "Resort" },
    { name: "location", label: "Location", type: "text", placeholder: "Ella" },
    { name: "room_type", label: "Room type", type: "text", placeholder: "Family room" },
    { name: "amenities", label: "Amenities", type: "textarea", placeholder: "Breakfast, pool", span: 2 },
    { name: "price_label", label: "Price label", type: "text", placeholder: "LKR 38,000" },
    { name: "price_value", label: "Price value", type: "number", placeholder: "38000" },
    { name: "image_url", label: "Image URL", type: "text", placeholder: "https://...", span: 2 },
    { name: "story", label: "Story", type: "textarea", span: 2 },
    { name: "featured", label: "Featured", type: "checkbox" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Draft", value: "draft" },
        { label: "Archived", value: "archived" },
      ],
    },
  ],
  buildForm: (row) => ({
    slug: readText(row, "slug"),
    stay_name: readText(row, "stay_name", readText(row, "title")),
    description: readText(row, "description"),
    stay_type: readText(row, "stay_type", readText(row, "subtitle")),
    location: readText(row, "location"),
    room_type: readText(row, "room_type"),
    amenities: readText(row, "amenities"),
    price_label: readText(row, "price_label", readText(row, "amount")),
    price_value: readText(row, "price_value"),
    image_url: readText(row, "image_url", readText(row, "image")),
    story: readText(row, "story"),
    featured: readBoolean(row, "featured"),
    status: readText(row, "status", "active"),
  }),
  buildPayload: (form) => ({
    slug: String(form.slug ?? ""),
    stay_name: String(form.stay_name ?? ""),
    description: String(form.description ?? ""),
    stay_type: String(form.stay_type ?? ""),
    location: String(form.location ?? ""),
    room_type: String(form.room_type ?? ""),
    amenities: String(form.amenities ?? ""),
    price_label: String(form.price_label ?? ""),
    price_value: toNumberValue(form.price_value),
    image_url: String(form.image_url ?? ""),
    featured: Boolean(form.featured),
    status: String(form.status ?? "active"),
    story: String(form.story ?? ""),
  }),
};

const transportConfig: ResourceConfig = {
  endpoint: "/api/admin/transport",
  singular: "transport option",
  editable: true,
  fields: [
    { name: "slug", label: "Slug", type: "text", placeholder: "private-van", span: 2 },
    { name: "transport_name", label: "Transport name", type: "text", placeholder: "Private Van" },
    { name: "description", label: "Description", type: "textarea", span: 2 },
    { name: "transport_type", label: "Transport type", type: "text", placeholder: "Van" },
    { name: "capacity", label: "Capacity", type: "text", placeholder: "6 seats" },
    { name: "coverage", label: "Coverage", type: "text", placeholder: "Island-wide" },
    { name: "vehicle", label: "Vehicle", type: "text", placeholder: "Air-conditioned van" },
    { name: "pricing_model", label: "Pricing model", type: "text", placeholder: "Per day" },
    { name: "price_label", label: "Price label", type: "text", placeholder: "LKR 28,000/day" },
    { name: "price_value", label: "Price value", type: "number", placeholder: "28000" },
    { name: "image_url", label: "Image URL", type: "text", placeholder: "https://...", span: 2 },
    { name: "story", label: "Story", type: "textarea", span: 2 },
    { name: "featured", label: "Featured", type: "checkbox" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Draft", value: "draft" },
        { label: "Archived", value: "archived" },
      ],
    },
  ],
  buildForm: (row) => ({
    slug: readText(row, "slug"),
    transport_name: readText(row, "transport_name", readText(row, "title")),
    description: readText(row, "description"),
    transport_type: readText(row, "transport_type", readText(row, "subtitle")),
    capacity: readText(row, "capacity"),
    coverage: readText(row, "coverage"),
    vehicle: readText(row, "vehicle"),
    pricing_model: readText(row, "pricing_model"),
    price_label: readText(row, "price_label", readText(row, "amount")),
    price_value: readText(row, "price_value"),
    image_url: readText(row, "image_url", readText(row, "image")),
    story: readText(row, "story"),
    featured: readBoolean(row, "featured"),
    status: readText(row, "status", "active"),
  }),
  buildPayload: (form) => ({
    slug: String(form.slug ?? ""),
    transport_name: String(form.transport_name ?? ""),
    description: String(form.description ?? ""),
    transport_type: String(form.transport_type ?? ""),
    capacity: String(form.capacity ?? ""),
    coverage: String(form.coverage ?? ""),
    vehicle: String(form.vehicle ?? ""),
    pricing_model: String(form.pricing_model ?? ""),
    price_label: String(form.price_label ?? ""),
    price_value: toNumberValue(form.price_value),
    image_url: String(form.image_url ?? ""),
    featured: Boolean(form.featured),
    status: String(form.status ?? "active"),
    story: String(form.story ?? ""),
  }),
};

export default function BusinessModulePanel({ tenant, moduleKey, title, description }: Props) {
  if (moduleKey === "destinations") {
    return <DestinationManager tenant={tenant} title={title} description={description} />;
  }

  const config = moduleKey === "packages"
    ? packageConfig
    : moduleKey === "services"
      ? serviceConfig
      : moduleKey === "activities"
        ? activityConfig
        : moduleKey === "bookings"
          ? bookingConfig
          : moduleKey === "accommodations"
            ? stayConfig
            : transportConfig;

  return <CatalogManager tenant={tenant} title={title} description={description} config={config} />;
}
