import { randomUUID } from "crypto";

export type DestinationStatus = "active" | "draft" | "archived";

export type DestinationRecord = {
  id: number;
  tenantKey: string;
  slug: string;
  destinationName: string;
  description: string;
  region: string;
  province: string;
  district: string;
  bestTimeToVisit: string;
  nearbyAttractions: string;
  latitude: string;
  longitude: string;
  imageUrl: string;
  featured: boolean;
  status: DestinationStatus;
  createdAt: string;
  updatedAt: string;
};

export type DestinationPayload = {
  tenantKey?: string;
  slug?: string;
  destinationName: string;
  description?: string;
  region?: string;
  province?: string;
  district?: string;
  bestTimeToVisit?: string;
  nearbyAttractions?: string;
  latitude?: string;
  longitude?: string;
  imageUrl?: string;
  featured?: boolean;
  status?: DestinationStatus;
};

export type DestinationListItem = DestinationRecord & {
  title: string;
  subtitle: string;
  image: string;
  href: string;
  meta: string;
  fields: Record<string, unknown>;
  allowed_fields: Array<{
    name: string;
    label: string;
    type: string;
    visible: boolean;
    required?: boolean;
  }>;
};

type TenantState = {
  nextId: number;
  items: DestinationRecord[];
};

const DEFAULT_TENANT = "lanka-trails";

const seedItems: DestinationRecord[] = [
  {
    id: 1,
    tenantKey: DEFAULT_TENANT,
    slug: "sigiriya",
    destinationName: "Sigiriya",
    description: "Heritage travel with the rock fortress, village lunches, and nearby day tours.",
    region: "Central Province",
    province: "North Central",
    district: "Matale",
    bestTimeToVisit: "May to September",
    nearbyAttractions: "Pidurangala, Dambulla, Minneriya National Park",
    latitude: "7.9570",
    longitude: "80.7603",
    imageUrl: "/no-image.jpg",
    featured: true,
    status: "active",
    createdAt: "2026-06-25T09:00:00.000Z",
    updatedAt: "2026-07-03T10:00:00.000Z",
  },
  {
    id: 2,
    tenantKey: DEFAULT_TENANT,
    slug: "ella",
    destinationName: "Ella",
    description: "Tea country views, scenic rail journeys, waterfalls, and slow mountain stays.",
    region: "Hill Country",
    province: "Uva",
    district: "Badulla",
    bestTimeToVisit: "December to April",
    nearbyAttractions: "Nine Arches Bridge, Little Adam's Peak, Ravana Falls",
    latitude: "6.8667",
    longitude: "81.0466",
    imageUrl: "/no-image.jpg",
    featured: true,
    status: "active",
    createdAt: "2026-06-25T09:10:00.000Z",
    updatedAt: "2026-07-04T12:30:00.000Z",
  },
  {
    id: 3,
    tenantKey: DEFAULT_TENANT,
    slug: "mirissa",
    destinationName: "Mirissa",
    description: "Beach stays, whale watching, seafood dining, and coastal transfers.",
    region: "South Coast",
    province: "Southern",
    district: "Matara",
    bestTimeToVisit: "November to April",
    nearbyAttractions: "Parrot Rock, Secret Beach, Weligama Bay",
    latitude: "5.9485",
    longitude: "80.4588",
    imageUrl: "/no-image.jpg",
    featured: false,
    status: "active",
    createdAt: "2026-06-25T09:20:00.000Z",
    updatedAt: "2026-07-04T15:10:00.000Z",
  },
];

