"use client";

import { useEffect, useMemo, useState } from "react";
import RenderComponent from "@/app/designer/[tenant]/widgets/palette/RenderComponent";
import { DesignerState, ComponentNode } from "@/app/designer/[tenant]/widgets/palette/types";

type PageSchema = {
  header?: ComponentNode;
  template?: ComponentNode;
  footer?: ComponentNode;
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

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
};

const unwrapRecord = (value: unknown): PageSchema | null => {
  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const directSchema = asRecord(record.schema);
  if (directSchema) {
    return directSchema as PageSchema;
  }

  const candidates = [record.data, record.page, record.item];
  for (const candidate of candidates) {
    const nested = asRecord(candidate);
    if (nested) {
      const nestedSchema = asRecord(nested.schema);
      if (nestedSchema) {
        return nestedSchema as PageSchema;
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

  const url = new URL(
    `api/live/${encodeURIComponent(tenant)}/${encodeURI(slug)}`,
    apiOrigin.endsWith("/") ? apiOrigin : `${apiOrigin}/`,
  );

  const response = await fetch(url, {
    cache: "no-store",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as unknown;
  return unwrapRecord(payload);
}

export default function SiteRenderer({ tenant, path, schema }: Props) {
  const [, setDesignerState] = useState<DesignerState>(initialDesignerState);
  const [resolved, setResolved] = useState(resolveSchema(schema));

  const resolvedPath = useMemo(() => path || "home", [path]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        const next = await fetchTenantPage(tenant, resolvedPath);
        if (!active) {
          return;
        }

        setResolved(resolveSchema(next));
      } catch {
        if (active) {
          setResolved(resolveSchema(schema));
        }
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [tenant, resolvedPath, schema]);

  if (!resolved) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-white px-6 text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-semibold text-gray-900">Page unavailable</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            This tenant page could not be loaded from the backend.
          </p>
        </div>
      </main>
    );
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
        />
      ) : null}
    </main>
  );
}
