import React, { Dispatch, SetStateAction } from "react";
import { ComponentNode, Dimension, Component, DesignerState } from "./types";
import { componentRegistry } from "./types";

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

    overflow:
      component.layout?.overflow === "hidden"
        ? "visible"
        : component.layout?.overflow,

    backgroundColor: component.style?.backgroundColor ?? "transparent",
    backgroundImage: component.style?.backgroundImage
      ? `url("${component.style.backgroundImage}")`
      : undefined,
    backgroundSize: component.style?.backgroundSize ?? "cover",
    backgroundRepeat: component.style?.backgroundRepeat ?? "no-repeat",
    backgroundPosition: component.style?.backgroundPosition ?? "center center",

    display: hasChildren ? (component.layout?.display ?? "block") : "block",
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

  const renderChildren = () =>
    hasChildren
      ? component.children!.map((child) => (
          <RenderComponentInner
            key={child.id}
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
              selectedSection: section as "header" | "template" | "footer" | null,
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

  switch (component.type) {
    case "Text": {
      const text = hasText(component.props)
        ? component.props.text
        : (component.name ?? "");

      return (
        <div style={wrapperStyle} {...commonHoverProps}>
          <div>{text}</div>
          {renderChildren()}
          {renderAddChildControl()}
        </div>
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
        <div style={wrapperStyle} {...commonHoverProps}>
          {renderChildren()}
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
