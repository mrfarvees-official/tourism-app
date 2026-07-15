import React, { Dispatch, SetStateAction } from "react";
import { ComponentNode, Dimension, Component, DesignerState } from "./types";
import { componentRegistry } from "./types";
import { http } from "@/src/api/config/http";
import {
  buildContactInquiryPayload,
  sendContactInquiry,
} from "@/src/api/routes/settings/contact";
import { logout } from "@/src/shared/redux/store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/shared/redux/store";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as IoIcons from "react-icons/io5";
import * as BsIcons from "react-icons/bs";
import * as HiIcons from "react-icons/hi2";
import * as LuIcons from "lucide-react";

function getSize(size?: Dimension): string | undefined {
  if (!size) return undefined;
  if (size.value === "auto") return "auto";
  return `${size.value}${size.unit ?? "px"}`;
}

function hasHref(props: ComponentNode["props"]): props is { href?: string } {
  return !!props && typeof props === "object" && "href" in props;
}

function hasSrc(props: ComponentNode["props"]): props is { src?: string } {
  return !!props && typeof props === "object" && "src" in props;
}

function hasText(props: ComponentNode["props"]): props is { text?: string } {
  return !!props && typeof props === "object" && "text" in props;
}

function resolveIcon(library: string, name: string) {
  switch (library) {
    case "fa":
      return FaIcons[name as keyof typeof FaIcons];

    case "md":
      return MdIcons[name as keyof typeof MdIcons];

    case "io":
      return IoIcons[name as keyof typeof IoIcons];

    case "bs":
      return BsIcons[name as keyof typeof BsIcons];

    case "hi":
      return HiIcons[name as keyof typeof HiIcons];

    case "lu":
      return LuIcons[name as keyof typeof LuIcons];

    default:
      return null;
  }
}

function hasObjectFit(
  props: ComponentNode["props"],
): props is { objectFit?: React.CSSProperties["objectFit"] } {
  return !!props && typeof props === "object" && "objectFit" in props;
}

function isAuthLinkLabel(text: string) {
  const normalized = text.trim().toLowerCase();
  return normalized === "sign in" || normalized === "sign up";
}

type HoverContextType = {
  hoveredId: string | null;
  setHoveredId: React.Dispatch<React.SetStateAction<string | null>>;
};

const HoverContext = React.createContext<HoverContextType | null>(null);
type FormContextType = {
  insideForm: boolean;
};
const FormContext = React.createContext<FormContextType | null>(null);
const DESIGNER_IMAGE_SRC = "/no-image.jpg";
const RESOURCE_SOURCES = new Set([
  "product",
  "collection",
  "destinations",
  "packages",
  "services",
  "customer",
  "cart",
  "form",
  "custom",
]);
const RESOURCE_HINTS = ["product", "collection", "destination"];
const DESIGNER_REPEAT_PREVIEW_COUNT = 3;

type ResourceSpec = {
  resource: string;
  variant?: string;
  raw: string;
};

function parseResourceSpec(value?: string | null): ResourceSpec | null {
  const trimmed = value?.trim();
  if (!trimmed) {
    return null;
  }

  let resource = trimmed;
  let variant: string | undefined;

  const slashIndex = resource.lastIndexOf("/");
  if (slashIndex >= 0) {
    const base = resource.slice(0, slashIndex).trim();
    const suffix = resource.slice(slashIndex + 1).trim();
    if (base) {
      resource = base;
    }
    if (suffix) {
      variant = suffix;
    }
  }

  const colonIndex = resource.lastIndexOf(":");
  if (colonIndex >= 0) {
    const base = resource.slice(0, colonIndex).trim();
    const suffix = resource.slice(colonIndex + 1).trim();
    if (base) {
      resource = base;
    }
    if (suffix) {
      variant = suffix;
    }
  }

  if (variant?.includes(":")) {
    const variantParts = variant.split(":").filter(Boolean);
    variant = variantParts[variantParts.length - 1] ?? variant;
  }

  return {
    resource,
    variant: variant || undefined,
    raw: trimmed,
  };
}

function resolveResourceSpec(
  ...values: Array<string | null | undefined>
): ResourceSpec | null {
  const parsed = values
    .map((value) => parseResourceSpec(value))
    .filter((value): value is ResourceSpec => value !== null);

  if (parsed.length === 0) {
    return null;
  }

  return (
    parsed.find((value) => !!value.variant) ?? parsed[0] ?? null
  );
}

function normalizePublicResourceKey(value?: string | null): string | null {
  const parsed = parseResourceSpec(value);
  const resource = parsed?.resource.toLowerCase();
  if (!resource) {
    return null;
  }

  if (["destination", "destinations", "destination_collection"].includes(resource)) {
    return "destinations";
  }

  if (
    [
      "tour_package",
      "tour-packages",
      "package",
      "packages",
      "featured-tour-packages",
      "featured-tour-package",
      "tour-highlight",
      "trip-hotspots",
      "recommended-tours",
    ].includes(resource)
  ) {
    return "packages";
  }

  if (
    [
      "service",
      "services",
      "tourism-service",
      "tourism-services",
      "service-categories",
      "accommodations",
      "transport-options",
    ].includes(resource)
  ) {
    return "services";
  }

  return resource;
}

export type ContentDataChildFieldSnapshot = {
  field_key: string;
  source_column?: string | null;
  field_type?: "string" | "text" | "int" | "bool" | "decimal" | "asset" | "url";
  value_string?: string | null;
  value_text?: string | null;
  value_int?: number | null;
  value_bool?: boolean | null;
  value_decimal?: number | null;
  value_asset_id?: number | null;
};

export type ContentDataChildSnapshot = {
  source_key?: string | null;
  row_key?: string | null;
  sort_order?: number;
  payload?: Record<string, unknown> | unknown[] | null;
  data?: Record<string, unknown> | unknown[] | null;
  fields?: ContentDataChildFieldSnapshot[];
};

export type ContentDataSnapshot = {
  content_schema_menu: string;
  data: Record<string, unknown>;
  children?: ContentDataChildSnapshot[];
};

const ContentDataContext = React.createContext<ContentDataSnapshot[] | null>(
  null,
);

function hasResourceHint(component: ComponentNode) {
  const haystack = `${component.id} ${component.name ?? ""}`.toLowerCase();
  return RESOURCE_HINTS.some((hint) => haystack.includes(hint));
}

