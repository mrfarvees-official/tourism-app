"use client";

import { useEffect, useMemo, useState } from "react";
import { sitePage } from "@/app/designer/[tenant]/widgets/palette/data";
import RenderComponent from "@/app/designer/[tenant]/widgets/palette/RenderComponent";
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

const getApiOrigin = () =>
  (process.env.NEXT_PUBLIC_API_ORIGIN ?? process.env.API_ORIGIN ?? "").replace(/\/+$/, "");

async function fetchTenantPage(tenant: string, slug: string): Promise<PageSchema | null> {
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
      return record.schema;
    }
  }

  return null;
}

export default function SiteRenderer({ tenant, path, schema }: Props) {
  const [, setDesignerState] = useState<DesignerState>(initialDesignerState);
  const [resolved, setResolved] = useState(resolveSchema(schema) ?? defaultSchema());
  const resolvedPath = useMemo(() => path || "home", [path]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        const next = await fetchTenantPage(tenant, resolvedPath);
        if (!active) {
          return;
        }

        setResolved(resolveSchema(next) ?? defaultSchema());
      } catch {
        if (active) {
          setResolved(resolveSchema(schema) ?? defaultSchema());
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
        />
      ) : null}
    </main>
  );
}
