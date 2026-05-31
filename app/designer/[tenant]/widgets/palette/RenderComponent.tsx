import React, { Dispatch, SetStateAction } from "react";
import { ComponentNode, Dimension, Component, DesignerState } from "./types";
import { componentRegistry } from "./types";
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

type HoverContextType = {
  hoveredId: string | null;
  setHoveredId: React.Dispatch<React.SetStateAction<string | null>>;
};

const HoverContext = React.createContext<HoverContextType | null>(null);

function readPath(obj: unknown, path?: string): unknown {
  if (!obj || !path) return undefined;
  return path
    .split(".")
    .filter(Boolean)
    .reduce<unknown>((acc, key) => {
      if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
}

function getTenantKeyFromLocation(): string | null {
  if (typeof window === "undefined") return null;
  const parts = window.location.pathname.split("/").filter(Boolean);
  if (parts[0] === "admin" || parts[0] === "designer") return parts[1] ?? null;
  if (parts[0] === "_sites") return parts[1] ?? null;
  return null;
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

  const baseMap: Record<string, string> = {
    product: "/api/content",
    collection: "/api/content",
    customer: "/api/content",
    cart: "/api/content",
    form: "/api/content",
    custom: "/api/content",
  };

  const base = baseMap[targetResource ?? ""] ?? "/api/content";
  const params = new URLSearchParams();
  if (tenantKey) params.set("tenantKey", tenantKey);
  if (menu) params.set("menu", menu);
  if (targetResource && targetResource !== "custom") params.set("resource", targetResource);
  if (typeof limit === "number" && Number.isFinite(limit)) params.set("limit", String(limit));

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
      ? (propsRepeat as { enabled?: boolean; endpoint?: string; dataPath?: string })
      : undefined)) as { enabled?: boolean; endpoint?: string; dataPath?: string } | undefined;
  const cfgWithTarget = cfg as {
    enabled?: boolean;
    endpoint?: string;
    dataPath?: string;
    targetResource?: string;
    menu?: string;
    limit?: number;
    policyPath?: string;
  } | undefined;
  const sourceFallback = component.dataBinding?.source;
  const tenantKey = getTenantKeyFromLocation();
  const resolvedEndpoint = buildTargetEndpoint({
    targetResource: cfgWithTarget?.targetResource ?? sourceFallback,
    endpoint: cfgWithTarget?.endpoint,
    menu: cfgWithTarget?.menu,
    limit: cfgWithTarget?.limit,
    tenantKey,
  });

  const enabled = !isDesigner && !!cfg?.enabled && !!resolvedEndpoint;
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

    setLoading(true);
    fetch(endpoint)
      .then((res) => res.json())
      .then((payload: unknown) => {
        if (cancelled) return;
        const scoped = dataPath ? readPath(payload, dataPath) : payload;
        const policyCandidate = policyPath ? readPath(payload, policyPath) : readPath(payload, "meta.resourcePolicy");
        if (policyCandidate && typeof policyCandidate === "object") {
          const next = policyCandidate as { version?: unknown; columnVisibility?: unknown };
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
        if (Array.isArray(scoped)) setItems(scoped);
        else setItems([]);
      })
      .catch(() => {
        if (cancelled) return;
        setItems([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, endpoint, dataPath, policyPath]);

  return { enabled, items, loading, policy };
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
}: {
  component: ComponentNode;
  isDesigner: boolean;
  isRoot: boolean;
  parentId: string | null;
  section: string;
  setShowComponentModal: Dispatch<SetStateAction<boolean>>;
  setDesignerState: Dispatch<SetStateAction<DesignerState>>;
  runtimeItem?: unknown;
}) {
  const repeatable = useRepeatableData({ isDesigner, component });
  const hoverContext = React.useContext(HoverContext);
  if (!hoverContext) return null;

  const { hoveredId, setHoveredId } = hoverContext;
  const effectiveChildren =
    component.runtime?.repeat && (component.children?.length ?? 0) > 0
      ? [component.children![0]]
      : (component.children ?? []);
  const hasChildren = effectiveChildren.length > 0;
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
      const isVisible = repeatable.policy.columnVisibility[path];
      if (isVisible === false) return undefined;
      const value = readPath(runtimeItem, path);
      return value == null ? fallback : String(value);
    };

    return { getBound };
  }, [component.runtime, component.props, runtimeItem, isDesigner, repeatable.policy]);

  const isExactHovered = isDesigner && hoveredId === component.id;

  const width = getSize(component.layout?.width);
  const height = getSize(component.layout?.height);
  const minWidth = getSize(component.layout?.minWidth);
  const minHeight = getSize(component.layout?.minHeight);
  const maxWidth = getSize(component.layout?.maxWidth);
  const maxHeight = getSize(component.layout?.maxHeight);

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
    backgroundImage: component.style?.backgroundImage
      ? `url("${component.style.backgroundImage}")`
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
    transition: isDesigner ? "box-shadow 120ms ease, outline-color 120ms ease" : undefined,
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

  const commonHoverProps = {
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
  };

  const resolveExposed = (fallback: string | undefined) => {
    if (isDesigner) return fallback;
    const fromRuntime = component.runtime?.exposedLabel;
    const fromProps =
      component.props && typeof component.props === "object"
        ? ((component.props as Record<string, unknown>).exposedLabel as string | undefined)
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
  const isResourceContainer = !!(
    component.runtime?.resourceContainer ||
    ((component.props as Record<string, unknown> | undefined)?.resourceContainer as boolean | undefined)
  );
  const resolvedRepeatDisplay =
    component.layout?.display ??
    ((repeatable.items?.length ?? 0) > 1 ? "flex" : "block");
  const repeatLayoutStyle: React.CSSProperties = {
    display: resolvedRepeatDisplay,
    flexDirection:
      component.layout?.flexDirection ??
      (resolvedRepeatDisplay === "flex" ? "row" : undefined),
    justifyContent: component.layout?.justifyContent,
    alignItems: component.layout?.alignItems,
    flexWrap: component.layout?.wrap ? "wrap" : undefined,
    gap: component.layout?.gap ?? 0,
    width: "100%",
  };

  const renderChildren = (suffix = "", item?: unknown) =>
    hasChildren
      ? effectiveChildren.map((child) => (
          <React.Fragment key={`${child.id}${suffix}`}>
            <RenderComponentInner
              component={child}
              isDesigner={isDesigner}
              isRoot={false}
              parentId={component.id}
              section={section}
              setShowComponentModal={setShowComponentModal}
              setDesignerState={setDesignerState}
              runtimeItem={item}
            />
          </React.Fragment>
        ))
      : null;

  const renderAddChildControl = () => {
    return (
      null
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
          {...commonHoverProps}
        >
          <img
            src={props.afterSrc}
            alt={props.afterAlt ?? "After"}
            draggable={false}
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
              src={props.beforeSrc}
              alt={props.beforeAlt ?? "Before"}
              draggable={false}
              style={{
                width: containerRef.current?.offsetWidth ?? "100%",
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
        | React.ComponentType<any>
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
      const resolvedHref = resolveValue("href", href);
      const resolvedAlt = resolveValue("alt", component.name ?? "image");

      return (
        <div style={wrapperStyle} {...commonHoverProps}>
          <a
            href={resolvedHref ?? "#"}
            style={{
              color: "inherit",
              textDecoration: "none",
              display: "block",
              width: "100%",
              height: "100%",
            }}
          >
            {resolvedText ? (
              resolvedText
            ) : resolvedSrc ? (
              <img
                src={resolvedSrc}
                alt={resolvedAlt ?? "image"}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  objectFit: "cover",
                }}
              />
            ) : null}

            {renderChildren()}
          </a>

          {renderAddChildControl()}
        </div>
      );
    }

    case "Image": {
      const src = hasSrc(component.props) ? component.props.src : undefined;
      const resolvedSrc = resolveValue("src", src);
      const resolvedAlt = resolveValue("alt", component.name ?? "image");
      if (!resolvedSrc) return null;

      return (
        <div style={wrapperStyle} {...commonHoverProps}>
          <img
            src={resolvedSrc}
            alt={resolvedAlt ?? "image"}
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

    default:
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

          {repeatable.enabled && isResourceContainer ? (
            repeatable.loading ? null : (
              <div style={repeatLayoutStyle}>
                {(repeatable.items ?? []).map((item, index) => (
                  <React.Fragment key={`${component.id}-repeat-${index}`}>
                    {renderChildren(`-repeat-${index}`, item)}
                  </React.Fragment>
                ))}
              </div>
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
}: {
  component: ComponentNode;
  isDesigner: boolean;
  isRoot: boolean;
  section: string;
  setShowComponentModal: Dispatch<SetStateAction<boolean>>;
  setDesignerState: Dispatch<SetStateAction<DesignerState>>;
}) {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  return (
    <HoverContext.Provider value={{ hoveredId, setHoveredId }}>
      <RenderComponentInner
        component={component}
        isDesigner={isDesigner}
        isRoot={isRoot}
        parentId={null}
        section={section}
        setShowComponentModal={setShowComponentModal}
        setDesignerState={setDesignerState}
      />
    </HoverContext.Provider>
  );
}
