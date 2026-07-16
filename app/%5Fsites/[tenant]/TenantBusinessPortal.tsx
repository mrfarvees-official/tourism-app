"use client";

import Link from "next/link";
import { useEffect, useState, type ComponentType } from "react";
import { useSearchParams } from "next/navigation";
import RenderComponent, {
  type ContentDataSnapshot,
} from "@/app/designer/[tenant]/widgets/palette/RenderComponent";
import { sitePage } from "@/app/designer/[tenant]/widgets/palette/data";
import type { ComponentNode, DesignerState } from "@/app/designer/[tenant]/widgets/palette/types";
import { DestinationCard } from "@/src/shared/components/tourism";
import type { TourismItem } from "@/src/shared/tourism/demoData";
import { http } from "@/src/api/config/http";
import {
  ClipboardList,
  CreditCard,
  MapPinned,
  MessageSquareText,
  PhoneCall,
  ShieldCheck,
  Star,
  Ticket,
} from "lucide-react";

type Props = {
  tenant: string;
  path: string;
};

type PageSchema = {
  header?: ComponentNode;
  footer?: ComponentNode;
};

type PageRecord = {
  schema?: PageSchema;
  content_datas?: ContentDataSnapshot[];
};

type SectionKey = "destinations" | "packages" | "services" | "activities";

type DestinationRecord = TourismItem & {
  href?: string;
  meta?: string;
  image?: string;
  imageUrl?: string;
  image_url?: string;
  fields?: Record<string, unknown>;
  allowed_fields?: Array<{
    name: string;
    label?: string;
    type?: string;
    visible?: boolean;
    required?: boolean;
  }>;
};

type DashboardBooking = {
  id: string;
  reference: string;
  packageName: string;
  destination: string;
  serviceName?: string;
  activityName?: string;
  travelDate: string;
  returnDate: string;
  travelersCount: number;
  totalAmount: number;
  paidAmount: number;
  currency: string;
  bookingStatus: string;
  paymentStatus: string;
  paymentDueDate?: string;
  notes: string;
  supportContact: string;
  itinerary: string[];
};

type DashboardReview = {
  id: string;
  title: string;
  message: string;
  rating: number;
  status: string;
  createdAt: string;
};

type DashboardData = {
  tenant: {
    key: string;
    name: string;
    supportEmail: string;
  };
  profile: {
    name: string;
    email: string;
    phone: string;
    loyaltyTier: string;
    updatedAt: string;
  };
  summary: {
    upcomingTrips: number;
    completedTrips: number;
    pendingPayments: number;
    totalSpent: string;
    reviewCount: number;
    loyaltyTier: string;
  };
  nextTrip: DashboardBooking | null;
  bookings: DashboardBooking[];
  reviews: DashboardReview[];
  tasks: Array<{
    id: string;
    title: string;
    detail: string;
    status: "open" | "in_progress" | "done" | "attention";
    actionLabel?: string;
    href?: string;
  }>;
  support: Array<{
    id: string;
    title: string;
    detail: string;
    updatedAt: string;
  }>;
};

const sections: Record<SectionKey, { title: string }> = {
  destinations: { title: "Destinations" },
  packages: { title: "Packages" },
  services: { title: "Services" },
  activities: { title: "Activities" },
};

const fallbackSchema: PageSchema = {
  header: sitePage.header,
  footer: sitePage.footer,
};

const initialDesignerState: DesignerState = {
  header: { nodes: {}, rootIds: [] },
  template: { nodes: {}, rootIds: [] },
  footer: { nodes: {}, rootIds: [] },
  selectedSection: null,
  selectedId: null,
  insertIndex: null,
  hoveredSection: null,
  hoveredId: null,
  history: [],
  future: [],
};

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
};

const resolveImage = (item?: TourismItem & { image?: string; imageUrl?: string; image_url?: string }) =>
  item?.image ?? item?.imageUrl ?? item?.image_url ?? "/no-image.jpg";

