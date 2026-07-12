"use client";

import { useEffect, useMemo, useState } from "react";
import { sitePage } from "@/app/designer/[tenant]/widgets/palette/data";
import RenderComponent, { type ContentDataSnapshot } from "@/app/designer/[tenant]/widgets/palette/RenderComponent";
import { DesignerState, ComponentNode } from "@/app/designer/[tenant]/widgets/palette/types";

type PageSchema = {
  header?: ComponentNode;
  template?: ComponentNode;
  footer?: ComponentNode;
};

type PageRecord = {
  slug?: string;
  schema?: PageSchema;
};

type DestinationRow = Record<string, unknown>;
type DestinationChildSnapshot = NonNullable<ContentDataSnapshot["children"]>[number];

type Props = {
  tenant: string;
  path: string;
  schema: PageSchema | null;
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

const resolveSchema = (schema?: PageSchema | null): PageSchema | null => {
  if (!schema) {
    return null;
  }

  return {
    header: schema.header,
    template: schema.template,
    footer: schema.footer,
  };
};

const defaultSchema = (): PageSchema => ({
  header: sitePage.header,
  template: sitePage.template,
  footer: sitePage.footer,
});

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

const unwrapArray = (value: unknown): unknown[] | null => {
  if (Array.isArray(value)) {
    return value;
  }

  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const candidates = [record.data, record.items, record.results, record.rows];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }

    if (candidate && typeof candidate === "object") {
      const nested = asRecord(candidate);
      if (!nested) {
        continue;
      }

      const nestedCandidates = [nested.data, nested.items, nested.results, nested.rows];
      for (const nestedCandidate of nestedCandidates) {
        if (Array.isArray(nestedCandidate)) {
          return nestedCandidate;
        }
      }
    }
  }

  return null;
};

const toDestinationChildSnapshot = (item: DestinationRow, index: number): DestinationChildSnapshot => ({
  source_key: "destination_collection",
  row_key: String(item.id ?? item.slug ?? index),
  sort_order: index,
  data: item,
});

const buildDestinationSnapshots = (items: DestinationRow[]): ContentDataSnapshot[] => {
  const children = items.map((item, index) => toDestinationChildSnapshot(item, index));

  return [
    {
      content_schema_menu: "destinations",
      data: {
        source: "destinations",
        content_schema_menu: "destinations",
        total: items.length,
      },
      children,
    },
    {
      content_schema_menu: "destinations",
      data: {
        source: "destinations",
        content_schema_menu: "destinations",
        total: items.length,
      },
      children,
    },
  ];
};

async function fetchTenantDestinations(tenant: string): Promise<ContentDataSnapshot[]> {
  try {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[site] destinations:fetch:start", { tenant });
    }
    const apiOrigin = getApiOrigin();
    if (!apiOrigin) {
      throw new Error("Missing API origin");
    }

    const response = await fetch(
      new URL(`/api/public/${encodeURIComponent(tenant)}/destinations`, `${apiOrigin}/`),
      {
        cache: "no-store",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      },
    );

    if (!response.ok) {
      if (process.env.NODE_ENV !== "production") {
        console.debug("[site] destinations:fetch:failed", {
          tenant,
          status: response.status,
          statusText: response.statusText,
        });
      }
      return [];
    }

    const payload = (await response.json()) as unknown;
    const rows = unwrapArray(unwrapPayload(payload));
    const items = Array.isArray(rows) ? rows.filter((row): row is DestinationRow => !!row && typeof row === "object" && !Array.isArray(row)) : [];
    const snapshots = buildDestinationSnapshots(items);

    if (process.env.NODE_ENV !== "production") {
      console.debug("[site] destinations:fetch:ok", {
        tenant,
        rowCount: items.length,
        snapshotMenus: snapshots.map((snapshot) => snapshot.content_schema_menu),
      });
    }

    return snapshots;
  } catch {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[site] destinations:fetch:error", { tenant });
    }
    return [];
  }
}

const getApiOrigin = () =>
  (process.env.NEXT_PUBLIC_API_ORIGIN ?? process.env.API_ORIGIN ?? "").replace(/\/+$/, "");

async function fetchTenantPage(tenant: string, slug: string): Promise<PageRecord | null> {
  const apiOrigin = getApiOrigin();
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

export default function SiteRenderer({ tenant, path, schema }: Props) {
  const [, setDesignerState] = useState<DesignerState>(initialDesignerState);
  const [resolved, setResolved] = useState(resolveSchema(schema) ?? defaultSchema());
  const [contentDatas, setContentDatas] = useState<ContentDataSnapshot[]>([]);
  const resolvedPath = useMemo(() => path || "home", [path]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setContentDatas([]);
      try {
        const [next, destinationSnapshots] = await Promise.all([
          fetchTenantPage(tenant, resolvedPath),
          fetchTenantDestinations(tenant),
        ]);
        if (!active) {
          return;
        }

        setResolved(resolveSchema(next?.schema) ?? defaultSchema());
        setContentDatas(destinationSnapshots);
        if (process.env.NODE_ENV !== "production") {
          console.debug("[site] renderer:hydrate", {
            tenant,
            path: resolvedPath,
            hasSchema: !!next?.schema,
            snapshotCount: destinationSnapshots.length,
          });
        }
      } catch {
        if (active) {
          setResolved(resolveSchema(schema) ?? defaultSchema());
          setContentDatas([]);
          if (process.env.NODE_ENV !== "production") {
            console.debug("[site] renderer:hydrate:error", { tenant, path: resolvedPath });
          }
        }
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [tenant, resolvedPath, schema]);

  if (!resolved) {
    return null;
  }

  return (
    <main className="w-full min-h-screen">
      {resolved.header ? (
        <RenderComponent
          component={resolved.header}
          isDesigner={false}
          isRoot={true}
          section="header"
          setShowComponentModal={() => {}}
          setDesignerState={setDesignerState}
          tenantKey={tenant}
          pageSlug={resolvedPath}
          contentDatas={contentDatas}
        />
      ) : null}
      {resolved.template ? (
        <RenderComponent
          component={resolved.template}
          isDesigner={false}
          isRoot={true}
          section="template"
          setShowComponentModal={() => {}}
          setDesignerState={setDesignerState}
          tenantKey={tenant}
          pageSlug={resolvedPath}
          contentDatas={contentDatas}
        />
      ) : null}
      {resolved.footer ? (
        <RenderComponent
          component={resolved.footer}
          isDesigner={false}
          isRoot={true}
          section="footer"
          setShowComponentModal={() => {}}
          setDesignerState={setDesignerState}
          tenantKey={tenant}
          pageSlug={resolvedPath}
          contentDatas={contentDatas}
        />
      ) : null}
    </main>
  );
}
