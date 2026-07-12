"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RenderComponent, {
  type ContentDataSnapshot,
} from "@/app/designer/[tenant]/widgets/palette/RenderComponent";
import { sitePage } from "@/app/designer/[tenant]/widgets/palette/data";
import type { ComponentNode, DesignerState } from "@/app/designer/[tenant]/widgets/palette/types";
import { DestinationCard } from "@/src/shared/components/tourism";
import {
  bookings,
  inquiries,
  reviews,
  type TourismItem,
} from "@/src/shared/tourism/demoData";
import { http } from "@/src/api/config/http";

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

function CustomerDashboard() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-8">
      <h1 className="text-3xl font-semibold text-slate-950">Customer dashboard</h1>
      <p className="mt-1 text-sm text-slate-600">Your booking requests, inquiries, and reviews.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">Bookings</p><p className="mt-2 text-3xl font-semibold">{bookings.length}</p></div>
        <div className="rounded-lg border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">Inquiries</p><p className="mt-2 text-3xl font-semibold">{inquiries.length}</p></div>
        <div className="rounded-lg border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">Reviews</p><p className="mt-2 text-3xl font-semibold">{reviews.length}</p></div>
      </div>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white">
        {bookings.map((booking) => (
          <div key={booking.id} className="flex flex-col gap-3 border-b border-slate-200 p-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-slate-950">{booking.title}</p>
              <p className="mt-1 text-sm text-slate-600">{booking.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <Status value={booking.status} />
              <span className="text-sm font-semibold">{booking.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
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

          <form className="mt-6 grid gap-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">Full name<input className="rounded-xl border border-slate-300 px-3 py-2" /></label>
            <label className="grid gap-2 text-sm font-medium">Email<input type="email" className="rounded-xl border border-slate-300 px-3 py-2" /></label>
            <label className="grid gap-2 text-sm font-medium">Travel date<input type="date" className="rounded-xl border border-slate-300 px-3 py-2" /></label>
            <label className="grid gap-2 text-sm font-medium">Travelers<input type="number" min="1" defaultValue="2" className="rounded-xl border border-slate-300 px-3 py-2" /></label>
            <label className="grid gap-2 text-sm font-medium lg:col-span-2">Notes<textarea className="min-h-28 rounded-xl border border-slate-300 px-3 py-2" /></label>
            <div className="lg:col-span-2">
              <Link href={prefixTenantBasePath(basePath, "/booking/confirmation")} className="inline-flex rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                Submit booking request
              </Link>
            </div>
          </form>
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
  return (
    <section className="mx-auto max-w-7xl px-5 py-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <Status value="pending" />
        <h1 className="mt-4 text-3xl font-semibold text-slate-950">Booking request received</h1>
        <p className="mt-2 text-sm text-slate-600">Our team will contact you to confirm availability, payment, and the final journey setup.</p>
        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          <div><dt className="text-xs uppercase text-slate-500">Reference</dt><dd className="font-semibold">TBK-2026-000001</dd></div>
          <div><dt className="text-xs uppercase text-slate-500">Status</dt><dd className="font-semibold">Pending</dd></div>
          <div><dt className="text-xs uppercase text-slate-500">Customer</dt><dd className="font-semibold">Demo Traveler</dd></div>
          <div><dt className="text-xs uppercase text-slate-500">Total</dt><dd className="font-semibold">LKR 185,000</dd></div>
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
      {section === "customer" ? <CustomerDashboard /> : null}
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
