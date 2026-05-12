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

function RenderComponentInner({
  component,
  isDesigner,
  isRoot,
  parentId,
  section,
  setShowComponentModal,
  setDesignerState,
}: {
  component: ComponentNode;
  isDesigner: boolean;
  isRoot: boolean;
  parentId: string | null;
  section: string;
  setShowComponentModal: Dispatch<SetStateAction<boolean>>;
  setDesignerState: Dispatch<SetStateAction<DesignerState>>;
}) {
  const hoverContext = React.useContext(HoverContext);
  if (!hoverContext) return null;

  const { hoveredId, setHoveredId } = hoverContext;
  const hasChildren = (component.children?.length ?? 0) > 0;

  const rules = componentRegistry[component.type as Component];
  const canHaveChildren = rules?.canHaveChildren ?? false;

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
    boxShadow: component.style?.boxShadow,
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

  const showAddChildControl =
    isDesigner && !isRoot && canHaveChildren && hoveredId === component.id;

  const commonHoverProps = {
    onMouseEnter: (e: React.MouseEvent) => {
      e.stopPropagation();
      setHoveredId(component.id);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      e.stopPropagation();
      setHoveredId(parentId);
    },
    onMouseDown: (e: React.MouseEvent) => {
      e.stopPropagation();
      setDesignerState((prev) => ({
        ...prev,
        selectedId: component.id,
      }));
    },
  };

  const renderChildren = (suffix = "") =>
    hasChildren
      ? component.children!.map((child) => (
          <RenderComponentInner
            key={`${child.id}${suffix}`}
            component={child}
            isDesigner={isDesigner}
            isRoot={false}
            parentId={component.id}
            section={section}
            setShowComponentModal={setShowComponentModal}
            setDesignerState={setDesignerState}
          />
        ))
      : null;

  const renderAddChildControl = () => {
    if (!showAddChildControl) return null;

    return (
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          transform: "translateY(50%)",
          height: 16,
          pointerEvents: "none",
          zIndex: 99999,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            height: 3,
            backgroundColor: "#0366fc",
            zIndex: 550,
          }}
        />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (!canHaveChildren) return;

            setDesignerState((prev) => ({
              ...prev,
              selectedId: component.id,
              selectedSection: section as
                | "header"
                | "template"
                | "footer"
                | null,
            }));

            setShowComponentModal(true);
          }}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 16,
            height: 16,
            borderRadius: "50%",
            border: "1px solid #0366fc",
            background: "#0366fc",
            padding: 0,
            margin: 0,
            outline: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            lineHeight: 1,
            cursor: "pointer",
            pointerEvents: "auto",
            color: "#fff",
            zIndex: 550,
          }}
        >
          +
        </button>
      </div>
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
        text,
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

      return (
        <div style={wrapperStyle} {...commonHoverProps}>
          <a
            href={href}
            style={{
              color: "inherit",
              textDecoration: "none",
              display: "block",
              width: "100%",
              height: "100%",
            }}
          >
            {text ? (
              text
            ) : src ? (
              <img
                src={src}
                alt={component.name ?? "image"}
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
      if (!src) return null;

      return (
        <div style={wrapperStyle} {...commonHoverProps}>
          <img
            src={src}
            alt={component.name ?? "image"}
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

          {isMarquee ? (
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
            renderChildren()
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