function formatDate(value: string) {
  if (!value) return "Not set";

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

function badgeClass(status: string) {
  switch (status) {
    case "confirmed":
    case "paid":
    case "done":
      return "bg-emerald-100 text-emerald-700";
    case "pending":
    case "partial":
    case "open":
      return "bg-amber-100 text-amber-800";
    case "attention":
      return "bg-rose-100 text-rose-700";
    case "completed":
      return "bg-sky-100 text-sky-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getTenantBasePath(tenant: string) {
  if (typeof window === "undefined" || !tenant) {
    return "";
  }

  const parts = window.location.pathname.split("/").filter(Boolean);
  if ((parts[0] === "sites" || parts[0] === "_sites") && parts[1] === tenant) {
    return `/sites/${tenant}`;
  }

  return "";
}

function prefixTenantBasePath(basePath: string, href: string) {
  if (!basePath) {
    return href;
  }

  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(href)) {
    return href;
  }

  const normalizedHref = href.startsWith("/") ? href : `/${href}`;
  return `${basePath}${normalizedHref}`;
}

const unwrapPayload = (value: unknown): unknown => {
  let current = value;

  for (let depth = 0; depth < 4; depth += 1) {
    const record = asRecord(current);
    if (!record) {
      return current;
    }

    if ("data" in record) {
      current = record.data;
      continue;
    }

    return current;
  }

  return current;
};

const unwrapRecord = (value: unknown): PageRecord | null => {
  const record = asRecord(unwrapPayload(value));
  if (!record) {
    return null;
  }

  const candidates = [record.page, record.item, record];
  for (const candidate of candidates) {
    const nested = asRecord(candidate);
    if (!nested) continue;
    const nestedSchema = asRecord(nested.schema);
    if (nestedSchema) {
      return nested as PageRecord;
    }
  }

  return null;
};

function readCollection(payload: unknown): TourismItem[] {
  if (Array.isArray(payload)) {
    return payload as TourismItem[];
  }

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

  const nested = record.data && typeof record.data === "object" ? (record.data as { data?: unknown; items?: unknown }) : null;
  if (nested) {
    if (Array.isArray(nested.data)) {
      return nested.data as TourismItem[];
    }
    if (Array.isArray(nested.items)) {
      return nested.items as TourismItem[];
    }
  }

  return [];
}

async function loadCollection(
  tenant: string,
  section: SectionKey,
): Promise<TourismItem[]> {
  try {
    const response = await http.get(`/api/public/${tenant}/${section}`);
    return readCollection(response.data?.data);
  } catch {
    return [];
  }
}

function getApiOrigin() {
  return (process.env.NEXT_PUBLIC_API_ORIGIN ?? process.env.API_ORIGIN ?? "").replace(/\/+$/, "");
}

async function fetchTenantSchema(tenantKey: string): Promise<PageRecord | null> {
  const apiOrigin = getApiOrigin();
  if (!apiOrigin) {
    return null;
  }

  const baseUrl = apiOrigin.endsWith("/") ? apiOrigin : `${apiOrigin}/`;
  const candidates = [`api/live/${encodeURIComponent(tenantKey)}`];

  for (const candidate of candidates) {
    const response = await fetch(new URL(candidate, baseUrl), {
      cache: "no-store",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (!response.ok) {
      continue;
    }

    const payload = (await response.json()) as unknown;
    const record = unwrapRecord(payload);
    if (record?.schema) {
      return record;
    }
  }

  return null;
}

function Status({ value }: { value: string }) {
  return (
    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700">
      {value.replace(/_/g, " ")}
    </span>
  );
}

function ItemGrid({
  title,
  items,
  basePath,
}: {
  title: string;
  items: TourismItem[];
  basePath: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">Browse tenant business data from the tourism platform.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Link
            href={prefixTenantBasePath(basePath, `/${title.toLowerCase()}/${item.slug}`)}
            key={item.id}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
          >
            <div className="relative h-52 bg-slate-100">
              <img
                src={resolveImage(item)}
                alt={item.title}
                className="h-full w-full object-cover transition duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              <div className="absolute left-4 top-4">
                <Status value={item.status} />
              </div>
            </div>
            <div className="space-y-3 p-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">{item.title}</h2>
                <p className="mt-1 text-sm font-medium text-slate-500">{item.subtitle}</p>
              </div>
              <p className="text-sm leading-6 text-slate-600">{item.description}</p>
              {item.amount ? <p className="text-sm font-semibold text-slate-950">{item.amount}</p> : null}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function normalizeDestinationRecord(item: Record<string, unknown>, basePath: string): DestinationRecord {
  const getString = (key: string, fallback = "") => {
    const value = item[key];
    return typeof value === "string" ? value : fallback;
  };

  const fields = item.fields && typeof item.fields === "object" && !Array.isArray(item.fields)
    ? (item.fields as Record<string, unknown>)
    : Object.fromEntries(
        Object.entries(item).filter(([key, value]) => {
          if (["id", "slug", "title", "subtitle", "description", "status", "amount", "meta", "image", "href", "fields", "allowed_fields", "schema_blueprint", "updated_at"].includes(key)) {
            return false;
          }
          return value !== null && value !== undefined && value !== "";
        }),
      );

  const allowedFields = Array.isArray(item.allowed_fields)
    ? (item.allowed_fields as DestinationRecord["allowed_fields"])
    : undefined;

  return {
    id: Number(item.id ?? 0),
    slug: getString("slug", `destination-${item.id ?? "item"}`),
    title: getString("title", "Destination"),
    subtitle: getString("subtitle"),
    description: getString("description"),
    status: getString("status", "active") as DestinationRecord["status"],
    amount: typeof item.amount === "string" ? item.amount : undefined,
    image: getString("image", getString("imageUrl", getString("image_url", "/no-image.jpg"))),
    imageUrl: getString("imageUrl", getString("image_url", getString("image", "/no-image.jpg"))),
    image_url: getString("image_url", getString("imageUrl", getString("image", "/no-image.jpg"))),
    href: prefixTenantBasePath(
      basePath,
      getString("href", `/destinations/${getString("slug", `destination-${item.id ?? "item"}`)}`),
    ),
    meta: getString("meta"),
    fields,
    allowed_fields: allowedFields,
  };
}

function DestinationGrid({ tenant }: { tenant: string }) {
  const [items, setItems] = useState<DestinationRecord[]>([]);
  const basePath = getTenantBasePath(tenant);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await http.get(`/api/public/${tenant}/destinations`);
        const payload = response.data?.data;
        const records = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.items)
            ? payload.items
            : [];
        if (active) {
          setItems(records.map((item: Record<string, unknown>) => normalizeDestinationRecord(item, basePath)));
        }
      } catch {
        if (active) {
          setItems([]);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [basePath, tenant]);

  return (
    <section className="mx-auto max-w-7xl px-5 py-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">Destinations</h1>
          <p className="mt-1 text-sm text-slate-600">
            {tenant.split('-').map((w) => w.replace(/^\w/, (char) => char.toUpperCase()))} all destionatons across Sri Lanka.
          </p>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <DestinationCard
            key={item.id}
            {...item}
          />
        ))}
      </div>
    </section>
  );
}

function ConnectedItemGrid({ tenant, section }: { tenant: string; section: SectionKey }) {
  const [items, setItems] = useState<TourismItem[]>([]);
  const basePath = getTenantBasePath(tenant);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const next = await loadCollection(tenant, section);
      if (active) {
        setItems(next);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [section, tenant]);

  return <ItemGrid title={sections[section].title} items={items} basePath={basePath} />;
}

function Detail({ tenant, section, slug }: { tenant: string; section: SectionKey; slug: string }) {
  const [items, setItems] = useState<TourismItem[]>([]);
  const basePath = getTenantBasePath(tenant);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const next = await loadCollection(tenant, section);
      if (active) {
        setItems(next);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [section, tenant]);

  const item = items.find((row) => row.slug === slug) ?? items[0];
  const bookingHref = item?.slug
    ? prefixTenantBasePath(basePath, `/booking/start?item=${encodeURIComponent(item.slug)}`)
    : prefixTenantBasePath(basePath, "/booking/start");

  return (
    <section className="mx-auto max-w-7xl px-5 py-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <main>
          <Link href={prefixTenantBasePath(basePath, `/${section}`)} className="text-sm font-semibold text-slate-500 hover:text-slate-950">
            Back to {sections[section].title}
          </Link>
          <h1 className="mt-4 text-4xl font-semibold text-slate-950">{item?.title ?? "Details"}</h1>
          <p className="mt-2 text-base text-slate-600">{item?.subtitle ?? "Live content"}</p>
          {item ? (
            <div className="mt-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <img
                src={resolveImage(item)}
                alt={item.title}
                className="h-[22rem] w-full object-cover"
              />
            </div>
          ) : null}
          <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-700">{item?.description ?? "This item will load from the associated table."}</p>
          <div className="mt-6 flex items-center gap-3">
            {item ? <Status value={item.status} /> : null}
            {item?.amount ? <span className="text-sm font-semibold text-slate-950">{item.amount}</span> : null}
          </div>
        </main>
        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Request this trip</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Submit a booking request and the team will confirm availability and payment.
          </p>
          <Link href={bookingHref} className="mt-5 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            Start booking
          </Link>
        </aside>
      </div>
    </section>
  );
}

function CustomerDashboard({ tenant }: { tenant: string }) {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);
        const response = await http.get("/api/customer/dashboard", {
          params: { tenantKey: tenant },
        });

        if (active) {
          setDashboard((response.data?.data ?? null) as DashboardData | null);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load your dashboard.");
          setDashboard(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      active = false;
    };
  }, [tenant]);

  const tenantKey = dashboard?.tenant.key ?? tenant;
  const basePath = getTenantBasePath(tenantKey);
  const summaryCards = [
    {
      label: "Upcoming trips",
      value: String(dashboard?.summary.upcomingTrips ?? 0),
      detail: "Trips already booked and still ahead.",
      icon: MapPinned,
    },
    {
      label: "Pending payments",
      value: String(dashboard?.summary.pendingPayments ?? 0),
      detail: "Bookings that need settlement.",
      icon: CreditCard,
    },
    {
      label: "Completed trips",
      value: String(dashboard?.summary.completedTrips ?? 0),
      detail: "Trips that are already finished.",
      icon: ShieldCheck,
    },
    {
      label: "Reviews shared",
      value: String(dashboard?.summary.reviewCount ?? 0),
      detail: "Feedback captured after travel.",
      icon: Star,
    },
  ];

  const upcomingTrips = (dashboard?.bookings ?? []).filter((booking) => {
    const status = String(booking.bookingStatus).toLowerCase();
    return ["confirmed", "pending", "checked_in"].includes(status) && status !== "cancelled";
  });
  const pendingPayments = (dashboard?.bookings ?? []).filter((booking) => {
    const paymentStatus = String(booking.paymentStatus).toLowerCase();
    const bookingStatus = String(booking.bookingStatus).toLowerCase();
    return paymentStatus !== "paid" && bookingStatus !== "cancelled";
  });
  const completedTrips = (dashboard?.bookings ?? []).filter((booking) => String(booking.bookingStatus).toLowerCase() === "completed");

  return (
    <section className="mx-auto max-w-7xl px-5 py-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Customer dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Bookings, payments, and reviews</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Live customer data is loaded from the Laravel backend. No seeded portal records remain in this route.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={prefixTenantBasePath(basePath, "/booking/start")} className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">
              Start booking
            </Link>
            <Link href={prefixTenantBasePath(basePath, "/customer/bookings")} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-950">
              View bookings
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map(({ label, value, detail, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">{loading ? "..." : value}</p>
                </div>
                <div className="rounded-2xl bg-white p-3 text-slate-700">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600">{detail}</p>
            </div>
          ))}
        </div>

        {error ? <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800">{error}</div> : null}

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Next trip</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950">{dashboard?.nextTrip?.packageName ?? "No trip selected"}</h2>
              </div>
              {dashboard?.nextTrip ? <Status value={dashboard.nextTrip.bookingStatus} /> : null}
            </div>

            {dashboard?.nextTrip ? (
              <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-2xl bg-white p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <InfoPair label="Reference" value={dashboard.nextTrip.reference} />
                    <InfoPair label="Travel date" value={formatDate(dashboard.nextTrip.travelDate)} />
                    <InfoPair label="Destination" value={dashboard.nextTrip.destination} />
                    <InfoPair label="Travelers" value={String(dashboard.nextTrip.travelersCount)} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link href={prefixTenantBasePath(basePath, `/customer/bookings/${dashboard.nextTrip.reference}`)} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">
                      Open booking
                    </Link>
                    <a
                      href={`mailto:${dashboard.tenant.supportEmail}?subject=${encodeURIComponent(dashboard.nextTrip.reference)}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-title"
                    >
                      Contact support
                    </a>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Payment snapshot</p>
                  <div className="mt-3 space-y-3 text-sm">
                    <Row label="Total amount" value={formatMoney(dashboard.nextTrip.totalAmount, dashboard.nextTrip.currency)} />
                    <Row label="Paid so far" value={formatMoney(dashboard.nextTrip.paidAmount, dashboard.nextTrip.currency)} />
                    <Row label="Payment status" value={dashboard.nextTrip.paymentStatus} badgeClassName={badgeClass(dashboard.nextTrip.paymentStatus)} />
                    <Row label="Payment due" value={formatDate(dashboard.nextTrip.paymentDueDate ?? dashboard.nextTrip.travelDate)} />
                    <Row label="Support contact" value={dashboard.nextTrip.supportContact} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
                No bookings yet. Start a booking to see trip details and payment tracking here.
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">To-do list</p>
            <div className="mt-4 space-y-3">
              {dashboard?.tasks?.map((task) => (
                <div key={task.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-950">{task.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{task.detail}</p>
                    </div>
                    <Status value={task.status} />
                  </div>
                  {task.href && task.actionLabel ? (
                    <Link href={prefixTenantBasePath(basePath, task.href)} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                      {task.actionLabel}
                    </Link>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <BookingList
            title="Upcoming trips"
            eyebrow="Booked"
            description="Confirmed or pending bookings that are still ahead of travel."
            items={upcomingTrips}
            emptyText="No upcoming trips yet."
            tenantKey={tenantKey}
          />
          <BookingList
            title="Pending payments"
            eyebrow="Action needed"
            description="Bookings that still need a settlement payment."
            items={pendingPayments}
            emptyText="No pending payments."
            tenantKey={tenantKey}
          />
          <BookingList
            title="Completed trips"
            eyebrow="Done"
            description="Trips that have already been completed."
            items={completedTrips}
            emptyText="No completed trips yet."
            tenantKey={tenantKey}
          />
        </div>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Reviews</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950">Shared feedback</h2>
              </div>
              <Link href={prefixTenantBasePath(basePath, "/customer/reviews")} className="text-sm font-semibold text-slate-700">
                Leave review
              </Link>
            </div>
            <div className="mt-4 grid gap-3">
              {dashboard?.reviews?.length ? (
                dashboard.reviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-950">{review.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{review.message}</p>
                      </div>
                      <Status value={`${review.rating} stars`} />
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">{formatDate(review.createdAt)}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                  No reviews shared yet.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <InfoBlock
              icon={MapPinned}
              label="Upcoming trips"
              value={String(dashboard?.summary.upcomingTrips ?? 0)}
              detail="Trips already booked and still ahead of travel."
            />
            <InfoBlock
              icon={Ticket}
              label="Payment balance"
              value={String(dashboard?.summary.pendingPayments ?? 0)}
              detail="Bookings that need a settlement payment."
            />
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <ClipboardList className="h-5 w-5 text-slate-700" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Account</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{dashboard?.profile.name ?? "Guest traveler"}</h2>
                </div>
              </div>
              <dl className="mt-5 grid gap-4 text-sm">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Email</dt>
                  <dd className="mt-2 font-semibold text-slate-950">{dashboard?.profile.email ?? "Not set"}</dd>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Phone</dt>
                  <dd className="mt-2 font-semibold text-slate-950">{dashboard?.profile.phone ?? "Not set"}</dd>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Loyalty tier</dt>
                  <dd className="mt-2 font-semibold text-slate-950">{dashboard?.summary.loyaltyTier ?? "Explorer"}</dd>
                </div>
              </dl>
            </section>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <MessageSquareText className="h-5 w-5 text-slate-700" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Support</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-950">Recent notes</h2>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {dashboard?.support.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-950">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{item.detail}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">{formatDate(item.updatedAt)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white">
          <div className="flex items-center gap-3">
            <PhoneCall className="h-5 w-5 text-white/80" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">Help</p>
              <h2 className="mt-1 text-xl font-semibold">Need a quick answer?</h2>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/75">
            Email the support desk directly when you need itinerary changes, payment follow-up, or travel advice.
          </p>
          <a
            href={`mailto:${dashboard?.tenant.supportEmail ?? "support@lankatrails.example"}`}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950"
          >
            {dashboard?.tenant.supportEmail ?? "support@lankatrails.example"}
          </a>
        </section>
      </div>
    </section>
  );
}

function InfoPair({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function Row({
  label,
  value,
  badgeClassName,
}: {
  label: string;
  value: string;
  badgeClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className={`font-semibold text-slate-950 ${badgeClassName ? `rounded-full px-3 py-1 text-xs ${badgeClassName}` : ""}`}>
        {value}
      </span>
    </div>
  );
}

function BookingList({
  title,
  eyebrow,
  description,
  items,
  emptyText,
  tenantKey,
}: {
  title: string;
  eyebrow: string;
  description: string;
  items: DashboardBooking[];
  emptyText: string;
  tenantKey: string;
}) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {items.length ? (
          items.slice(0, 3).map((booking) => (
            <article key={booking.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{booking.reference}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">{booking.packageName}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {booking.destination}
                    {booking.serviceName ? ` · ${booking.serviceName}` : ""}
                    {booking.activityName ? ` · ${booking.activityName}` : ""}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Status value={booking.paymentStatus} />
                  <Link href={prefixTenantBasePath(getTenantBasePath(tenantKey), `/customer/bookings/${booking.reference}`)} className="text-sm font-semibold text-slate-700">
                    Open
                  </Link>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                <span>Travel {formatDate(booking.travelDate)}</span>
                <span>Paid {formatMoney(booking.paidAmount, booking.currency)}</span>
                <span>Total {formatMoney(booking.totalAmount, booking.currency)}</span>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
            {emptyText}
          </div>
        )}
      </div>
    </section>
  );
}

function InfoBlock({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p>
    </div>
  );
}

function BookingStart({ tenant }: { tenant: string }) {
  const basePath = getTenantBasePath(tenant);
  const [items, setItems] = useState<{
    destinations: TourismItem[];
    packages: TourismItem[];
    services: TourismItem[];
    activities: TourismItem[];
  }>({
    destinations: [],
    packages: [],
    services: [],
    activities: [],
  });

  useEffect(() => {
    let active = true;

    const load = async () => {
      const [destinationsNext, packagesNext, servicesNext, activitiesNext] = await Promise.all([
        loadCollection(tenant, "destinations"),
        loadCollection(tenant, "packages"),
        loadCollection(tenant, "services"),
        loadCollection(tenant, "activities"),
      ]);

      if (active) {
        setItems({
          destinations: destinationsNext,
          packages: packagesNext,
          services: servicesNext,
          activities: activitiesNext,
        });
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [tenant]);

  const destination = items.destinations[0];
  const pkg = items.packages[0];
  const service = items.services[0];
  const activity = items.activities[0];

  return (
    <section className="mx-auto max-w-7xl px-5 py-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Customer portal</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950">Start booking</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Start with the trip story, then capture the booking details. The flow below mirrors the public start booking page so customers and staff see the same context.
          </p>

          <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Live booking flow</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950">Use the Laravel-backed booking page</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  The live booking form already submits to the backend API. This portal route now forwards customers there instead of keeping a separate mock form.
                </p>
              </div>
              <Link href={prefixTenantBasePath(basePath, "/booking/start")} className="inline-flex rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                Open live booking form
              </Link>
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-lg">
            <p className="text-xs uppercase tracking-[0.24em] text-white/60">Trip preview</p>
            <h2 className="mt-3 text-2xl font-semibold">A guided booking story</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              {destination?.description ?? "Live destination details will appear here."} {pkg?.description ?? "Live package details will appear here."}
            </p>
          </div>

          {[destination, pkg, service, activity].map((item, index) => (
            <div key={index} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{item?.subtitle ?? "Loading"}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">{item?.title ?? "Live record"}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item?.description ?? "This card is sourced from the associated table."}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingConfirmation() {
  const params = useSearchParams();
  const bookingId = params.get("bookingId") ?? params.get("reference") ?? "";
  const customerName = params.get("customerName") ?? "Customer";
  const packageName = params.get("packageName") ?? "Booking";
  const destination = params.get("destination") ?? "Sri Lanka";
  const totalAmount = params.get("totalAmount") ?? "";
  const bookingStatus = params.get("bookingStatus") ?? "pending";
  const paymentStatus = params.get("paymentStatus") ?? "pending";

  return (
    <section className="mx-auto max-w-7xl px-5 py-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <Status value={bookingStatus} />
        <h1 className="mt-4 text-3xl font-semibold text-slate-950">Booking request received</h1>
        <p className="mt-2 text-sm text-slate-600">
          This confirmation reflects the live booking payload passed through the Laravel backend.
        </p>
        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase text-slate-500">Reference</dt>
            <dd className="font-semibold">{bookingId || "Not supplied yet"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-500">Status</dt>
            <dd className="font-semibold">{bookingStatus}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-500">Customer</dt>
            <dd className="font-semibold">{customerName}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-500">Total</dt>
            <dd className="font-semibold">{totalAmount ? `LKR ${Number(totalAmount).toLocaleString("en-US")}` : "Not supplied yet"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-500">Package</dt>
            <dd className="font-semibold">{packageName}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-500">Destination</dt>
            <dd className="font-semibold">{destination}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-500">Payment status</dt>
            <dd className="font-semibold">{paymentStatus}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-8">
      <h1 className="text-3xl font-semibold text-slate-950">Contact</h1>
      <form className="mt-6 grid max-w-3xl gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <label className="grid gap-2 text-sm font-medium">Name<input className="rounded-md border border-slate-300 px-3 py-2" /></label>
        <label className="grid gap-2 text-sm font-medium">Email<input type="email" className="rounded-md border border-slate-300 px-3 py-2" /></label>
        <label className="grid gap-2 text-sm font-medium">Message<textarea className="min-h-28 rounded-md border border-slate-300 px-3 py-2" /></label>
        <button type="button" className="w-fit rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Send inquiry</button>
      </form>
    </section>
  );
}

export default function TenantBusinessPortal({ tenant, path }: Props) {
  const parts = path.split("/").filter(Boolean);
  const section = parts[0] as SectionKey | "customer" | "booking" | "contact";
  const slug = parts[1];
  const [schema, setSchema] = useState<PageSchema>(fallbackSchema);
  const [contentDatas, setContentDatas] = useState<ContentDataSnapshot[]>([]);
  const [, setDesignerState] = useState<DesignerState>(initialDesignerState);
  const resolvedTenant = tenant.trim();

  useEffect(() => {
    let active = true;

    async function loadSchema() {
      setContentDatas([]);
      const next = await fetchTenantSchema(resolvedTenant);
      if (!active) return;

      setSchema({
        header: next?.schema?.header ?? fallbackSchema.header,
        footer: next?.schema?.footer ?? fallbackSchema.footer,
      });
      setContentDatas(next?.content_datas ?? []);
    }

    void loadSchema();

    return () => {
      active = false;
    };
  }, [resolvedTenant]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {schema.header ? (
        <RenderComponent
          component={schema.header}
          isDesigner={false}
          isRoot={true}
          section="header"
          setShowComponentModal={() => {}}
          setDesignerState={setDesignerState}
          tenantKey={resolvedTenant}
          pageSlug={path}
          contentDatas={contentDatas}
        />
      ) : null}
      {section === "destinations" && !slug ? <DestinationGrid tenant={resolvedTenant} /> : null}
      {section in sections && section !== "destinations" && !slug ? <ConnectedItemGrid tenant={tenant} section={section as SectionKey} /> : null}
      {section in sections && slug ? <Detail tenant={resolvedTenant} section={section as SectionKey} slug={slug} /> : null}
      {section === "customer" ? <CustomerDashboard tenant={resolvedTenant} /> : null}
      {section === "booking" && slug === "start" ? <BookingStart tenant={resolvedTenant} /> : null}
      {section === "booking" && slug === "confirmation" ? <BookingConfirmation /> : null}
      {section === "contact" ? <Contact /> : null}
      {schema.footer ? (
        <RenderComponent
          component={schema.footer}
          isDesigner={false}
          isRoot={true}
          section="footer"
          setShowComponentModal={() => {}}
          setDesignerState={setDesignerState}
          tenantKey={resolvedTenant}
          pageSlug={path}
          contentDatas={contentDatas}
        />
      ) : null}
    </main>
  );
}
