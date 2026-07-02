"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import ContentPanel from "./ContentPanel";
import SideNav from "./SideNav";
import { ComponentNode, DesignerState } from "./palette/types";
import { sitePage } from "./palette/data";
import { initializeDesignStates } from "./componentService";
import ComponentModal from "./componentService";
import {
  deleteTenantPage,
  listTenantPages,
  loadTenantPage,
  saveTenantPage,
  updateTenantPage,
} from "@/src/api/routes/designer/page";

type TenantPageRecord = {
  slug?: string;
  title?: string;
  status?: string;
  schema?: {
    header?: ComponentNode;
    template?: ComponentNode;
    footer?: ComponentNode;
  };
};

type PageStatus = "draft" | "published";

type TenantPageComponentPayload = {
  component_type: string;
  variant?: string | null;
  sort_order?: number;
  is_enabled?: boolean;
  fields?: TenantPageFieldPayload[];
  repeaters?: unknown[];
};

type TenantPageFieldPayload = {
  field_key: string;
  field_type: "string" | "text" | "int" | "bool" | "decimal" | "asset" | "url";
  value_string?: string | null;
  value_text?: string | null;
  value_int?: number | null;
  value_bool?: boolean | null;
  value_decimal?: number | null;
  value_asset_id?: number | null;
};

const normalizeTenantValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
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

const unwrapRecord = (value: unknown): TenantPageRecord | null => {
  const record = asRecord(unwrapPayload(value));
  if (!record) {
    return null;
  }

  const candidates = [record.page, record.item, record];
  for (const candidate of candidates) {
    const nested = asRecord(candidate);
    if (nested) {
      return nested as TenantPageRecord;
    }
  }

  return record as TenantPageRecord;
};

const unwrapCollection = (value: unknown): TenantPageRecord[] => {
  const payload = unwrapPayload(value);
  const record = asRecord(payload);
  const candidates = [payload, record?.pages, record?.items];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as TenantPageRecord[];
    }
    const nested = asRecord(candidate);
    if (!nested) {
      continue;
    }
    const arrayCandidate = [nested.data, nested.pages, nested.items];
    for (const item of arrayCandidate) {
      if (Array.isArray(item)) {
        return item as TenantPageRecord[];
      }
    }
  }

  return [];
};

const resolveSchema = (record: TenantPageRecord | null | undefined) => ({
  header: record?.schema?.header ?? sitePage.header,
  template: record?.schema?.template ?? sitePage.template,
  footer: record?.schema?.footer ?? sitePage.footer,
});

const asPlainObject = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
};

const isDataBoundNode = (node: ComponentNode) =>
  !!node.dataBinding?.source && node.dataBinding.source !== "static";

const sanitizeSchemaNode = (node: ComponentNode): ComponentNode => {
  const children = node.children ?? [];
  const nextChildren = isDataBoundNode(node) ? children.slice(0, 1) : children;

  return {
    ...node,
    children: nextChildren.map(sanitizeSchemaNode),
  };
};

const toField = (
  fieldKey: string,
  value: unknown,
): TenantPageFieldPayload | null => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value === "boolean") {
    return {
      field_key: fieldKey,
      field_type: "bool",
      value_bool: value,
    };
  }

  if (typeof value === "number") {
    return Number.isInteger(value)
      ? {
          field_key: fieldKey,
          field_type: "int",
          value_int: value,
        }
      : {
          field_key: fieldKey,
          field_type: "decimal",
          value_decimal: value,
        };
  }

  if (typeof value === "string") {
    return {
      field_key: fieldKey,
      field_type: "string",
      value_string: value,
    };
  }

  return {
    field_key: fieldKey,
    field_type: "text",
    value_text: JSON.stringify(value),
  };
};

