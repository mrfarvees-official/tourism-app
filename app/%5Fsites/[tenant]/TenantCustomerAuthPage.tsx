"use client";

import { useEffect, useState } from "react";
import RenderComponent, {
  type ContentDataSnapshot,
} from "@/app/designer/[tenant]/widgets/palette/RenderComponent";
import { sitePage } from "@/app/designer/[tenant]/widgets/palette/data";
import type { ComponentNode, DesignerState } from "@/app/designer/[tenant]/widgets/palette/types";
import TenantAuthPortal from "./TenantAuthPortal";

type Mode = "signin" | "signup";

type PageSchema = {
  header?: ComponentNode;
  footer?: ComponentNode;
};

type PageRecord = {
  schema?: PageSchema;
  content_datas?: ContentDataSnapshot[];
};

type Props = {
  tenant: string;
  mode: Mode;
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

export default function TenantCustomerAuthPage({ tenant, mode }: Props) {
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
          pageSlug={mode}
          contentDatas={contentDatas}
        />
      ) : null}

      <div className="py-10">
        <TenantAuthPortal tenant={resolvedTenant} mode={mode} />
      </div>

      {schema.footer ? (
        <RenderComponent
          component={schema.footer}
          isDesigner={false}
          isRoot={true}
          section="footer"
          setShowComponentModal={() => {}}
          setDesignerState={setDesignerState}
          tenantKey={resolvedTenant}
          pageSlug={mode}
          contentDatas={contentDatas}
        />
      ) : null}
    </main>
  );
}
