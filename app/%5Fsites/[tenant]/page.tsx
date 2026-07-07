import SitePageClient from "./SitePageClient";
import CustomerIntakePortal from "./CustomerIntakePortal";
import TenantBusinessPortal from "./TenantBusinessPortal";
import TenantCustomerAuthPage from "./TenantCustomerAuthPage";
import { ComponentNode } from "@/app/designer/[tenant]/widgets/palette/types";

type PageSchema = {
  header?: ComponentNode;
  template?: ComponentNode;
  footer?: ComponentNode;
};

type PageRecord = {
  slug?: string;
  schema?: PageSchema;
};

type Props = {
  params: Promise<{
    tenant: string;
  }>;
  searchParams?: Promise<{
    path?: string | string[];
    token?: string | string[];
  }>;
};

const normalizePath = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] ?? "" : value ?? "";
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "/") {
    return "home";
  }

  return trimmed.replace(/^\/+/, "").replace(/\/+$/, "") || "home";
};

const businessRouteRoots = new Set([
  "destinations",
  "packages",
  "services",
  "activities",
  "customer",
  "booking",
  "contact",
]);

const isBusinessRoute = (path: string) => {
  const root = path.split("/").filter(Boolean)[0] ?? "";
  return businessRouteRoots.has(root);
};

const resolveSchema = (record?: PageRecord | null): PageSchema | null => {
  if (!record?.schema) {
    return null;
  }

  return {
    header: record.schema.header,
    template: record.schema.template,
    footer: record.schema.footer,
  };
};

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
};

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
    if (nested) {
      const nestedSchema = asRecord(nested.schema);
      if (nestedSchema) {
        return nested as PageRecord;
      }
    }
  }

  return null;
};

async function fetchTenantPage(tenant: string, slug: string): Promise<PageRecord | null> {
  const apiOrigin = (process.env.API_ORIGIN ?? process.env.NEXT_PUBLIC_API_ORIGIN ?? "").replace(/\/+$/, "");
  if (!apiOrigin) {
    return null;
  }

  const baseUrl = apiOrigin.endsWith("/") ? apiOrigin : `${apiOrigin}/`;
  const candidates = [
    `api/live/${encodeURIComponent(tenant)}/${encodeURI(slug)}`,
    `api/live/${encodeURIComponent(tenant)}`,
  ];

  for (const candidate of candidates) {
    const response = await fetch(new URL(candidate, baseUrl), {
      cache: "no-store",
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

export default async function Site({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const path = normalizePath(resolvedSearchParams?.path);

  if (path === "customer-intake") {
    const token = Array.isArray(resolvedSearchParams?.token)
      ? resolvedSearchParams.token[0]
      : resolvedSearchParams?.token;

    return <CustomerIntakePortal tenant={resolvedParams.tenant} token={token} />;
  }

  if (path === "signin" || path === "signup") {
    return (
      <TenantCustomerAuthPage
        tenant={resolvedParams.tenant}
        mode={path === "signin" ? "signin" : "signup"}
      />
    );
  }

  if (isBusinessRoute(path)) {
    return <TenantBusinessPortal tenant={resolvedParams.tenant} path={path} />;
  }

  const page = await fetchTenantPage(resolvedParams.tenant, path);

  return <SitePageClient tenant={resolvedParams.tenant} path={path} schema={resolveSchema(page)} />;
}