const serializeNode = (
  node: ComponentNode,
  section: "header" | "template" | "footer",
  sortOrder: number,
): TenantPageComponentPayload => {
  const propsObject = asPlainObject(node.props);
  const layoutObject = asPlainObject(node.layout);
  const styleObject = asPlainObject(node.style);
  const runtimeObject = asPlainObject(node.runtime);
  const repeatObject = asPlainObject(node.runtime?.repeat);

  const fields = [
    toField("section", section),
    toField("node_id", node.id),
    toField("parent_id", node.parentId ?? ""),
    toField("name", node.name ?? ""),
    toField("hidden", !!node.hidden),
    toField("locked", !!node.locked),
    toField("props_json", propsObject ?? node.props),
    toField("layout_json", layoutObject ?? node.layout ?? {}),
    toField("style_json", styleObject ?? node.style ?? {}),
    toField("runtime_json", runtimeObject ?? node.runtime ?? {}),
    toField("repeat_json", repeatObject ?? node.runtime?.repeat ?? {}),
    toField("children_count", node.children?.length ?? 0),
  ].filter(Boolean) as TenantPageFieldPayload[];

  return {
    component_type: node.type,
    variant:
      typeof node.runtime?.repeat?.targetResource === "string"
        ? node.runtime.repeat.targetResource
        : null,
    sort_order: sortOrder,
    is_enabled: !node.hidden,
    fields,
    repeaters: [],
  };
};

const serializeTree = (
  node: ComponentNode,
  section: "header" | "template" | "footer",
  state: { count: number },
): TenantPageComponentPayload[] => {
  state.count += 1;
  const current = serializeNode(node, section, state.count);
  const next = [current];

  if (isDataBoundNode(node)) {
    return next;
  }

  for (const child of node.children ?? []) {
    next.push(...serializeTree(child, section, state));
  }

  return next;
};

const serializePageComponents = (nodes: {
  header: ComponentNode;
  template: ComponentNode;
  footer: ComponentNode;
}): TenantPageComponentPayload[] => {
  const state = { count: 0 };
  return [
    ...serializeTree(nodes.header, "header", state),
    ...serializeTree(nodes.template, "template", state),
    ...serializeTree(nodes.footer, "footer", state),
  ];
};