const tenantStore = new Map<string, TenantState>();

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeText(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function seedTenant(tenantKey: string) {
  if (tenantStore.has(tenantKey)) {
    return tenantStore.get(tenantKey) as TenantState;
  }

  const items =
    tenantKey === DEFAULT_TENANT
      ? seedItems.map((item) => ({ ...item, tenantKey }))
      : seedItems.map((item, index) => ({
          ...item,
          id: index + 1,
          tenantKey,
          slug: `${tenantKey}-${item.slug}`,
        }));

  const state: TenantState = {
    nextId: items.length + 1,
    items,
  };

  tenantStore.set(tenantKey, state);
  return state;
}

function ensureTenant(tenantKey?: string) {
  const resolvedTenant = tenantKey?.trim() || DEFAULT_TENANT;
  return { tenantKey: resolvedTenant, state: seedTenant(resolvedTenant) };
}

function toListItem(record: DestinationRecord): DestinationListItem {
  return {
    ...clone(record),
    title: record.destinationName,
    subtitle: [record.region, record.province, record.district].filter(Boolean).join(" • "),
    image: record.imageUrl,
    href: `/destinations/${record.slug}`,
    meta: record.featured ? "Featured" : record.status,
    fields: {
      region: record.region,
      province: record.province,
      district: record.district,
      bestTimeToVisit: record.bestTimeToVisit,
      nearbyAttractions: record.nearbyAttractions,
      latitude: record.latitude,
      longitude: record.longitude,
      featured: record.featured,
    },
    allowed_fields: [
      { name: "region", label: "Region", type: "string", visible: true },
      { name: "province", label: "Province", type: "string", visible: true },
      { name: "district", label: "District", type: "string", visible: true },
      { name: "bestTimeToVisit", label: "Best time to visit", type: "string", visible: true },
      { name: "nearbyAttractions", label: "Nearby attractions", type: "string", visible: true },
      { name: "latitude", label: "Latitude", type: "string", visible: true },
      { name: "longitude", label: "Longitude", type: "string", visible: true },
      { name: "featured", label: "Featured", type: "bool", visible: true },
    ],
  };
}

function findIndex(state: TenantState, identifier: string) {
  return state.items.findIndex((item) => String(item.id) === identifier || item.slug === identifier);
}

export function listDestinations(tenantKey?: string) {
  const { state } = ensureTenant(tenantKey);
  return clone(state.items.slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
}

export function listDestinationRecords(tenantKey?: string) {
  return listDestinations(tenantKey).map(toListItem);
}

export function listDestinationRecordsPage(
  tenantKey?: string,
  page = 1,
  limit = 10,
) {
  const records = listDestinationRecords(tenantKey);
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 10;
  const total = records.length;
  const lastPage = Math.max(1, Math.ceil(total / safeLimit));
  const safePage = Math.min(Math.max(1, Math.floor(page)), lastPage);
  const start = (safePage - 1) * safeLimit;
  const items = records.slice(start, start + safeLimit);

  return {
    items,
    meta: {
      total,
      per_page: safeLimit,
      current_page: safePage,
      last_page: lastPage,
      from: total === 0 ? 0 : start + 1,
      to: total === 0 ? 0 : start + items.length,
    },
  };
}

export function getDestination(identifier: string, tenantKey?: string) {
  const { state } = ensureTenant(tenantKey);
  const item = state.items.find((record) => String(record.id) === identifier || record.slug === identifier);
  return item ? clone(item) : null;
}

export function getDestinationListItem(identifier: string, tenantKey?: string) {
  const item = getDestination(identifier, tenantKey);
  return item ? toListItem(item) : null;
}

export function createDestination(input: DestinationPayload) {
  const { tenantKey, state } = ensureTenant(input.tenantKey);
  const destinationName = normalizeText(input.destinationName, "Destination");
  const now = new Date().toISOString();
  const record: DestinationRecord = {
    id: state.nextId,
    tenantKey,
    slug: normalizeText(input.slug) || slugify(destinationName) || `destination-${state.nextId}`,
    destinationName,
    description: normalizeText(input.description),
    region: normalizeText(input.region),
    province: normalizeText(input.province),
    district: normalizeText(input.district),
    bestTimeToVisit: normalizeText(input.bestTimeToVisit),
    nearbyAttractions: normalizeText(input.nearbyAttractions),
    latitude: normalizeText(input.latitude),
    longitude: normalizeText(input.longitude),
    imageUrl: normalizeText(input.imageUrl, "/no-image.jpg"),
    featured: Boolean(input.featured),
    status: input.status ?? "draft",
    createdAt: now,
    updatedAt: now,
  };

  state.nextId += 1;
  state.items = [record, ...state.items];
  tenantStore.set(tenantKey, state);
  return clone(record);
}

export function updateDestination(identifier: string, input: DestinationPayload) {
  const { tenantKey, state } = ensureTenant(input.tenantKey);
  const index = findIndex(state, identifier);
  if (index < 0) return null;

  const current = state.items[index];
  const nextSlug = normalizeText(input.slug) || current.slug;
  const updated: DestinationRecord = {
    ...current,
    slug: nextSlug,
    destinationName: normalizeText(input.destinationName, current.destinationName),
    description: normalizeText(input.description, current.description),
    region: normalizeText(input.region, current.region),
    province: normalizeText(input.province, current.province),
    district: normalizeText(input.district, current.district),
    bestTimeToVisit: normalizeText(input.bestTimeToVisit, current.bestTimeToVisit),
    nearbyAttractions: normalizeText(input.nearbyAttractions, current.nearbyAttractions),
    latitude: normalizeText(input.latitude, current.latitude),
    longitude: normalizeText(input.longitude, current.longitude),
    imageUrl: normalizeText(input.imageUrl, current.imageUrl),
    featured: typeof input.featured === "boolean" ? input.featured : current.featured,
    status: input.status ?? current.status,
    updatedAt: new Date().toISOString(),
    tenantKey,
  };

  state.items[index] = updated;
  tenantStore.set(tenantKey, state);
  return clone(updated);
}

export function deleteDestination(identifier: string, tenantKey?: string) {
  const { state } = ensureTenant(tenantKey);
  const index = findIndex(state, identifier);
  if (index < 0) return false;

  state.items.splice(index, 1);
  return true;
}

export function buildDestinationResponse(record: DestinationRecord) {
  return toListItem(record);
}

export function nextDestinationId(tenantKey?: string) {
  const { state } = ensureTenant(tenantKey);
  return state.nextId;
}

export function newDestinationId() {
  return randomUUID();
}
