import SitePageClient from "./SitePageClient";
import { ComponentNode } from "@/app/designer/[tenant]/widgets/palette/types";

type PageSchema = {
  header?: ComponentNode;
  template?: ComponentNode;
  footer?: ComponentNode;
};

type PageRecord = {
  schema?: PageSchema;
};

type Props = {
  params: Promise<{
    tenant: string;
  }>;
  searchParams?: Promise<{
    path?: string | string[];
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

async function fetchTenantPage(tenant: string, slug: string): Promise<PageRecord | null> {
  const apiOrigin = (process.env.API_ORIGIN ?? process.env.NEXT_PUBLIC_API_ORIGIN ?? "").replace(/\/+$/, "");
  if (!apiOrigin) {
    return null;
  }

  const url = new URL(
    `api/live/${encodeURIComponent(tenant)}/${encodeURI(slug)}`,
    apiOrigin.endsWith("/") ? apiOrigin : `${apiOrigin}/`,
  );

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as unknown;
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  const record = payload as { data?: unknown; page?: unknown; item?: unknown; schema?: PageSchema };
  if (record.data && typeof record.data === "object" && !Array.isArray(record.data)) {
    return record.data as PageRecord;
  }

  if (record.page && typeof record.page === "object" && !Array.isArray(record.page)) {
    return record.page as PageRecord;
  }

  if (record.item && typeof record.item === "object" && !Array.isArray(record.item)) {
    return record.item as PageRecord;
  }

  return payload as PageRecord;
}

export default async function Site({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const path = normalizePath(resolvedSearchParams?.path);
  const page = await fetchTenantPage(resolvedParams.tenant, path);

  return <SitePageClient tenant={resolvedParams.tenant} path={path} schema={resolveSchema(page)} />;
}