export default function MainPanel() {
  const params = useParams();
  const tenantKey = useMemo(
    () =>
      normalizeTenantValue(
        (params as Record<string, string | string[] | undefined>)?.tenant,
      ),
    [params],
  );

  const [open, setOpen] = useState(true);

  const [headerNode, setHeaderNode] = useState<ComponentNode>(sitePage.header);
  const [templateNode, setTemplateNode] = useState<ComponentNode>(
    sitePage.template,
  );
  const [footerNode, setFooterNode] = useState<ComponentNode>(sitePage.footer);

  const [designerState, setDesignerState] = useState<DesignerState>({
    header: {
      nodes: {},
      rootIds: [],
    },
    template: {
      nodes: {},
      rootIds: [],
    },
    footer: {
      nodes: {},
      rootIds: [],
    },
    selectedSection: null,
    selectedId: null,
    insertIndex: null,
    hoveredSection: null,
    hoveredId: null,
    history: [],
    future: [],
  });

  const [showComponentModel, setShowComponentModal] = useState(false);
  const [pages, setPages] = useState<TenantPageRecord[]>([]);
  const [currentPage, setCurrentPage] = useState<TenantPageRecord | null>(null);
  const [pageSlug, setPageSlug] = useState("home");
  const [pageTitle, setPageTitle] = useState("Home");
  const [pageStatus, setPageStatus] = useState<PageStatus>("published");
  const [pageLoading, setPageLoading] = useState(false);
  const [pageSaving, setPageSaving] = useState(false);
  const [pageMessage, setPageMessage] = useState("");

  const applyPageRecord = (record: TenantPageRecord | null) => {
    const schema = resolveSchema(record);
    setHeaderNode(schema.header);
    setTemplateNode(schema.template);
    setFooterNode(schema.footer);

    if (record?.slug) {
      setPageSlug(record.slug);
    }
    if (record?.title) {
      setPageTitle(record.title);
    }
    if (record?.status === "draft" || record?.status === "published") {
      setPageStatus(record.status);
    }
  };

  const refreshPages = useCallback(async () => {
    if (!tenantKey) {
      setPages([]);
      return;
    }

    try {
      const response = await listTenantPages(tenantKey);
      setPages(unwrapCollection(response));
    } catch {
      setPages([]);
    }
  }, [tenantKey]);

  const loadPage = useCallback(
    async (slug: string, silent = false) => {
      if (!tenantKey || !slug.trim()) {
        return;
      }

      setPageLoading(true);
      if (!silent) {
        setPageMessage("");
      }

      try {
        const response = await loadTenantPage(tenantKey, slug.trim());
        const record = unwrapRecord(response);

        if (!record) {
          setCurrentPage(null);
          applyPageRecord(null);
          if (!silent) {
            setPageMessage(
              `No saved page found for "${slug}". Using the default layout.`,
            );
          }
          return;
        }

        setCurrentPage(record);
        applyPageRecord(record);
        initializeDesignStates(
          resolveSchema(record).template,
          setDesignerState,
        );

        if (!silent) {
          setPageMessage(`Loaded "${record.title ?? record.slug ?? slug}".`);
        }
      } catch (error) {
        setCurrentPage(null);
        applyPageRecord(null);
        if (!silent) {
          setPageMessage(
            error instanceof Error ? error.message : "Unable to load page.",
          );
        }
      } finally {
        setPageLoading(false);
      }
    },
    [tenantKey],
  );

  const handleSavePage = async () => {
    if (!tenantKey) {
      return;
    }

    setPageSaving(true);
    setPageMessage("");

    const payload = {
      tenantKey,
      slug: pageSlug.trim() || "home",
      title: pageTitle.trim() || pageSlug.trim() || "Home",
      status: pageStatus,
      schema: {
        header: sanitizeSchemaNode(headerNode),
        template: sanitizeSchemaNode(templateNode),
        footer: sanitizeSchemaNode(footerNode),
      },
      components: serializePageComponents({
        header: headerNode,
        template: templateNode,
        footer: footerNode,
      }),
    };

    try {
      const existingSlug =
        currentPage?.slug ??
        pages.find((page) => page.slug === payload.slug)?.slug;
      const response = existingSlug 
        ? await updateTenantPage(payload, existingSlug)
        : await saveTenantPage(payload);
      const record = unwrapRecord(response);

      if (record) {
        setCurrentPage(record);
        setPageSlug(record.slug ?? payload.slug);
        setPageTitle(record.title ?? payload.title);
        setPageStatus(
          record.status === "draft" || record.status === "published"
            ? record.status
            : payload.status,
        );
      }

      setPageMessage(`Saved "${payload.slug}" successfully.`);
      await refreshPages();
    } catch (error) {
      setPageMessage(
        error instanceof Error ? error.message : "Unable to save page.",
      );
    } finally {
      setPageSaving(false);
    }
  };

  const handleDeletePage = async () => {
    if (!tenantKey || !pageSlug.trim()) {
      return;
    }

    if (!window.confirm(`Delete page "${pageSlug}"?`)) {
      return;
    }

    setPageSaving(true);
    setPageMessage("");

    try {
      await deleteTenantPage(tenantKey, pageSlug.trim());
      setCurrentPage(null);
      setPageSlug("home");
      setPageTitle("Home");
      setPageStatus("published");
      applyPageRecord(null);
      setPageMessage(`Deleted "${pageSlug}".`);
      await refreshPages();
    } catch (error) {
      setPageMessage(
        error instanceof Error ? error.message : "Unable to delete page.",
      );
    } finally {
      setPageSaving(false);
    }
  };

  useEffect(() => {
    if (!tenantKey) {
      return;
    }

    setCurrentPage(null);
    setPageSlug("home");
    setPageTitle("Home");
    setPageStatus("published");
    applyPageRecord(null);

    void refreshPages();
    void loadPage("home", true);
  }, [tenantKey, loadPage, refreshPages]);

  useEffect(() => {
    initializeDesignStates(templateNode, setDesignerState);
  }, [templateNode]);

  useEffect(() => {
    console.log(designerState);
  }, [designerState]);

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col overflow-hidden bg-bg sm:h-[calc(100dvh-4rem)]">
      <div className="shrink-0 border-b border-border bg-white/90 px-4 py-3 backdrop-blur">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-gray-500">
                Tenant content
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {tenantKey || "Unknown tenant"}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-gray-500">Pages</span>
                <select
                  className="rounded-md border border-border bg-white px-3 py-2 text-sm outline-none"
                  value={pageSlug}
                  onChange={(event) => {
                    const nextSlug = event.target.value;
                    setPageSlug(nextSlug);
                    void loadPage(nextSlug);
                  }}
                >
                  <option value="home">home</option>
                  {pages.map((page) => (
                    <option
                      key={page.slug ?? page.title}
                      value={page.slug ?? "home"}
                    >
                      {page.title ?? page.slug ?? "untitled"}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-sm">
                <span className="text-gray-500">Slug</span>
                <input
                  className="rounded-md border border-border bg-white px-3 py-2 text-sm outline-none"
                  value={pageSlug}
                  onChange={(event) => setPageSlug(event.target.value)}
                  placeholder="home"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm">
                <span className="text-gray-500">Title</span>
                <input
                  className="rounded-md border border-border bg-white px-3 py-2 text-sm outline-none"
                  value={pageTitle}
                  onChange={(event) => setPageTitle(event.target.value)}
                  placeholder="Home"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm">
                <span className="text-gray-500">Status</span>
                <select
                  className="rounded-md border border-border bg-white px-3 py-2 text-sm outline-none"
                  value={pageStatus}
                  onChange={(event) =>
                    setPageStatus(event.target.value as PageStatus)
                  }
                >
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                </select>
              </label>

              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => void loadPage(pageSlug)}
                  disabled={pageLoading}
                  className="rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  {pageLoading ? "Loading..." : "Load"}
                </button>
                <button
                  type="button"
                  onClick={() => void handleSavePage()}
                  disabled={pageSaving}
                  className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-50"
                >
                  {pageSaving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => void handleDeletePage()}
                  disabled={pageSaving}
                  className="rounded-md border border-rose-400 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {pageMessage ? (
          <div className="mt-3 rounded-md border border-border bg-gray-50 px-3 py-2 text-sm text-gray-700">
            {pageMessage}
          </div>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <SideNav
          open={open}
          setOpen={setOpen}
          showComponentModel={showComponentModel}
          headerNode={headerNode}
          setHeaderNode={setHeaderNode}
          templateNode={templateNode}
          setTemplateNode={setTemplateNode}
          footerNode={footerNode}
          setFooterNode={setFooterNode}
          designerState={designerState}
          setDesignerState={setDesignerState}
          setShowComponentModal={setShowComponentModal}
        />

        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto overscroll-contain">
            <ContentPanel
              headerNode={headerNode}
              templateNode={templateNode}
              footerNode={footerNode}
              setHeaderNode={setHeaderNode}
              setTemplateNode={setTemplateNode}
              setFooterNode={setFooterNode}
              setDesignerState={setDesignerState}
              setShowComponentModal={setShowComponentModal}
            />
          </div>

          <ComponentModal
            open={showComponentModel}
            onOpenChange={setShowComponentModal}
            headerNode={headerNode}
            templateNode={templateNode}
            footerNode={footerNode}
            setHeaderNode={setHeaderNode}
            setTemplateNode={setTemplateNode}
            setFooterNode={setFooterNode}
            designerState={designerState}
            setDesignerState={setDesignerState}
          />
        </div>
      </div>
    </div>
  );
}

