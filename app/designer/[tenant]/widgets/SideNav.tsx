"use client";

import { ChevronRight, ChevronLeft, ChevronDown, X } from "lucide-react";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { ComponentNode, DesignerState, LayoutProps, SizeUnit } from "./palette/types";
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

function removeNodeById(node: ComponentNode, id: string): ComponentNode | null {
  if (node.id === id) return null;

  const nextChildren = (node.children ?? [])
    .map((child) => removeNodeById(child, id))
    .filter((child): child is ComponentNode => child !== null);

  return {
    ...node,
    children: nextChildren,
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

  const selectedProps = useMemo(
    () =>
      selectedNode && typeof selectedNode.props === "object"
        ? (selectedNode.props as Record<string, unknown>)
        : {},
    [selectedNode],
  );

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

  const handleDeleteSelected = () => {
    if (!selectedSection || !selectedId || !selectedNode) return;

    if (selectedNode.parentId === null) {
      window.alert("The root node cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      `Delete "${selectedNode.id}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    if (selectedSection === "header") {
      setHeaderNode((prev) => removeNodeById(prev, selectedId) ?? prev);
    } else if (selectedSection === "template") {
      setTemplateNode((prev) => removeNodeById(prev, selectedId) ?? prev);
    } else {
      setFooterNode((prev) => removeNodeById(prev, selectedId) ?? prev);
    }

    closeInspector();
  };

  const deleteNodeFromSection = (section: string, nodeId: string) => {
    const target =
      section === "header"
        ? headerNode
        : section === "template"
          ? templateNode
          : footerNode;
    const node = findNodeById(target, nodeId);

    if (!node || node.parentId === null) {
      window.alert("The root node cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      `Delete "${node.id}"? This action cannot be undone.`,
    );
    if (!confirmed) return;

    if (section === "header") {
      setHeaderNode((prev) => removeNodeById(prev, nodeId) ?? prev);
    } else if (section === "template") {
      setTemplateNode((prev) => removeNodeById(prev, nodeId) ?? prev);
    } else {
      setFooterNode((prev) => removeNodeById(prev, nodeId) ?? prev);
    }

    if (
      designerState.selectedId === nodeId &&
      designerState.selectedSection === section
    ) {
      closeInspector();
    }
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

  const setDimensionValue = (
    key: "width" | "height" | "minWidth" | "minHeight" | "maxWidth" | "maxHeight",
    value: string,
  ) => {
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

  const setDimensionUnit = (
    key: "width" | "height" | "minWidth" | "minHeight" | "maxWidth" | "maxHeight",
    unit: SizeUnit,
  ) => {
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
        layout: {
          ...(n.layout ?? {}),
          [key]: Number(v || 0),
          ...(key === "gap" && Number(v || 0) > 0 && (n.layout?.display ?? "block") === "block"
            ? { display: "flex" }
            : {}),
        },
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

  const setLayoutValue = (key: keyof LayoutProps, value: unknown) => {
    patchSelected((n) => ({
      ...n,
      layout: {
        ...(n.layout ?? {}),
        [key]: value,
      },
    }));
  };

  const setPropValue = (key: string, value: unknown) => {
    patchSelected((n) => ({
      ...n,
      props: { ...(n.props as Record<string, unknown>), [key]: value } as ComponentNode["props"],
    }));
  };

  const renderPropControl = (key: string, value: unknown) => {
    const baseClass = "w-full border rounded px-2 py-1 text-sm";

    if (typeof value === "boolean") {
      return (
        <label key={key} className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={value} onChange={(e) => setPropValue(key, e.target.checked)} />
          {key}
        </label>
      );
    }

    if (typeof value === "number") {
      return (
        <input
          key={key}
          type="number"
          className={baseClass}
          placeholder={key}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => setPropValue(key, e.target.value === "" ? 0 : Number(e.target.value))}
        />
      );
    }

    if (key === "tag") {
      return (
        <select key={key} className={baseClass} value={String(value ?? "p")} onChange={(e) => setPropValue(key, e.target.value)}>
          <option value="p">p</option>
          <option value="span">span</option>
          <option value="h1">h1</option>
          <option value="h2">h2</option>
          <option value="h3">h3</option>
          <option value="h4">h4</option>
          <option value="h5">h5</option>
          <option value="h6">h6</option>
        </select>
      );
    }

    if (key === "variant") {
      return (
        <select key={key} className={baseClass} value={String(value ?? "primary")} onChange={(e) => setPropValue(key, e.target.value)}>
          <option value="primary">primary</option>
          <option value="secondary">secondary</option>
          <option value="ghost">ghost</option>
        </select>
      );
    }

    if (key === "inputType") {
      return (
        <select key={key} className={baseClass} value={String(value ?? "text")} onChange={(e) => setPropValue(key, e.target.value)}>
          <option value="text">text</option>
          <option value="email">email</option>
          <option value="password">password</option>
          <option value="number">number</option>
        </select>
      );
    }

    if (key === "objectFit") {
      return (
        <select key={key} className={baseClass} value={String(value ?? "cover")} onChange={(e) => setPropValue(key, e.target.value)}>
          <option value="cover">cover</option>
          <option value="contain">contain</option>
        </select>
      );
    }

    if (key === "provider") {
      return (
        <select key={key} className={baseClass} value={String(value ?? "custom")} onChange={(e) => setPropValue(key, e.target.value)}>
          <option value="youtube">youtube</option>
          <option value="vimeo">vimeo</option>
          <option value="facebook">facebook</option>
          <option value="tiktok">tiktok</option>
          <option value="instagram">instagram</option>
          <option value="file">file</option>
          <option value="custom">custom</option>
        </select>
      );
    }

    return (
      <input
        key={key}
        className={baseClass}
        placeholder={key}
        value={value == null ? "" : String(value)}
        onChange={(e) => setPropValue(key, e.target.value)}
      />
    );
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
      <div className="h-full p-2 overflow-y-auto overflow-x-hidden">
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
                <div className="px-2 pb-2 overflow-x-auto">
                  <DesignerTree
                    section="header"
                    component={headerNode}
                    designerState={designerState}
                    setDesignerState={setDesignerState}
                    setShowComponentModal={setShowComponentModal}
                    onDeleteNode={deleteNodeFromSection}
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
                <div className="px-2 pb-2 overflow-x-auto">
                  <DesignerTree
                    section="template"
                    component={templateNode}
                    designerState={designerState}
                    setDesignerState={setDesignerState}
                    setShowComponentModal={setShowComponentModal}
                    onDeleteNode={deleteNodeFromSection}
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
                <div className="px-2 pb-2 overflow-x-auto">
                  <DesignerTree
                    section="footer"
                    component={footerNode}
                    designerState={designerState}
                    setDesignerState={setDesignerState}
                    setShowComponentModal={setShowComponentModal}
                    onDeleteNode={deleteNodeFromSection}
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
                    onChange={(e) => patchSelected((n) => ({ ...n, layout: { ...(n.layout ?? {}), display: e.target.value as LayoutProps["display"] } }))}
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
                <div className="grid grid-cols-2 gap-2">
                  <input className="border rounded px-2 py-1 text-sm" placeholder="minWidth" value={String(selectedNode.layout?.minWidth?.value ?? "")} onChange={(e) => setDimensionValue("minWidth", e.target.value)} />
                  <select className="border rounded px-2 py-1 text-sm" value={(selectedNode.layout?.minWidth?.unit ?? "px") as string} onChange={(e) => setDimensionUnit("minWidth", e.target.value as SizeUnit)}>
                    <option value="px">px</option><option value="%">%</option><option value="rem">rem</option><option value="vw">vw</option><option value="vh">vh</option><option value="auto">auto</option>
                  </select>
                  <input className="border rounded px-2 py-1 text-sm" placeholder="maxWidth" value={String(selectedNode.layout?.maxWidth?.value ?? "")} onChange={(e) => setDimensionValue("maxWidth", e.target.value)} />
                  <select className="border rounded px-2 py-1 text-sm" value={(selectedNode.layout?.maxWidth?.unit ?? "px") as string} onChange={(e) => setDimensionUnit("maxWidth", e.target.value as SizeUnit)}>
                    <option value="px">px</option><option value="%">%</option><option value="rem">rem</option><option value="vw">vw</option><option value="vh">vh</option><option value="auto">auto</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input className="border rounded px-2 py-1 text-sm" placeholder="minHeight" value={String(selectedNode.layout?.minHeight?.value ?? "")} onChange={(e) => setDimensionValue("minHeight", e.target.value)} />
                  <select className="border rounded px-2 py-1 text-sm" value={(selectedNode.layout?.minHeight?.unit ?? "px") as string} onChange={(e) => setDimensionUnit("minHeight", e.target.value as SizeUnit)}>
                    <option value="px">px</option><option value="%">%</option><option value="rem">rem</option><option value="vw">vw</option><option value="vh">vh</option><option value="auto">auto</option>
                  </select>
                  <input className="border rounded px-2 py-1 text-sm" placeholder="maxHeight" value={String(selectedNode.layout?.maxHeight?.value ?? "")} onChange={(e) => setDimensionValue("maxHeight", e.target.value)} />
                  <select className="border rounded px-2 py-1 text-sm" value={(selectedNode.layout?.maxHeight?.unit ?? "px") as string} onChange={(e) => setDimensionUnit("maxHeight", e.target.value as SizeUnit)}>
                    <option value="px">px</option><option value="%">%</option><option value="rem">rem</option><option value="vw">vw</option><option value="vh">vh</option><option value="auto">auto</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select className="border rounded px-2 py-1 text-sm" value={selectedNode.layout?.flexDirection ?? "row"} onChange={(e) => setLayoutValue("flexDirection", e.target.value as LayoutProps["flexDirection"])}>
                    <option value="row">row</option><option value="column">column</option>
                  </select>
                  <select className="border rounded px-2 py-1 text-sm" value={selectedNode.layout?.justifyContent ?? "start"} onChange={(e) => setLayoutValue("justifyContent", e.target.value as LayoutProps["justifyContent"])}>
                    <option value="start">start</option><option value="center">center</option><option value="end">end</option><option value="space-between">space-between</option>
                  </select>
                  <select className="border rounded px-2 py-1 text-sm" value={selectedNode.layout?.alignItems ?? "stretch"} onChange={(e) => setLayoutValue("alignItems", e.target.value as LayoutProps["alignItems"])}>
                    <option value="start">start</option><option value="center">center</option><option value="end">end</option><option value="stretch">stretch</option>
                  </select>
                  <select className="border rounded px-2 py-1 text-sm" value={selectedNode.layout?.position ?? "static"} onChange={(e) => setLayoutValue("position", e.target.value as LayoutProps["position"])}>
                    <option value="static">static</option><option value="relative">relative</option><option value="absolute">absolute</option><option value="sticky">sticky</option><option value="fixed">fixed</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input className="border rounded px-2 py-1 text-sm" placeholder="top" value={String(selectedNode.layout?.top ?? "")} onChange={(e) => setLayoutValue("top", Number(e.target.value || 0))} />
                  <input className="border rounded px-2 py-1 text-sm" placeholder="right" value={String(selectedNode.layout?.right ?? "")} onChange={(e) => setLayoutValue("right", Number(e.target.value || 0))} />
                  <input className="border rounded px-2 py-1 text-sm" placeholder="bottom" value={String(selectedNode.layout?.bottom ?? "")} onChange={(e) => setLayoutValue("bottom", Number(e.target.value || 0))} />
                  <input className="border rounded px-2 py-1 text-sm" placeholder="left" value={String(selectedNode.layout?.left ?? "")} onChange={(e) => setLayoutValue("left", Number(e.target.value || 0))} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input className="border rounded px-2 py-1 text-sm" placeholder="zIndex" value={String(selectedNode.layout?.zIndex ?? "")} onChange={(e) => setLayoutValue("zIndex", Number(e.target.value || 0))} />
                  <input className="border rounded px-2 py-1 text-sm" placeholder="border" value={String(selectedNode.layout?.border ?? "")} onChange={(e) => setLayoutNum("border")(e.target.value)} />
                  <select className="border rounded px-2 py-1 text-sm" value={selectedNode.layout?.overflow ?? "visible"} onChange={(e) => setLayoutValue("overflow", e.target.value as LayoutProps["overflow"])}>
                    <option value="visible">visible</option><option value="hidden">hidden</option><option value="auto">auto</option><option value="scroll">scroll</option>
                  </select>
                  <label className="flex items-center gap-2 text-sm border rounded px-2 py-1">
                    <input type="checkbox" checked={!!selectedNode.layout?.wrap} onChange={(e) => setLayoutValue("wrap", e.target.checked)} />
                    Wrap
                  </label>
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
                  <input
                    className="border rounded px-2 py-1 text-sm"
                    placeholder="borderColor"
                    value={selectedNode.style?.borderColor ?? ""}
                    onChange={(e) => setStyleValue("borderColor", e.target.value)}
                  />
                  <input
                    className="border rounded px-2 py-1 text-sm"
                    placeholder="borderWidth"
                    value={String(selectedNode.style?.borderWidth ?? "")}
                    onChange={(e) => setStyleValue("borderWidth", e.target.value)}
                  />
                  <input
                    className="border rounded px-2 py-1 text-sm"
                    placeholder="opacity"
                    value={String(selectedNode.style?.opacity ?? "")}
                    onChange={(e) => setStyleValue("opacity", e.target.value)}
                  />
                  <input
                    className="border rounded px-2 py-1 text-sm"
                    placeholder="boxShadow"
                    value={selectedNode.style?.boxShadow ?? ""}
                    onChange={(e) => setStyleValue("boxShadow", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={selectedNode.style?.backgroundSize ?? "cover"}
                    onChange={(e) => setStyleValue("backgroundSize", e.target.value)}
                  >
                    <option value="cover">cover</option>
                    <option value="contain">contain</option>
                    <option value="auto">auto</option>
                  </select>
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={selectedNode.style?.backgroundRepeat ?? "no-repeat"}
                    onChange={(e) => setStyleValue("backgroundRepeat", e.target.value)}
                  >
                    <option value="repeat">repeat</option>
                    <option value="no-repeat">no-repeat</option>
                    <option value="repeat-x">repeat-x</option>
                    <option value="repeat-y">repeat-y</option>
                  </select>
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={selectedNode.style?.backgroundPosition ?? "center center"}
                    onChange={(e) => setStyleValue("backgroundPosition", e.target.value)}
                  >
                    <option value="left">left</option>
                    <option value="center">center</option>
                    <option value="right">right</option>
                    <option value="top">top</option>
                    <option value="bottom">bottom</option>
                    <option value="left top">left top</option>
                    <option value="left center">left center</option>
                    <option value="left bottom">left bottom</option>
                    <option value="center top">center top</option>
                    <option value="center center">center center</option>
                    <option value="center bottom">center bottom</option>
                    <option value="right top">right top</option>
                    <option value="right center">right center</option>
                    <option value="right bottom">right bottom</option>
                  </select>
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={selectedNode.style?.textAlign ?? "left"}
                    onChange={(e) => setStyleValue("textAlign", e.target.value)}
                  >
                    <option value="left">left</option>
                    <option value="center">center</option>
                    <option value="right">right</option>
                  </select>
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
                <h3 className="text-sm font-semibold">Props</h3>
                <div className="space-y-2">
                  {Object.entries(selectedProps).length === 0 && (
                    <p className="text-xs text-slate-500">No editable props for this node.</p>
                  )}
                  {Object.entries(selectedProps).map(([key, value]) => renderPropControl(key, value))}
                </div>
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

              <section className="pt-2 border-t border-border">
                <button
                  type="button"
                  className="w-full rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                  onClick={handleDeleteSelected}
                >
                  Delete selected node
                </button>
              </section>
            </div>
          </div>
        </div>
      )}
    </motion.aside>
  );
}
