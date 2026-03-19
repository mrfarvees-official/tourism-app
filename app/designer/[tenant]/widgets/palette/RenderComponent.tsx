import React from "react";
import { ComponentNode, Dimension } from "./types";

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

export default function RenderComponent({
  component,
  isDesigner,
  isRoot,
}: {
  component: ComponentNode;
  isDesigner: boolean;
  isRoot: boolean;
}) {
  const hasChildren = component.children?.length > 0;

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

    position: component.layout?.position,
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

    display: hasChildren ? component.layout?.display ?? "block" : "block",
    gap: hasChildren ? component.layout?.gap ?? 0 : undefined,
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

  const renderChildren = () =>
    hasChildren
      ? component.children.map((child) => (
          <RenderComponent
            key={child.id}
            component={child}
            isDesigner={isDesigner}
            isRoot={false}
          />
        ))
      : null;

  switch (component.type) {
    case "Text": {
      const text = hasText(component.props)
        ? component.props.text
        : component.name ?? "";

      return <div style={wrapperStyle}>{text}</div>;
    }

    case "Link": {
      const text = hasText(component.props)
        ? component.props.text
        : component.name ?? "";

      const src = hasSrc(component.props) ? component.props.src : undefined;
      const href = hasHref(component.props) ? component.props.href ?? "#" : "#";

      return (
        <a href={href} style={wrapperStyle}>
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
      );
    }

    case "Image": {
      const src = hasSrc(component.props) ? component.props.src : undefined;
      if (!src) return null;

      return (
        <div style={wrapperStyle}>
          <img
            src={src}
            alt={component.name ?? "image"}
            style={{
              width: "100%",
              height: "100%",
              objectFit:
                "objectFit" in component.props
                  ? component.props.objectFit ?? "cover"
                  : "cover",
              display: "block",
            }}
          />
        </div>
      );
    }

    default:
      return <div style={wrapperStyle}>{renderChildren()}</div>;
  }
}