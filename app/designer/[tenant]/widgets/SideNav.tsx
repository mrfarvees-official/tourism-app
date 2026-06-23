"use client";

import { ChevronRight, ChevronLeft, ChevronDown, X } from "lucide-react";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { ComponentNode, DesignerState, SizeUnit } from "./palette/types";
import { DesignerTree } from "./componentService";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  showComponentModel: boolean;
  headerNode: ComponentNode;
  setHeaderNode: Dispatch<SetStateAction<ComponentNode>>;
  templateNode: ComponentNode;
  setTemplateNode: Dispatch<SetStateAction<ComponentNode>>;
  footerNode: ComponentNode;
  setFooterNode: Dispatch<SetStateAction<ComponentNode>>;
  designerState: DesignerState;
  setDesignerState: Dispatch<SetStateAction<DesignerState>>;
  setShowComponentModal: Dispatch<SetStateAction<boolean>>;
};

type SectionKey = "header" | "template" | "footer";

function findNodeById(node: ComponentNode, id: string): ComponentNode | null {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

function updateNodeById(
  node: ComponentNode,
  id: string,
  updater: (target: ComponentNode) => ComponentNode,
): ComponentNode {
  if (node.id === id) return updater(node);
  return {
    ...node,
    children: (node.children ?? []).map((child) => updateNodeById(child, id, updater)),
  };
}

function num(v?: number) {
  return v ?? 0;
}

export default function SideNav({
  open,
  setOpen,
  showComponentModel,
  headerNode,
  setHeaderNode,
  templateNode,
  setTemplateNode,
  footerNode,
  setFooterNode,
  designerState,
  setDesignerState,
  setShowComponentModal,
}: Props) {
  const [headerOpen, setHeaderOpen] = useState(true);
  const [templateOpen, setTemplateOpen] = useState(true);
  const [footerOpen, setFooterOpen] = useState(true);

  const selectedSection = designerState.selectedSection as SectionKey | null;
  const selectedId = designerState.selectedId;
  const inspectorOpen =
    open && !showComponentModel && !!selectedSection && !!selectedId;

  const selectedNode = useMemo(() => {
    if (!selectedSection || !selectedId) return null;
    const root =
      selectedSection === "header"
        ? headerNode
        : selectedSection === "template"
          ? templateNode
          : footerNode;
    return findNodeById(root, selectedId);
  }, [selectedSection, selectedId, headerNode, templateNode, footerNode]);

  const setNodeInSection = (section: SectionKey, id: string, updater: (target: ComponentNode) => ComponentNode) => {
    if (section === "header") {
      setHeaderNode((prev) => updateNodeById(prev, id, updater));
      return;
    }
    if (section === "template") {
      setTemplateNode((prev) => updateNodeById(prev, id, updater));
      return;
    }
    setFooterNode((prev) => updateNodeById(prev, id, updater));
  };

  const patchSelected = (updater: (target: ComponentNode) => ComponentNode) => {
    if (!selectedSection || !selectedId) return;
    setNodeInSection(selectedSection, selectedId, updater);
  };

  const closeInspector = () => {
    setDesignerState((prev) => ({
      ...prev,
      selectedId: null,
      selectedSection: null,
    }));
  };

  const setDimValue = (key: "width" | "height", value: string) => {
    patchSelected((n) => ({
      ...n,
      layout: {
        ...(n.layout ?? {}),
        [key]: {
          value: value === "auto" ? "auto" : Number(value || 0),
          unit: (n.layout?.[key]?.unit ?? "px") as SizeUnit,
        },
      },
    }));
  };

  const setDimUnit = (key: "width" | "height", unit: SizeUnit) => {
    patchSelected((n) => ({
      ...n,
      layout: {
        ...(n.layout ?? {}),
        [key]: {
          value: n.layout?.[key]?.value ?? 0,
          unit,
        },
      },
    }));
  };

  const setLayoutNum = (key: "gap" | "top" | "right" | "bottom" | "left" | "border") => {
    return (v: string) =>
      patchSelected((n) => ({
        ...n,
        layout: { ...(n.layout ?? {}), [key]: Number(v || 0) },
      }));
  };

  const setSpacing = (key: "padding" | "margin", side: "top" | "right" | "bottom" | "left", v: string) => {
    patchSelected((n) => ({
      ...n,
      layout: {
        ...(n.layout ?? {}),
        [key]: {
          ...(n.layout?.[key] ?? {}),
          [side]: Number(v || 0),
        },
      },
    }));
  };

  const setStyleValue = (key: string, v: string) => {
    patchSelected((n) => ({
      ...n,
      style: {
        ...(n.style ?? {}),
        [key]:
          key === "fontSize" ||
          key === "fontWeight" ||
          key === "lineHeight" ||
          key === "letterSpacing" ||
          key === "borderRadius" ||
          key === "opacity"
            ? Number(v || 0)
            : v,
      },
    }));
  };

  const setPropValue = (key: string, v: string) => {
    patchSelected((n) => ({
      ...n,
      props: { ...(n.props as Record<string, unknown>), [key]: v } as ComponentNode["props"],
    }));
  };

  const setRuntimeRepeat = (key: string, v: string | boolean) => {
    patchSelected((n) => ({
      ...n,
      runtime: {
        ...(n.runtime ?? {}),
        repeat: {
          ...(n.runtime?.repeat ?? {}),
          [key]: key === "limit" ? Number(v || 0) : v,
        },
      },
    }));
  };

  const setRuntimeValue = (key: string, v: string | boolean) => {
    patchSelected((n) => ({
      ...n,
      runtime: {
        ...(n.runtime ?? {}),
        [key]: v,
      },
    }));
  };

  const setColumnMap = (key: "text" | "src" | "href" | "alt" | "label" | "htmlFor", v: string) => {
    patchSelected((n) => ({
      ...n,
      runtime: {
        ...(n.runtime ?? {}),
        columnMap: {
          ...(n.runtime?.columnMap ?? {}),
          [key]: v,
        },
      },
    }));
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: open ? 320 : 56 }}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      className="relative h-full bg-[#fff] shadow-xl border-r border-border overflow-hidden shrink-0"
    >
      <div className="h-full p-2 overflow-y-auto">
        <div className={`flex items-center mb-6 ${open ? "justify-between" : "justify-center"}`}>
          {open && <h2 className="text-md font-semibold whitespace-nowrap">Layout Frame</h2>}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="shrink-0 flex items-center justify-center w-8 h-8"
          >
            {open ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        {open && (
          <div className="space-y-3">
            <div className="border border-border rounded-md">
              <button
                type="button"
                onClick={() => setHeaderOpen((prev) => !prev)}
                className="w-full px-3 py-2 flex items-center justify-between text-left"
              >
                <span className="text-sm font-semibold">Header</span>
                <ChevronDown size={16} className={`transition-transform ${headerOpen ? "rotate-0" : "-rotate-90"}`} />
              </button>
              {headerOpen && (
                <div className="px-2 pb-2">
                  <DesignerTree
                    section="header"
                    component={headerNode}
                    designerState={designerState}
                    setDesignerState={setDesignerState}
                    setShowComponentModal={setShowComponentModal}
                  />
                </div>
              )}
            </div>

            <div className="border border-border rounded-md">
              <button
                type="button"
                onClick={() => setTemplateOpen((prev) => !prev)}
                className="w-full px-3 py-2 flex items-center justify-between text-left"
              >
                <span className="text-sm font-semibold">Template</span>
                <ChevronDown size={16} className={`transition-transform ${templateOpen ? "rotate-0" : "-rotate-90"}`} />
              </button>
              {templateOpen && (
                <div className="px-2 pb-2">
                  <DesignerTree
                    section="template"
                    component={templateNode}
                    designerState={designerState}
                    setDesignerState={setDesignerState}
                    setShowComponentModal={setShowComponentModal}
                  />
                </div>
              )}
            </div>

            <div className="border border-border rounded-md">
              <button
                type="button"
                onClick={() => setFooterOpen((prev) => !prev)}
                className="w-full px-3 py-2 flex items-center justify-between text-left"
              >
                <span className="text-sm font-semibold">Footer</span>
                <ChevronDown size={16} className={`transition-transform ${footerOpen ? "rotate-0" : "-rotate-90"}`} />
              </button>
              {footerOpen && (
                <div className="px-2 pb-2">
                  <DesignerTree
                    section="footer"
                    component={footerNode}
                    designerState={designerState}
                    setDesignerState={setDesignerState}
                    setShowComponentModal={setShowComponentModal}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {inspectorOpen && selectedNode && (
        <div className="absolute inset-0 z-30 bg-white border-l border-border">
          <div className="h-full flex flex-col">
            <div className="px-3 py-2 border-b border-border flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">{selectedSection}</p>
                <p className="text-sm font-semibold">{selectedNode.id}</p>
                <p className="text-xs text-gray-500">{selectedNode.type}</p>
              </div>
              <button type="button" onClick={closeInspector} className="w-8 h-8 flex items-center justify-center">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
              <section className="space-y-2">
                <h3 className="text-sm font-semibold">Layout</h3>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="border rounded px-2 py-1 text-sm"
                    placeholder="width"
                    value={String(selectedNode.layout?.width?.value ?? "")}
                    onChange={(e) => setDimValue("width", e.target.value)}
                  />
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={(selectedNode.layout?.width?.unit ?? "px") as string}
                    onChange={(e) => setDimUnit("width", e.target.value as SizeUnit)}
                  >
                    <option value="px">px</option>
                    <option value="%">%</option>
                    <option value="rem">rem</option>
                    <option value="vw">vw</option>
                    <option value="vh">vh</option>
                  </select>
                  <input
                    className="border rounded px-2 py-1 text-sm"
                    placeholder="height"
                    value={String(selectedNode.layout?.height?.value ?? "")}
                    onChange={(e) => setDimValue("height", e.target.value)}
                  />
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={(selectedNode.layout?.height?.unit ?? "px") as string}
                    onChange={(e) => setDimUnit("height", e.target.value as SizeUnit)}
                  >
                    <option value="px">px</option>
                    <option value="%">%</option>
                    <option value="rem">rem</option>
                    <option value="vw">vw</option>
                    <option value="vh">vh</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="border rounded px-2 py-1 text-sm"
                    placeholder="gap"
                    value={String(selectedNode.layout?.gap ?? "")}
                    onChange={(e) => setLayoutNum("gap")(e.target.value)}
                  />
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={selectedNode.layout?.display ?? "block"}
                    onChange={(e) => patchSelected((n) => ({ ...n, layout: { ...(n.layout ?? {}), display: e.target.value as ComponentNode["layout"]["display"] } }))}
                  >
                    <option value="block">block</option>
                    <option value="flex">flex</option>
                    <option value="grid">grid</option>
                    <option value="inline-flex">inline-flex</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="border rounded px-2 py-1 text-sm"
                    placeholder="padding top"
                    value={String(num(selectedNode.layout?.padding?.top))}
                    onChange={(e) => setSpacing("padding", "top", e.target.value)}
                  />
                  <input
                    className="border rounded px-2 py-1 text-sm"
                    placeholder="padding right"
                    value={String(num(selectedNode.layout?.padding?.right))}
                    onChange={(e) => setSpacing("padding", "right", e.target.value)}
                  />
                  <input
                    className="border rounded px-2 py-1 text-sm"
                    placeholder="padding bottom"
                    value={String(num(selectedNode.layout?.padding?.bottom))}
                    onChange={(e) => setSpacing("padding", "bottom", e.target.value)}
                  />
                  <input
                    className="border rounded px-2 py-1 text-sm"
                    placeholder="padding left"
                    value={String(num(selectedNode.layout?.padding?.left))}
                    onChange={(e) => setSpacing("padding", "left", e.target.value)}
                  />
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold">Style</h3>
                <input
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="backgroundColor"
                  value={selectedNode.style?.backgroundColor ?? ""}
                  onChange={(e) => setStyleValue("backgroundColor", e.target.value)}
                />
                <input
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="textColor"
                  value={selectedNode.style?.textColor ?? ""}
                  onChange={(e) => setStyleValue("textColor", e.target.value)}
                />
                <input
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="backgroundImage URL"
                  value={selectedNode.style?.backgroundImage ?? ""}
                  onChange={(e) => setStyleValue("backgroundImage", e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="border rounded px-2 py-1 text-sm"
                    placeholder="fontSize"
                    value={String(selectedNode.style?.fontSize ?? "")}
                    onChange={(e) => setStyleValue("fontSize", e.target.value)}
                  />
                  <input
                    className="border rounded px-2 py-1 text-sm"
                    placeholder="borderRadius"
                    value={String(selectedNode.style?.borderRadius ?? "")}
                    onChange={(e) => setStyleValue("borderRadius", e.target.value)}
                  />
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold">Media</h3>
                <input
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="src / href"
                  value={
                    ((selectedNode.props as Record<string, unknown>)?.src as string | undefined) ??
                    ((selectedNode.props as Record<string, unknown>)?.href as string | undefined) ??
                    ""
                  }
                  onChange={(e) => {
                    const props = selectedNode.props as Record<string, unknown>;
                    if ("src" in props) setPropValue("src", e.target.value);
                    else setPropValue("href", e.target.value);
                  }}
                />
                <input
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="alt / text"
                  value={
                    ((selectedNode.props as Record<string, unknown>)?.alt as string | undefined) ??
                    ((selectedNode.props as Record<string, unknown>)?.text as string | undefined) ??
                    ""
                  }
                  onChange={(e) => {
                    const props = selectedNode.props as Record<string, unknown>;
                    if ("alt" in props) setPropValue("alt", e.target.value);
                    else setPropValue("text", e.target.value);
                  }}
                />
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold">Resource</h3>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!selectedNode.runtime?.repeat?.enabled}
                    onChange={(e) => setRuntimeRepeat("enabled", e.target.checked)}
                  />
                  Enable repeat
                </label>
                <input
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="menu"
                  value={selectedNode.runtime?.repeat?.menu ?? ""}
                  onChange={(e) => setRuntimeRepeat("menu", e.target.value)}
                />
                <select
                  className="w-full border rounded px-2 py-1 text-sm"
                  value={selectedNode.runtime?.repeat?.targetResource ?? "product"}
                  onChange={(e) => setRuntimeRepeat("targetResource", e.target.value)}
                >
                  <option value="product">product</option>
                  <option value="collection">collection</option>
                  <option value="customer">customer</option>
                  <option value="cart">cart</option>
                  <option value="form">form</option>
                  <option value="custom">custom</option>
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="border rounded px-2 py-1 text-sm"
                    placeholder="limit"
                    value={String(selectedNode.runtime?.repeat?.limit ?? "")}
                    onChange={(e) => setRuntimeRepeat("limit", e.target.value)}
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={!!selectedNode.runtime?.resourceContainer}
                      onChange={(e) => setRuntimeValue("resourceContainer", e.target.checked)}
                    />
                    Container
                  </label>
                </div>
                <input
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="dataPath"
                  value={selectedNode.runtime?.repeat?.dataPath ?? ""}
                  onChange={(e) => setRuntimeRepeat("dataPath", e.target.value)}
                />
                <input
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="columnMap.text"
                  value={selectedNode.runtime?.columnMap?.text ?? ""}
                  onChange={(e) => setColumnMap("text", e.target.value)}
                />
                <input
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="columnMap.src"
                  value={selectedNode.runtime?.columnMap?.src ?? ""}
                  onChange={(e) => setColumnMap("src", e.target.value)}
                />
              </section>
            </div>
          </div>
        </div>
      )}
    </motion.aside>
  );
}