function readPath(obj: unknown, path?: string): unknown {
  if (!obj || !path) return undefined;
  return path
    .split(".")
    .filter(Boolean)
    .reduce<unknown>((acc, key) => {
      if (
        acc &&
        typeof acc === "object" &&
        key in (acc as Record<string, unknown>)
      ) {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
}

function childFieldToValue(field: ContentDataChildFieldSnapshot) {
  return (
    field.value_bool ??
    field.value_int ??
    field.value_decimal ??
    field.value_string ??
    field.value_text ??
    field.value_asset_id
  );
}

function childSnapshotToRuntimeItem(child: ContentDataChildSnapshot): unknown {
  if (
    child.data &&
    typeof child.data === "object" &&
    !Array.isArray(child.data)
  ) {
    return child.data;
  }

  if (
    child.payload &&
    typeof child.payload === "object" &&
    !Array.isArray(child.payload)
  ) {
    return child.payload;
  }

  if (Array.isArray(child.fields) && child.fields.length > 0) {
    return child.fields.reduce<Record<string, unknown>>((acc, field) => {
      const key = field.source_column?.trim() || field.field_key?.trim();
      if (!key) {
        return acc;
      }

      acc[key] = childFieldToValue(field);
      return acc;
    }, {});
  }

  return child.data ?? child.payload ?? null;
}

function unwrapArray(payload: unknown): unknown[] | null {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return null;

  const record = payload as Record<string, unknown>;
  const candidates = [record.data, record.items, record.results, record.rows];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
    if (candidate && typeof candidate === "object") {
      const nested = candidate as Record<string, unknown>;
      if (Array.isArray(nested.data)) return nested.data;
      if (Array.isArray(nested.items)) return nested.items;
      if (Array.isArray(nested.results)) return nested.results;
      if (Array.isArray(nested.rows)) return nested.rows;
    }
  }

  return null;
}

function hasDataBinding(component: ComponentNode) {
  return (
    !!component.dataBinding?.source && component.dataBinding.source !== "static"
  );
}

function extractTextValue(component: ComponentNode): string | undefined {
  const firstChild = component.children?.[0];
  if (!firstChild || firstChild.type !== "Text") {
    return undefined;
  }

  const props = firstChild.props as { text?: string } | undefined;
  return props?.text;
}

function isContactMessageBox(component: ComponentNode): boolean {
  return (
    component.id === "contact_form_comment_box" ||
    component.name === "Trip request"
  );
}

function isTripRequestTextarea(component: ComponentNode): boolean {
  if (component.type !== "Frame") {
    return false;
  }

  const placeholder = extractTextValue(component)?.toLowerCase() ?? "";
  return (
    placeholder.includes("tell us your destination") ||
    (placeholder.includes("travel dates") &&
      placeholder.includes("group size")) ||
    placeholder.includes("preferred experiences")
  );
}

function getTenantKeyFromLocation(): string | null {
  if (typeof window === "undefined") return null;
  const parts = window.location.pathname.split("/").filter(Boolean);
  if (parts[0] === "admin" || parts[0] === "designer") return parts[1] ?? null;
  if (parts[0] === "sites") return parts[1] ?? null;
  if (parts[0] === "_sites") return parts[1] ?? null;
  const hostParts = window.location.hostname.split(".").filter(Boolean);
  if (hostParts.length > 2) {
    const tenantKey = hostParts[0];
    if (
      tenantKey &&
      tenantKey !== "www" &&
      tenantKey !== "localhost" &&
      tenantKey !== "127"
    ) {
      return tenantKey;
    }
  }
  if (hostParts.length === 2 && hostParts[1] === "localhost") {
    const tenantKey = hostParts[0];
    if (tenantKey && tenantKey !== "www" && tenantKey !== "127") {
      return tenantKey;
    }
  }
  return null;
}

function getTenantBasePath(tenantKey: string | null | undefined): string {
  if (typeof window === "undefined" || !tenantKey) {
    return "";
  }

  const parts = window.location.pathname.split("/").filter(Boolean);
  if ((parts[0] === "sites" || parts[0] === "_sites") && parts[1] === tenantKey) {
    return `/sites/${tenantKey}`;
  }

  return "";
}

function prefixTenantBasePath(basePath: string, href: string): string {
  if (!basePath) {
    return href;
  }

  if (
    /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(href) ||
    href.startsWith("/api/") ||
    href.startsWith("/_next/") ||
    href.startsWith("/sites/") ||
    href.startsWith("/_sites/")
  ) {
    return href;
  }

  const normalizedHref = href.startsWith("/") ? href : `/${href}`;
  return `${basePath}${normalizedHref}`;
}

function buildTargetEndpoint({
  targetResource,
  endpoint,
  menu,
  limit,
  tenantKey,
}: {
  targetResource?: string;
  endpoint?: string;
  menu?: string;
  limit?: number;
  tenantKey?: string | null;
}): string {
  if (endpoint) {
    const compiled = endpoint.replaceAll(":tenantKey", tenantKey ?? "");
    return compiled;
  }

  const parsed = parseResourceSpec(targetResource);
  const resourceKey = normalizePublicResourceKey(parsed?.resource ?? targetResource);
  if (resourceKey === "destinations" || resourceKey === "packages" || resourceKey === "services") {
    const params = new URLSearchParams();
    if (parsed?.variant) {
      params.set("variant", parsed.variant);
    }
    if (typeof limit === "number" && Number.isFinite(limit)) {
      params.set("limit", String(limit));
    }

    const qs = params.toString();
    const base = tenantKey
      ? `/api/public/${encodeURIComponent(tenantKey)}/${resourceKey}`
      : `/api/public/${resourceKey}`;
    return qs ? `${base}?${qs}` : base;
  }

  const baseMap: Record<string, string> = {
    product: "/api/content",
    collection: "/api/content",
    customer: "/api/content",
    cart: "/api/content",
    form: "/api/content",
    custom: "/api/content",
  };

  const base = baseMap[resourceKey ?? ""] ?? "/api/content";
  const params = new URLSearchParams();
  if (tenantKey) params.set("tenantKey", tenantKey);
  if (menu) params.set("menu", menu);
  if (parsed?.resource && parsed.resource !== "custom") {
    params.set("resource", parsed.resource);
  } else if (targetResource && targetResource !== "custom") {
    params.set("resource", targetResource);
  }
  if (parsed?.variant) {
    params.set("variant", parsed.variant);
  }
  if (typeof limit === "number" && Number.isFinite(limit))
    params.set("limit", String(limit));

  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

function useRepeatableData({
  isDesigner,
  component,
}: {
  isDesigner: boolean;
  component: ComponentNode;
}) {
  const contentSnapshots = React.useContext(ContentDataContext);
  const [items, setItems] = React.useState<unknown[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [policy, setPolicy] = React.useState<{
    version: number;
    columnVisibility: Record<string, boolean>;
  }>({ version: 1, columnVisibility: {} });

  const runtime = component.runtime;
  const repeat = runtime?.repeat;
  const propsRepeat =
    component.props && typeof component.props === "object"
      ? (component.props as Record<string, unknown>).repeat
      : undefined;

  const cfg = (repeat ??
    (typeof propsRepeat === "object" && propsRepeat
      ? (propsRepeat as {
          enabled?: boolean;
          endpoint?: string;
          dataPath?: string;
        })
      : undefined)) as
    | { enabled?: boolean; endpoint?: string; dataPath?: string }
    | undefined;
  const cfgWithTarget = cfg as
    | {
        enabled?: boolean;
        endpoint?: string;
        dataPath?: string;
        targetResource?: string;
        menu?: string;
        limit?: number;
        policyPath?: string;
      }
    | undefined;
  const sourceSpec = resolveResourceSpec(
    component.runtime?.repeat?.targetResource,
    component.dataBinding?.source,
  );
  const sourceFallback = sourceSpec?.raw;
  const tenantKey = getTenantKeyFromLocation();
  const matchingSnapshot = React.useMemo(() => {
    if (isDesigner || !contentSnapshots?.length) {
      return null;
    }

    const componentId = component.id.trim();
    const sourceKeys = new Set<string>();
    for (const value of [
      component.runtime?.repeat?.menu,
      component.runtime?.repeat?.targetResource,
      component.dataBinding?.source,
    ]) {
      const parsed = parseResourceSpec(value);
      if (!parsed) {
        continue;
      }

      sourceKeys.add(parsed.resource.trim());
      const normalized = normalizePublicResourceKey(parsed.resource);
      if (normalized) {
        sourceKeys.add(normalized);
      }
      if (parsed.variant) {
        sourceKeys.add(`${parsed.resource.trim()}:${parsed.variant}`);
      }
    }

    return (
      contentSnapshots.find((snapshot) => {
        const snapshotComponentId = String(
          readPath(snapshot, "data.component_id") ??
            readPath(snapshot, "data.node_id") ??
            "",
        ).trim();
        if (snapshotComponentId && snapshotComponentId === componentId) {
          return true;
        }

        const snapshotMenu = normalizePublicResourceKey(
          snapshot.content_schema_menu.trim(),
        );
        return (
          sourceKeys.has(snapshot.content_schema_menu.trim()) ||
          (snapshotMenu ? sourceKeys.has(snapshotMenu) : false)
        );
      }) ?? null
    );
  }, [
    component.dataBinding?.source,
    component.id,
    component.runtime?.repeat?.menu,
    component.runtime?.repeat?.targetResource,
    contentSnapshots,
    isDesigner,
  ]);
  const snapshotItems = React.useMemo(() => {
    if (!matchingSnapshot) {
      if (process.env.NODE_ENV !== "production") {
        console.debug("[renderer] repeat:snapshot:none", {
          componentId: component.id,
          sourceFallback,
          contentSnapshotCount: contentSnapshots?.length ?? 0,
        });
      }
      return null;
    }

    const items = (matchingSnapshot.children ?? [])
      .map((child) => childSnapshotToRuntimeItem(child))
      .filter((item) => item != null);
    if (process.env.NODE_ENV !== "production") {
      console.debug("[renderer] repeat:snapshot:match", {
        componentId: component.id,
        sourceFallback,
        menu: matchingSnapshot.content_schema_menu,
        childCount: matchingSnapshot.children?.length ?? 0,
        itemCount: items.length,
      });
    }
    return items;
  }, [
    matchingSnapshot,
    component.id,
    sourceFallback,
    contentSnapshots?.length,
  ]);
  const resolvedEndpoint = buildTargetEndpoint({
    targetResource:
      resolveResourceSpec(cfgWithTarget?.targetResource, sourceFallback)?.raw ??
      cfgWithTarget?.targetResource ??
      sourceFallback,
    endpoint: cfgWithTarget?.endpoint,
    menu: cfgWithTarget?.menu,
    limit: cfgWithTarget?.limit,
    tenantKey,
  });

  const hasRuntimeDataBinding = !!sourceFallback && sourceFallback !== "static";
  const enabled =
    !isDesigner &&
    (matchingSnapshot !== null ||
      (!!resolvedEndpoint && (!!cfg?.enabled || hasRuntimeDataBinding)));
  const endpoint = resolvedEndpoint;
  const dataPath = cfg?.dataPath;
  const policyPath = cfgWithTarget?.policyPath;

  React.useEffect(() => {
    let cancelled = false;
    if (!enabled) {
      setItems(null);
      setLoading(false);
      return;
    }

    if (matchingSnapshot) {
      setItems(snapshotItems ?? []);
      setPolicy({ version: 1, columnVisibility: {} });
      setLoading(false);
      if (process.env.NODE_ENV !== "production") {
        console.debug("[renderer] repeat:hydrate:snapshot", {
          componentId: component.id,
          itemCount: (snapshotItems ?? []).length,
        });
      }
      return;
    }

    setLoading(true);
    if (process.env.NODE_ENV !== "production") {
      console.debug("[renderer] repeat:hydrate:fetch", {
        componentId: component.id,
        endpoint,
        dataPath,
      });
    }
    http
      .get(endpoint)
      .then((res) => {
        const payload: unknown = res.data;
        return payload;
      })
      .then((payload: unknown) => {
        if (cancelled) return;
        const basePayload =
          payload && typeof payload === "object" && !Array.isArray(payload)
            ? ((payload as Record<string, unknown>).data ??
              (payload as Record<string, unknown>).page ??
              (payload as Record<string, unknown>).item ??
              payload)
            : payload;
        const scoped = dataPath
          ? (readPath(basePayload, dataPath) ??
            readPath(payload, dataPath) ??
            basePayload)
          : basePayload;
        const policyCandidate = policyPath
          ? readPath(basePayload, policyPath)
          : readPath(basePayload, "meta.resourcePolicy");
        if (policyCandidate && typeof policyCandidate === "object") {
          const next = policyCandidate as {
            version?: unknown;
            columnVisibility?: unknown;
          };
          setPolicy({
            version: typeof next.version === "number" ? next.version : 1,
            columnVisibility:
              next.columnVisibility && typeof next.columnVisibility === "object"
                ? (next.columnVisibility as Record<string, boolean>)
                : {},
          });
        } else {
          setPolicy({ version: 1, columnVisibility: {} });
        }
        const nextItems = unwrapArray(scoped);
        if (process.env.NODE_ENV !== "production") {
          console.debug("[renderer] repeat:hydrate:fetch:ok", {
            componentId: component.id,
            endpoint,
            itemCount: nextItems?.length ?? 0,
          });
        }
        setItems(nextItems ?? []);
      })
      .catch(() => {
        if (cancelled) return;
        if (process.env.NODE_ENV !== "production") {
          console.debug("[renderer] repeat:hydrate:fetch:error", {
            componentId: component.id,
            endpoint,
          });
        }
        setItems([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    enabled,
    endpoint,
    dataPath,
    matchingSnapshot,
    policyPath,
    snapshotItems,
    component.id,
  ]);

  return {
    enabled,
    items,
    loading,
    policy,
    hasSnapshotData: matchingSnapshot !== null,
  };
}

type ImageCompareRendererProps = {
  componentName?: string;
  props: {
    beforeSrc: string;
    afterSrc: string;
    beforeAlt?: string;
    afterAlt?: string;
    value?: number;
  };
  wrapperStyle: React.CSSProperties;
  hoverProps: React.HTMLAttributes<HTMLDivElement>;
  resolveImageSrc: (src?: string) => string | undefined;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  renderAddChildControl: () => React.ReactNode;
};

function ImageCompareRenderer({
  componentName,
  props,
  wrapperStyle,
  hoverProps,
  resolveImageSrc,
  onImageError,
  renderAddChildControl,
}: ImageCompareRendererProps) {
  const [position, setPosition] = React.useState(props.value ?? 50);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const updatePosition = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, next)));
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return;
    updatePosition(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      style={{
        ...wrapperStyle,
        position: "relative",
        userSelect: "none",
        cursor: "ew-resize",
      }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        updatePosition(e.clientX);
      }}
      onPointerMove={onPointerMove}
      {...hoverProps}
    >
      <img
        src={resolveImageSrc(props.afterSrc)}
        alt={props.afterAlt ?? "After"}
        draggable={false}
        onError={onImageError}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          width: `${position}%`,
          overflow: "hidden",
        }}
      >
        <img
          src={resolveImageSrc(props.beforeSrc)}
          alt={props.beforeAlt ?? "Before"}
          draggable={false}
          onError={onImageError}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            maxWidth: "none",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${position}%`,
          width: 2,
          backgroundColor: "#ffffff",
          transform: "translateX(-50%)",
          zIndex: 2,
        }}
      />

      <div
        aria-label={componentName ?? "Image compare"}
        style={{
          position: "absolute",
          left: `${position}%`,
          top: "50%",
          width: 24,
          height: 24,
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          transform: "translate(-50%, -50%)",
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          color: "#111111",
        }}
      >
        ↔
      </div>

      {renderAddChildControl()}
    </div>
  );
}

function RenderComponentInner({
  component,
  isDesigner,
  isRoot,
  parentId,
  section,
  setShowComponentModal,
  setDesignerState,
  runtimeItem,
  resourceIntent,
  tenantKey,
  pageSlug,
}: {
  component: ComponentNode;
  isDesigner: boolean;
  isRoot: boolean;
  parentId: string | null;
  section: string;
  setShowComponentModal: Dispatch<SetStateAction<boolean>>;
  setDesignerState: Dispatch<SetStateAction<DesignerState>>;
  runtimeItem?: unknown;
  resourceIntent?: boolean;
  tenantKey?: string;
  pageSlug?: string;
}) {
  const repeatable = useRepeatableData({ isDesigner, component });
  const dispatch = useDispatch<AppDispatch>();
  const authStatus = useSelector((state: RootState) => state.auth.authStatus);
  const hoverContext = React.useContext(HoverContext);
  const formContext = React.useContext(FormContext);

  const hoveredId = hoverContext?.hoveredId ?? null;
  const setHoveredId = hoverContext?.setHoveredId ?? (() => {});
  const isDataBindingContainer =
    hasDataBinding(component) || !!component.runtime?.repeat;
  const templateChildren =
    isDataBindingContainer && (component.children?.length ?? 0) > 0
      ? [component.children![0]]
      : (component.children ?? []);
  const shouldUseRepeatTemplate =
    !isDesigner && repeatable.enabled && templateChildren.length > 0;
  const effectiveChildren = shouldUseRepeatTemplate
    ? templateChildren
    : isDesigner && isDataBindingContainer
      ? templateChildren
      : (component.children ?? []);
  const hasChildren = effectiveChildren.length > 0;

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production" || !isDataBindingContainer) {
      return;
    }

    console.debug("[renderer] repeat:render", {
      componentId: component.id,
      enabled: repeatable.enabled,
      loading: repeatable.loading,
      itemCount: repeatable.items?.length ?? 0,
      hasSnapshotData: repeatable.hasSnapshotData,
      endpoint: repeatable.enabled ? "active" : "inactive",
    });
  });

  const runtimeProps = React.useMemo(() => {
    const runtime = component.runtime;
    const map = runtime?.columnMap;
    const props = (component.props ?? {}) as Record<string, unknown>;
    const propMap =
      typeof props.columnMap === "object" && props.columnMap
        ? (props.columnMap as Record<string, string>)
        : undefined;

    const finalMap = {
      text: map?.text ?? propMap?.text,
      label: map?.label ?? propMap?.label,
      src: map?.src ?? propMap?.src,
      href: map?.href ?? propMap?.href,
      alt: map?.alt ?? propMap?.alt,
      htmlFor: map?.htmlFor ?? propMap?.htmlFor,
    };

    const getBound = (key: keyof typeof finalMap, fallback?: string) => {
      if (isDesigner) return fallback;
      const path = finalMap[key];
      if (!path) return fallback;
      const paths = path
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean);
      const isDestinationResource = String(
        component.runtime?.repeat?.targetResource ?? "",
      ).startsWith("destination");
      const configuredVisibility =
        component.runtime?.repeat?.policy?.columnVisibility ?? {};
      const isVisible =
        configuredVisibility[path] !== false &&
        repeatable.policy.columnVisibility[path] !== false &&
        paths.every((candidate) => configuredVisibility[candidate] !== false);
      if (isVisible === false) return undefined;
      for (const candidate of paths) {
        const value = readPath(runtimeItem, candidate);
        if (value != null && value !== "") return String(value);
      }
      if (isDestinationResource) {
        return "N/A";
      }
      return fallback;
    };

    return { getBound };
  }, [
    component.dataBinding,
    component.runtime,
    component.props,
    runtimeItem,
    isDesigner,
    repeatable.policy,
  ]);

  const isExactHovered = isDesigner && hoveredId === component.id;

  const width = getSize(component.layout?.width);
  const height = getSize(component.layout?.height);
  const minWidth = getSize(component.layout?.minWidth);
  const minHeight = getSize(component.layout?.minHeight);
  const maxWidth = getSize(component.layout?.maxWidth);
  const maxHeight = getSize(component.layout?.maxHeight);
  const componentTargetResource =
    component.runtime?.repeat?.targetResource ?? component.dataBinding?.source;
  const normalizedComponentTargetResource = normalizePublicResourceKey(
    parseResourceSpec(componentTargetResource)?.resource ?? componentTargetResource,
  );
  const hasResourceIntent =
    !!resourceIntent ||
    (typeof componentTargetResource === "string" &&
      normalizedComponentTargetResource !== null &&
      RESOURCE_SOURCES.has(normalizedComponentTargetResource) &&
      normalizedComponentTargetResource !== "static") ||
    hasResourceHint(component);
  const backgroundImageSrc =
    isDesigner && hasResourceIntent && component.style?.backgroundImage
      ? DESIGNER_IMAGE_SRC
      : component.style?.backgroundImage;

  const wrapperStyle: React.CSSProperties = {
    marginTop: component.layout?.margin?.top ?? 0,
    marginRight: component.layout?.margin?.right ?? 0,
    marginBottom: component.layout?.margin?.bottom ?? 0,
    marginLeft: component.layout?.margin?.left ?? 0,

    paddingTop: component.layout?.padding?.top ?? 0,
    paddingRight: component.layout?.padding?.right ?? 0,
    paddingBottom: component.layout?.padding?.bottom ?? 0,
    paddingLeft: component.layout?.padding?.left ?? 0,

    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,

    position: component.layout?.position ?? "relative",
    top: component.layout?.top,
    right: component.layout?.right,
    bottom: component.layout?.bottom,
    left: component.layout?.left,
    zIndex: component.layout?.zIndex,

    overflow: component.layout?.overflow,

    backgroundColor: component.style?.backgroundColor ?? "transparent",
    backgroundImage: backgroundImageSrc
      ? `url("${backgroundImageSrc}")`
      : undefined,
    backgroundSize: component.style?.backgroundSize ?? "cover",
    backgroundRepeat: component.style?.backgroundRepeat ?? "no-repeat",
    backgroundPosition: component.style?.backgroundPosition ?? "center center",

    display: component.layout?.display ?? (hasChildren ? "block" : "block"),
    gap: hasChildren ? (component.layout?.gap ?? 0) : undefined,
    flexDirection: component.layout?.flexDirection,
    justifyContent: component.layout?.justifyContent,
    alignItems: component.layout?.alignItems,
    flexWrap: component.layout?.wrap ? "wrap" : undefined,
    justifyItems: component.layout?.display === "grid" ? "stretch" : undefined,
    gridTemplateColumns:
      component.layout?.display === "grid"
        ? `repeat(${component.layout?.columns ?? 3}, minmax(0, 1fr))`
        : undefined,

    border:
      typeof component.layout?.border === "number"
        ? `${component.layout.border}px solid ${
            component.style?.borderColor ?? "black"
          }`
        : undefined,

    borderWidth: component.style?.borderWidth,
    borderColor: component.style?.borderColor,
    borderRadius: component.style?.borderRadius,
    opacity: component.style?.opacity,
    boxShadow: isExactHovered
      ? `${component.style?.boxShadow ? `${component.style.boxShadow}, ` : ""}0 0 0 2px rgba(3, 102, 252, 0.6)`
      : component.style?.boxShadow,
    outline: isExactHovered ? "1px solid #0366fc" : undefined,
    outlineOffset: isExactHovered ? 0 : undefined,
    transition: isDesigner
      ? "box-shadow 120ms ease, outline-color 120ms ease"
      : undefined,
    color: component.style?.textColor,
    fontSize: component.style?.fontSize,
    fontWeight: component.style?.fontWeight,
    lineHeight: component.style?.lineHeight,
    letterSpacing: component.style?.letterSpacing,
    textAlign: component.style?.textAlign,
    textDecoration: "none",
  };

  const isMarquee = component.props && "marquee" in component.props;

  const marqueeStyle: React.CSSProperties = isMarquee
    ? {
        display: "flex",
        width: "max-content",
        whiteSpace: "nowrap",
        animation: "marquee 18s linear infinite",
      }
    : {};

  const commonHoverProps = isDesigner
    ? {
        onMouseEnter: (e: React.MouseEvent) => {
          e.stopPropagation();
          setHoveredId(component.id);
        },
        onMouseMove: (e: React.MouseEvent) => {
          e.stopPropagation();
          setHoveredId(component.id);
        },
        onMouseLeave: (e: React.MouseEvent) => {
          e.stopPropagation();
          setHoveredId((prev) => (prev === component.id ? null : prev));
        },
        onMouseDown: (e: React.MouseEvent) => {
          e.stopPropagation();
          setDesignerState((prev) => ({
            ...prev,
            selectedId: component.id,
            selectedSection: section as "header" | "template" | "footer" | null,
            insertIndex: null,
          }));
        },
      }
    : {};

  const resolveExposed = (fallback: string | undefined) => {
    if (isDesigner) return fallback;
    const fromRuntime = component.runtime?.exposedLabel;
    const fromProps =
      component.props && typeof component.props === "object"
        ? ((component.props as Record<string, unknown>).exposedLabel as
            | string
            | undefined)
        : undefined;
    const exposedPath = fromRuntime ?? fromProps;
    const bound = readPath(runtimeItem, exposedPath);
    if (bound == null) return fallback;
    return String(bound);
  };

  const resolveValue = (
    key: "text" | "label" | "src" | "href" | "alt" | "htmlFor",
    fallback?: string,
  ) => resolveExposed(runtimeProps.getBound(key, fallback));
  const resolveImageSrc = (src?: string) =>
    isDesigner && hasResourceIntent ? DESIGNER_IMAGE_SRC : src;
  const handleDesignerImageFallback = (
    e: React.SyntheticEvent<HTMLImageElement>,
  ) => {
    if (!isDesigner) return;
    const img = e.currentTarget;
    if (img.src.endsWith(DESIGNER_IMAGE_SRC)) return;
    img.src = DESIGNER_IMAGE_SRC;
  };
  const isResourceContainer = !!(
    component.runtime?.resourceContainer ||
    ((component.props as Record<string, unknown> | undefined)
      ?.resourceContainer as boolean | undefined) ||
    repeatable.enabled ||
    repeatable.hasSnapshotData ||
    (isDesigner && isDataBindingContainer)
  );
  const designerPreviewItems = Array.from({
    length: DESIGNER_REPEAT_PREVIEW_COUNT,
  });
  const resolvedRepeatDisplay =
    component.layout?.display ??
    ((isDesigner
      ? designerPreviewItems.length
      : (repeatable.items?.length ?? 0)) > 1
      ? "flex"
      : "block");
  const repeatLayoutStyle: React.CSSProperties = {
    display: resolvedRepeatDisplay,
    flexDirection:
      component.layout?.flexDirection ??
      (resolvedRepeatDisplay === "flex" ? "row" : undefined),
    justifyContent: component.layout?.justifyContent,
    alignItems: component.layout?.alignItems,
    flexWrap: component.layout?.wrap ? "wrap" : undefined,
    gap: component.layout?.gap ?? 0,
    justifyItems: resolvedRepeatDisplay === "grid" ? "stretch" : undefined,
    alignContent: resolvedRepeatDisplay === "grid" ? "stretch" : undefined,
    gridTemplateColumns:
      resolvedRepeatDisplay === "grid"
        ? `repeat(${component.layout?.columns ?? 3}, minmax(0, 1fr))`
        : undefined,
    width: "100%",
  };
  const noDataStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: minHeight ?? height ?? 160,
    width: "100%",
    padding: 24,
    color: "#64748b",
    fontSize: 14,
    fontWeight: 600,
    textAlign: "center",
    backgroundColor: "#f8fafc",
    border: "1px dashed #cbd5e1",
    borderRadius: component.style?.borderRadius ?? 8,
  };

  const renderChildren = (suffix = "", item?: unknown) =>
    hasChildren
      ? effectiveChildren.map((child) => {
          const repeatedChild = suffix
            ? {
                ...child,
                id: `${child.id}${suffix}`,
              }
            : child;

          return (
            <React.Fragment key={`${child.id}${suffix}`}>
              <RenderComponentInner
                component={repeatedChild}
                isDesigner={isDesigner}
                isRoot={false}
                parentId={component.id}
                section={section}
                setShowComponentModal={setShowComponentModal}
                setDesignerState={setDesignerState}
                runtimeItem={item}
                resourceIntent={hasResourceIntent}
                tenantKey={tenantKey}
                pageSlug={pageSlug}
              />
            </React.Fragment>
          );
        })
      : null;

  const renderRepeatedChildren = (items: unknown[]) => (
    <>
      {items.map((item, index) => (
        <React.Fragment key={`${component.id}-repeat-${index}`}>
          {renderChildren(`-repeat-${index}`, item)}
        </React.Fragment>
      ))}
    </>
  );

  const renderAddChildControl = () => {
    return null;
  };

  const FormRenderer = ({ children }: { children: React.ReactNode }) => {
    const [submitState, setSubmitState] = React.useState<{
      status: "idle" | "submitting" | "success" | "error";
      message: string;
    }>({ status: "idle", message: "" });

    const resolvedTenantKey = tenantKey ?? getTenantKeyFromLocation();
    const resolvedPageSlug = pageSlug ?? "home";

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (isDesigner) {
        return;
      }

      if (!resolvedTenantKey) {
        setSubmitState({
          status: "error",
          message: "Missing tenant context for this form.",
        });
        return;
      }

      const form = event.currentTarget;
      const payload = Object.fromEntries(
        Array.from(new FormData(form).entries()).map(([key, value]) => [
          key,
          typeof value === "string" ? value.trim() : value,
        ]),
      );
      const inquiryPayload = buildContactInquiryPayload(
        resolvedTenantKey,
        payload,
        {
          pageSlug: resolvedPageSlug,
          source: "designer-contact-form",
        },
      );

      setSubmitState({ status: "submitting", message: "" });

      try {
        await sendContactInquiry(resolvedTenantKey, inquiryPayload);
        form.reset();
        setSubmitState({
          status: "success",
          message: "Your request was sent successfully.",
        });
      } catch (error: unknown) {
        const response =
          error && typeof error === "object"
            ? (error as {
                response?: { data?: { error?: string; message?: string } };
                message?: string;
              })
            : null;
        setSubmitState({
          status: "error",
          message:
            response?.response?.data?.error ??
            response?.response?.data?.message ??
            response?.message ??
            "Failed to send request.",
        });
      }
    };

    return (
      <FormContext.Provider value={{ insideForm: true }}>
        <form
          onSubmit={handleSubmit}
          style={{
            ...wrapperStyle,
            display: wrapperStyle.display ?? "block",
          }}
          {...commonHoverProps}
        >
          {children}

          {!isDesigner && submitState.status !== "idle" ? (
            <div
              style={{
                marginTop: 12,
                fontSize: 13,
                lineHeight: 1.5,
                color: submitState.status === "error" ? "#b91c1c" : "#166534",
              }}
            >
              {submitState.message}
            </div>
          ) : null}
        </form>
      </FormContext.Provider>
    );
  };

  const iconLibraries = {
    fa: FaIcons,
    md: MdIcons,
    io: IoIcons,
    bs: BsIcons,
    hi: HiIcons,
    lu: LuIcons,
  };

  switch (component.type) {
    case "ImageCompare": {
      const props = component.props as {
        beforeSrc: string;
        afterSrc: string;
        beforeAlt?: string;
        afterAlt?: string;
        value?: number;
      };

      return (
        <ImageCompareRenderer
          componentName={component.name}
          props={props}
          wrapperStyle={wrapperStyle}
          hoverProps={commonHoverProps}
          resolveImageSrc={resolveImageSrc}
          onImageError={handleDesignerImageFallback}
          renderAddChildControl={renderAddChildControl}
        />
      );
    }

    case "Video": {
      const props = component.props as {
        href: string;
        provider?: string;
        controls?: boolean;
        autoplay?: boolean;
        muted?: boolean;
        loop?: boolean;
        poster?: string;
      };

      const getEmbedUrl = () => {
        if (!props.href) return "";

        if (props.provider === "youtube") {
          const match = props.href.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/,
          );
          const id = match?.[1];

          if (!id) return props.href;

          const params = new URLSearchParams({
            controls: props.controls ? "1" : "0",
            autoplay: props.autoplay ? "1" : "0",
            mute: props.muted ? "1" : "0",
            loop: props.loop ? "1" : "0",
          });

          return `https://www.youtube.com/embed/${id}?${params.toString()}`;
        }

        if (props.provider === "vimeo") {
          const id = props.href.split("/").filter(Boolean).pop();

          return `https://player.vimeo.com/video/${id}`;
        }

        if (props.provider === "facebook") {
          return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
            props.href,
          )}&show_text=false&controls=${props.controls ? "true" : "false"}`;
        }

        return props.href;
      };

      const isFile = props.provider === "file";

      return (
        <div style={wrapperStyle} {...commonHoverProps}>
          {isFile ? (
            <video
              src={props.href}
              poster={props.poster}
              controls={props.controls}
              autoPlay={props.autoplay}
              muted={props.muted}
              loop={props.loop}
              playsInline
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",
              }}
            />
          ) : (
            <iframe
              src={getEmbedUrl()}
              title={component.name ?? "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                border: 0,
              }}
            />
          )}

          {renderAddChildControl()}
        </div>
      );
    }

    case "Icon": {
      const props = component.props as {
        library?: string;
        name?: string;
      };

      if (!props.library || !props.name) return null;

      const Icon = resolveIcon(props.library, props.name) as
        | React.ComponentType<{ size?: number; color?: string }>
        | undefined;

      if (!Icon) return null;

      return (
        <span
          style={{
            ...wrapperStyle,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
          }}
          {...commonHoverProps}
        >
          <Icon
            size={component.style?.fontSize || 20}
            color={component.style?.textColor || "#111"}
          />
        </span>
      );
    }

    case "Text": {
      const text = hasText(component.props)
        ? component.props.text
        : (component.name ?? "");
      const resolvedText = resolveValue("text", text);

      const tag =
        component.props &&
        typeof component.props === "object" &&
        "tag" in component.props
          ? String(component.props.tag)
          : "p";

      return React.createElement(
        tag,
        {
          style: {
            ...wrapperStyle,
            margin: 0,
            whiteSpace: "pre-line",
          },
          ...commonHoverProps,
        },
        resolvedText,
      );
    }

    case "Link": {
      const text = hasText(component.props)
        ? component.props.text
        : (component.name ?? "");

      const src = hasSrc(component.props) ? component.props.src : undefined;
      const href = hasHref(component.props)
        ? (component.props.href ?? "#")
        : "#";
      const resolvedText = resolveValue("text", text);
      const resolvedSrc = resolveValue("src", src);
      const resolvedImageSrc = resolveImageSrc(resolvedSrc);
      const resolvedHref = prefixTenantBasePath(getTenantBasePath(tenantKey), resolveValue("href", href) ?? "#");
      const resolvedAlt = resolveValue("alt", component.name ?? "image");
      const isHeaderAuthLink =
        section === "header" && isAuthLinkLabel(resolvedText ?? text ?? "");
      const isDesignerHeaderLink = isDesigner && section === "header";
      const inlineLinkDisplay =
        wrapperStyle.display === "flex" || wrapperStyle.display === "inline-flex"
          ? wrapperStyle.display
          : "block";
      const inlineLinkStyle: React.CSSProperties = {
        color: "inherit",
        textDecoration: "none",
        display: inlineLinkDisplay,
        alignItems:
          inlineLinkDisplay === "flex" || inlineLinkDisplay === "inline-flex"
            ? wrapperStyle.alignItems ?? "center"
            : undefined,
        justifyContent:
          inlineLinkDisplay === "flex" || inlineLinkDisplay === "inline-flex"
            ? wrapperStyle.justifyContent
            : undefined,
        gap:
          inlineLinkDisplay === "flex" || inlineLinkDisplay === "inline-flex"
            ? wrapperStyle.gap
            : undefined,
        width: "100%",
        height: "100%",
      };

      const renderLinkContent = () => (
        <>
          {resolvedText ? (
            resolvedText
          ) : resolvedImageSrc ? (
            <img
              src={resolvedImageSrc}
              alt={resolvedAlt ?? "image"}
              onError={handleDesignerImageFallback}
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",
              }}
            />
          ) : null}

          {renderChildren()}
        </>
      );

      if (isDesignerHeaderLink) {
        return (
          <div style={wrapperStyle} {...commonHoverProps}>
            <span
              aria-disabled="true"
              style={{
                ...inlineLinkStyle,
                cursor: "default",
                pointerEvents: "none",
              }}
            >
              {renderLinkContent()}
            </span>

            {renderAddChildControl()}
          </div>
        );
      }

      if (isHeaderAuthLink && authStatus === "authenticated") {
        const normalizedLabel = String(resolvedText ?? text)
          .trim()
          .toLowerCase();

        if (normalizedLabel === "sign up") {
        return (
          <div>
            <a
              href="/customer/dashboard"
              style={inlineLinkStyle}
            >
              <span
                style={{
                  display: "block",
                  ...wrapperStyle,
                  }}
                >
                  Dashboard
                </span>
              </a>
              {renderAddChildControl()}
            </div>
          );
        }

        const handleLogout = async () => {
          try {
            await dispatch(logout({ redirectTo: "/signin" })).unwrap();
            if (typeof window !== "undefined") {
              window.location.assign("/signin");
            }
          } catch {
            // auth slice already carries the failure state
          }
        };

        return (
          <div>
            <button
              type="button"
              onClick={() => void handleLogout()}
              style={{
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 600,
                backgroundColor: component.style?.backgroundColor ?? "#111",
                color: component.style?.textColor ?? "#fff",
                ...wrapperStyle,
              }}
            >
              Logout
            </button>
            {renderAddChildControl()}
          </div>
        );
      }

      return (
        <div style={wrapperStyle} {...commonHoverProps}>
          <a
            href={resolvedHref ?? "#"}
            style={inlineLinkStyle}
          >
            {renderLinkContent()}
          </a>

          {renderAddChildControl()}
        </div>
      );
    }

    case "Image": {
      const src = hasSrc(component.props) ? component.props.src : undefined;
      const resolvedSrc = resolveValue("src", src);
      const resolvedImageSrc =
        resolveImageSrc(resolvedSrc) ??
        (hasResourceIntent ? DESIGNER_IMAGE_SRC : undefined);
      const resolvedAlt = resolveValue("alt", component.name ?? "image");
      if (!resolvedImageSrc) return null;

      return (
        <div style={wrapperStyle} {...commonHoverProps}>
          <img
            src={resolvedImageSrc}
            alt={resolvedAlt ?? "image"}
            onError={(e) => {
              const img = e.currentTarget;
              if (img.src.endsWith(DESIGNER_IMAGE_SRC)) return;
              if (hasResourceIntent) {
                img.src = DESIGNER_IMAGE_SRC;
                return;
              }
              handleDesignerImageFallback(e);
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: hasObjectFit(component.props)
                ? (component.props.objectFit ?? "cover")
                : "cover",
              display: "block",
            }}
          />
          {renderChildren()}
          {renderAddChildControl()}
        </div>
      );
    }

    case "Input": {
      const props = component.props as {
        name: string;
        placeholder?: string;
        inputType?: string;
      };

      return (
        <input
          name={props.name}
          placeholder={props.placeholder}
          type={props.inputType ?? "text"}
          style={{
            ...wrapperStyle,
            outline: isExactHovered ? "1px solid #0366fc" : "none",
            fontFamily: "inherit",
            fontSize: 14,
            backgroundColor: component.style?.backgroundColor ?? "#f3f3f3",
            border:
              typeof component.layout?.border === "number"
                ? `${component.layout.border}px solid ${
                    component.style?.borderColor ?? "#ddd"
                  }`
                : "none",
            borderRadius: component.style?.borderRadius ?? 6,
            padding: "0 14px",
            boxSizing: "border-box",
          }}
          {...commonHoverProps}
        />
      );
    }

    case "Button": {
      const props = component.props as {
        label: string;
      };
      const resolvedLabel = resolveValue("label", props.label);

      return (
        <button
          type={formContext?.insideForm ? "submit" : "button"}
          style={{
            ...wrapperStyle,
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 600,
            backgroundColor: component.style?.backgroundColor ?? "#111",
            color: component.style?.textColor ?? "#fff",
          }}
          {...commonHoverProps}
        >
          {resolvedLabel}
        </button>
      );
    }

    case "Label": {
      const props = component.props as {
        text?: string;
        htmlFor?: string;
      };
      const text = resolveValue("text", props.text ?? component.name ?? "");
      const htmlFor = resolveValue("htmlFor", props.htmlFor);
      return (
        <label style={wrapperStyle} htmlFor={htmlFor} {...commonHoverProps}>
          {text}
        </label>
      );
    }

    case "Form":
      return <FormRenderer>{renderChildren()}</FormRenderer>;

    default:
      if (
        !isDesigner &&
        (isContactMessageBox(component) || isTripRequestTextarea(component))
      ) {
        const placeholder =
          extractTextValue(component) ?? "Tell us about your trip.";

        return (
          <div style={wrapperStyle} {...commonHoverProps}>
            <textarea
              name="message"
              placeholder={placeholder}
              required
              rows={5}
              style={{
                width: "100%",
                height: "100%",
                minHeight: "100%",
                display: "block",
                resize: "none",
                cursor: "text",
                pointerEvents: "auto",
                position: "relative",
                zIndex: 1,
                background: "transparent",
                border: 0,
                outline: "none",
                fontFamily: "inherit",
                fontSize: 14,
                color: "inherit",
              }}
            />
            {renderAddChildControl()}
          </div>
        );
      }

      return (
        <div
          style={{
            ...wrapperStyle,
            display: isMarquee ? "block" : wrapperStyle.display,
            overflow: isMarquee ? "hidden" : wrapperStyle.overflow,
          }}
          {...commonHoverProps}
        >
          {isMarquee && (
            <style>
              {`
            @keyframes marquee {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(-25%);
              }
            }
          `}
            </style>
          )}

          {isDesigner && isResourceContainer && isDataBindingContainer ? (
            hasChildren ? (
              renderRepeatedChildren(designerPreviewItems)
            ) : null
          ) : repeatable.enabled && isResourceContainer ? (
            repeatable.loading ? null : (repeatable.items?.length ?? 0) ===
              0 ? (
              <div style={noDataStyle}>No data found</div>
            ) : (
              renderRepeatedChildren(repeatable.items ?? [])
            )
          ) : repeatable.enabled && !isResourceContainer ? null : isMarquee ? (
            <div
              style={{
                display: "flex",
                width: "max-content",
                animation: "marquee 40s linear infinite",
              }}
            >
              {[0, 1, 2, 3].map((copyIndex) => (
                <div
                  key={copyIndex}
                  style={{
                    display: "flex",
                    gap: component.layout?.gap ?? 0,
                    flexShrink: 0,
                    paddingRight: component.layout?.gap ?? 0,
                  }}
                >
                  {renderChildren(`-${copyIndex}`)}
                </div>
              ))}
            </div>
          ) : (
            renderChildren("", runtimeItem)
          )}

          {renderAddChildControl()}
        </div>
      );
  }
}

export default function RenderComponent({
  component,
  isDesigner,
  isRoot,
  section,
  setShowComponentModal,
  setDesignerState,
  tenantKey,
  pageSlug,
  contentDatas,
}: {
  component: ComponentNode;
  isDesigner: boolean;
  isRoot: boolean;
  section: string;
  setShowComponentModal: Dispatch<SetStateAction<boolean>>;
  setDesignerState: Dispatch<SetStateAction<DesignerState>>;
  tenantKey?: string;
  pageSlug?: string;
  contentDatas?: ContentDataSnapshot[];
}) {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  return (
    <ContentDataContext.Provider value={contentDatas ?? null}>
      <HoverContext.Provider value={{ hoveredId, setHoveredId }}>
        <RenderComponentInner
          component={component}
          isDesigner={isDesigner}
          isRoot={isRoot}
          parentId={null}
          section={section}
          setShowComponentModal={setShowComponentModal}
          setDesignerState={setDesignerState}
          tenantKey={tenantKey}
          pageSlug={pageSlug}
        />
      </HoverContext.Provider>
    </ContentDataContext.Provider>
  );
}
