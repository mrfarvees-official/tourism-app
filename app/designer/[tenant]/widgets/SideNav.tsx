"use client";

import { ChevronRight, ChevronLeft, ChevronDown, X } from "lucide-react";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, ReactNode, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ComponentNode, DesignerState, LayoutProps, SizeUnit } from "./palette/types";
import { DesignerTree } from "./componentService";
import { useMedia, type MediaItem } from "@/src/api/hooks/media/useMedia";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  showComponentModel: boolean;
  tenantKey?: string;
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

function humanizeKey(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function Field({
  label,
  children,
  className = "grid gap-1.5 text-sm",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}

export default function SideNav({
  open,
  setOpen,
  showComponentModel,
  tenantKey,
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
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [resourceTab, setResourceTab] = useState<"source" | "columns">("source");
  const [mediaPickerTarget, setMediaPickerTarget] = useState<
    "src" | "href" | "backgroundImage" | null
  >(null);
  const [mediaSearch, setMediaSearch] = useState("");
  const [selectedMediaUrl, setSelectedMediaUrl] = useState("");
  const { media, loading: mediaLoading, errors: mediaErrors, handleGetAllMedia } = useMedia();

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

  const filteredMedia = useMemo(() => {
    const query = mediaSearch.trim().toLowerCase();
    if (!query) return media;

    return media.filter((item) => {
      const label = item.label?.toLowerCase() ?? "";
      const url = item.url?.toLowerCase() ?? item.secure_url?.toLowerCase() ?? "";
      const publicId = item.public_id?.toLowerCase() ?? "";
      const path = item.path?.toLowerCase() ?? "";
      return [label, url, publicId, path].some((value) => value.includes(query));
    });
  }, [media, mediaSearch]);

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

  const getMediaUrl = (item: MediaItem) => item.url ?? item.secure_url ?? "";

  const openMediaPicker = (target: "src" | "href" | "backgroundImage") => {
    if (!tenantKey) {
      window.alert("Tenant context is required to load media.");
      return;
    }

    setMediaPickerTarget(target);
    setSelectedMediaUrl(
      target === "backgroundImage"
        ? String(selectedNode?.style?.backgroundImage ?? "")
        : String(selectedProps[target] ?? ""),
    );
    setMediaSearch("");
    setMediaPickerOpen(true);
  };

  const commitMediaSelection = async () => {
    const url = selectedMediaUrl.trim();
    if (!url || !mediaPickerTarget) return;

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // clipboard is a convenience only
    }

    if (mediaPickerTarget === "backgroundImage") {
      patchSelected((n) => ({
        ...n,
        style: {
          ...(n.style ?? {}),
          backgroundImage: url,
        },
      }));
    } else {
      setPropValue(mediaPickerTarget, url);
    }

    setMediaPickerOpen(false);
    setMediaPickerTarget(null);
  };

  const renderPropControl = (key: string, value: unknown) => {
    const baseClass = "w-full border rounded px-2 py-1 text-sm";
    const label = humanizeKey(key);

    if (typeof value === "boolean") {
      return (
        <label key={key} className="flex items-center justify-between gap-3 rounded border border-border px-3 py-2 text-sm">
          <span>{label}</span>
          <input type="checkbox" checked={value} onChange={(e) => setPropValue(key, e.target.checked)} />
        </label>
      );
    }

    if (typeof value === "number") {
      return (
        <label key={key} className="grid gap-1.5 text-sm">
          <span className="font-medium text-slate-600">{label}</span>
          <input
            type="number"
            className={baseClass}
            placeholder={label}
            value={Number.isFinite(value) ? value : 0}
            onChange={(e) => setPropValue(key, e.target.value === "" ? 0 : Number(e.target.value))}
          />
        </label>
      );
    }

    if (key === "tag") {
      return (
        <label key={key} className="grid gap-1.5 text-sm">
          <span className="font-medium text-slate-600">{label}</span>
          <select className={baseClass} value={String(value ?? "p")} onChange={(e) => setPropValue(key, e.target.value)}>
            <option value="p">p</option>
            <option value="span">span</option>
            <option value="h1">h1</option>
            <option value="h2">h2</option>
            <option value="h3">h3</option>
            <option value="h4">h4</option>
            <option value="h5">h5</option>
            <option value="h6">h6</option>
          </select>
        </label>
      );
    }

    if (key === "variant") {
      return (
        <label key={key} className="grid gap-1.5 text-sm">
          <span className="font-medium text-slate-600">{label}</span>
          <select className={baseClass} value={String(value ?? "primary")} onChange={(e) => setPropValue(key, e.target.value)}>
            <option value="primary">primary</option>
            <option value="secondary">secondary</option>
            <option value="ghost">ghost</option>
          </select>
        </label>
      );
    }

    if (key === "inputType") {
      return (
        <label key={key} className="grid gap-1.5 text-sm">
          <span className="font-medium text-slate-600">{label}</span>
          <select className={baseClass} value={String(value ?? "text")} onChange={(e) => setPropValue(key, e.target.value)}>
            <option value="text">text</option>
            <option value="email">email</option>
            <option value="password">password</option>
            <option value="number">number</option>
          </select>
        </label>
      );
    }

    if (key === "objectFit") {
      return (
        <label key={key} className="grid gap-1.5 text-sm">
          <span className="font-medium text-slate-600">{label}</span>
          <select className={baseClass} value={String(value ?? "cover")} onChange={(e) => setPropValue(key, e.target.value)}>
            <option value="cover">cover</option>
            <option value="contain">contain</option>
          </select>
        </label>
      );
    }

    if (key === "provider") {
      return (
        <label key={key} className="grid gap-1.5 text-sm">
          <span className="font-medium text-slate-600">{label}</span>
          <select className={baseClass} value={String(value ?? "custom")} onChange={(e) => setPropValue(key, e.target.value)}>
            <option value="youtube">youtube</option>
            <option value="vimeo">vimeo</option>
            <option value="facebook">facebook</option>
            <option value="tiktok">tiktok</option>
            <option value="instagram">instagram</option>
            <option value="file">file</option>
            <option value="custom">custom</option>
          </select>
        </label>
      );
    }

    return (
      <label key={key} className="grid gap-1.5 text-sm">
        <span className="font-medium text-slate-600">{label}</span>
        <input
          className={baseClass}
          placeholder={label}
          value={value == null ? "" : String(value)}
          onChange={(e) => setPropValue(key, e.target.value)}
        />
      </label>
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

  const setRepeatPolicyColumnVisibility = (column: string, visible: boolean) => {
    patchSelected((n) => ({
      ...n,
      runtime: {
        ...(n.runtime ?? {}),
        repeat: {
          ...(n.runtime?.repeat ?? {}),
          policy: {
            ...(n.runtime?.repeat?.policy ?? {}),
            columnVisibility: {
              ...(n.runtime?.repeat?.policy?.columnVisibility ?? {}),
              [column]: visible,
            },
          },
        },
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

  useEffect(() => {
    if (!mediaPickerOpen || !tenantKey) return;
    void handleGetAllMedia(tenantKey);
  }, [handleGetAllMedia, mediaPickerOpen, tenantKey]);

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
                  <Field label="Width">
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Width"
                      value={String(selectedNode.layout?.width?.value ?? "")}
                      onChange={(e) => setDimValue("width", e.target.value)}
                    />
                  </Field>
                  <Field label="Width unit">
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
                  </Field>
                  <Field label="Height">
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Height"
                      value={String(selectedNode.layout?.height?.value ?? "")}
                      onChange={(e) => setDimValue("height", e.target.value)}
                    />
                  </Field>
                  <Field label="Height unit">
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
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Field label="Gap">
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Gap"
                      value={String(selectedNode.layout?.gap ?? "")}
                      onChange={(e) => setLayoutNum("gap")(e.target.value)}
                    />
                  </Field>
                  <Field label="Display">
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={selectedNode.layout?.display ?? "block"}
                      onChange={(e) =>
                        patchSelected((n) => ({
                          ...n,
                          layout: { ...(n.layout ?? {}), display: e.target.value as LayoutProps["display"] },
                        }))
                      }
                    >
                      <option value="block">block</option>
                      <option value="flex">flex</option>
                      <option value="grid">grid</option>
                      <option value="inline-flex">inline-flex</option>
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Field label="Padding top">
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Padding top"
                      value={String(num(selectedNode.layout?.padding?.top))}
                      onChange={(e) => setSpacing("padding", "top", e.target.value)}
                    />
                  </Field>
                  <Field label="Padding right">
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Padding right"
                      value={String(num(selectedNode.layout?.padding?.right))}
                      onChange={(e) => setSpacing("padding", "right", e.target.value)}
                    />
                  </Field>
                  <Field label="Padding bottom">
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Padding bottom"
                      value={String(num(selectedNode.layout?.padding?.bottom))}
                      onChange={(e) => setSpacing("padding", "bottom", e.target.value)}
                    />
                  </Field>
                  <Field label="Padding left">
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Padding left"
                      value={String(num(selectedNode.layout?.padding?.left))}
                      onChange={(e) => setSpacing("padding", "left", e.target.value)}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Field label="Min width">
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Min width"
                      value={String(selectedNode.layout?.minWidth?.value ?? "")}
                      onChange={(e) => setDimensionValue("minWidth", e.target.value)}
                    />
                  </Field>
                  <Field label="Min width unit">
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={(selectedNode.layout?.minWidth?.unit ?? "px") as string}
                      onChange={(e) => setDimensionUnit("minWidth", e.target.value as SizeUnit)}
                    >
                      <option value="px">px</option>
                      <option value="%">%</option>
                      <option value="rem">rem</option>
                      <option value="vw">vw</option>
                      <option value="vh">vh</option>
                      <option value="auto">auto</option>
                    </select>
                  </Field>
                  <Field label="Max width">
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Max width"
                      value={String(selectedNode.layout?.maxWidth?.value ?? "")}
                      onChange={(e) => setDimensionValue("maxWidth", e.target.value)}
                    />
                  </Field>
                  <Field label="Max width unit">
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={(selectedNode.layout?.maxWidth?.unit ?? "px") as string}
                      onChange={(e) => setDimensionUnit("maxWidth", e.target.value as SizeUnit)}
                    >
                      <option value="px">px</option>
                      <option value="%">%</option>
                      <option value="rem">rem</option>
                      <option value="vw">vw</option>
                      <option value="vh">vh</option>
                      <option value="auto">auto</option>
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Field label="Min height">
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Min height"
                      value={String(selectedNode.layout?.minHeight?.value ?? "")}
                      onChange={(e) => setDimensionValue("minHeight", e.target.value)}
                    />
                  </Field>
                  <Field label="Min height unit">
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={(selectedNode.layout?.minHeight?.unit ?? "px") as string}
                      onChange={(e) => setDimensionUnit("minHeight", e.target.value as SizeUnit)}
                    >
                      <option value="px">px</option>
                      <option value="%">%</option>
                      <option value="rem">rem</option>
                      <option value="vw">vw</option>
                      <option value="vh">vh</option>
                      <option value="auto">auto</option>
                    </select>
                  </Field>
                  <Field label="Max height">
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Max height"
                      value={String(selectedNode.layout?.maxHeight?.value ?? "")}
                      onChange={(e) => setDimensionValue("maxHeight", e.target.value)}
                    />
                  </Field>
                  <Field label="Max height unit">
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={(selectedNode.layout?.maxHeight?.unit ?? "px") as string}
                      onChange={(e) => setDimensionUnit("maxHeight", e.target.value as SizeUnit)}
                    >
                      <option value="px">px</option>
                      <option value="%">%</option>
                      <option value="rem">rem</option>
                      <option value="vw">vw</option>
                      <option value="vh">vh</option>
                      <option value="auto">auto</option>
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Field label="Flex direction">
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={selectedNode.layout?.flexDirection ?? "row"}
                      onChange={(e) =>
                        setLayoutValue("flexDirection", e.target.value as LayoutProps["flexDirection"])
                      }
                    >
                      <option value="row">row</option>
                      <option value="column">column</option>
                    </select>
                  </Field>
                  <Field label="Justify content">
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={selectedNode.layout?.justifyContent ?? "start"}
                      onChange={(e) =>
                        setLayoutValue("justifyContent", e.target.value as LayoutProps["justifyContent"])
                      }
                    >
                      <option value="start">start</option>
                      <option value="center">center</option>
                      <option value="end">end</option>
                      <option value="space-between">space-between</option>
                    </select>
                  </Field>
                  <Field label="Align items">
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={selectedNode.layout?.alignItems ?? "stretch"}
                      onChange={(e) =>
                        setLayoutValue("alignItems", e.target.value as LayoutProps["alignItems"])
                      }
                    >
                      <option value="start">start</option>
                      <option value="center">center</option>
                      <option value="end">end</option>
                      <option value="stretch">stretch</option>
                    </select>
                  </Field>
                  <Field label="Position">
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={selectedNode.layout?.position ?? "static"}
                      onChange={(e) =>
                        setLayoutValue("position", e.target.value as LayoutProps["position"])
                      }
                    >
                      <option value="static">static</option>
                      <option value="relative">relative</option>
                      <option value="absolute">absolute</option>
                      <option value="sticky">sticky</option>
                      <option value="fixed">fixed</option>
                    </select>
                  </Field>
                </div>
                {selectedNode.layout?.display === "grid" ? (
                  <div className="grid grid-cols-2 gap-2">
                    <label className="grid gap-1.5 text-sm">
                      <span className="font-medium text-slate-600">Columns</span>
                      <input
                        className="border rounded px-2 py-1 text-sm"
                        type="number"
                        min={1}
                        placeholder="Columns"
                        value={String(selectedNode.layout?.columns ?? 3)}
                        onChange={(e) =>
                          setLayoutValue(
                            "columns",
                            e.target.value === "" ? undefined : Number(e.target.value),
                          )
                        }
                      />
                    </label>
                  </div>
                ) : null}
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Top">
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Top"
                      value={String(selectedNode.layout?.top ?? "")}
                      onChange={(e) => setLayoutValue("top", Number(e.target.value || 0))}
                    />
                  </Field>
                  <Field label="Right">
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Right"
                      value={String(selectedNode.layout?.right ?? "")}
                      onChange={(e) => setLayoutValue("right", Number(e.target.value || 0))}
                    />
                  </Field>
                  <Field label="Bottom">
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Bottom"
                      value={String(selectedNode.layout?.bottom ?? "")}
                      onChange={(e) => setLayoutValue("bottom", Number(e.target.value || 0))}
                    />
                  </Field>
                  <Field label="Left">
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Left"
                      value={String(selectedNode.layout?.left ?? "")}
                      onChange={(e) => setLayoutValue("left", Number(e.target.value || 0))}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Z index">
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Z index"
                      value={String(selectedNode.layout?.zIndex ?? "")}
                      onChange={(e) => setLayoutValue("zIndex", Number(e.target.value || 0))}
                    />
                  </Field>
                  <Field label="Border">
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Border"
                      value={String(selectedNode.layout?.border ?? "")}
                      onChange={(e) => setLayoutNum("border")(e.target.value)}
                    />
                  </Field>
                  <Field label="Overflow">
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={selectedNode.layout?.overflow ?? "visible"}
                      onChange={(e) =>
                        setLayoutValue("overflow", e.target.value as LayoutProps["overflow"])
                      }
                    >
                      <option value="visible">visible</option>
                      <option value="hidden">hidden</option>
                      <option value="auto">auto</option>
                      <option value="scroll">scroll</option>
                    </select>
                  </Field>
                  <Field label="Wrap">
                    <label className="flex items-center gap-2 rounded border border-border px-2 py-1 text-sm">
                      <input
                        type="checkbox"
                        checked={!!selectedNode.layout?.wrap}
                        onChange={(e) => setLayoutValue("wrap", e.target.checked)}
                      />
                      <span>Enable wrapping</span>
                    </label>
                  </Field>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold">Style</h3>
                <Field label="Background color">
                  <input
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="Background color"
                    value={selectedNode.style?.backgroundColor ?? ""}
                    onChange={(e) => setStyleValue("backgroundColor", e.target.value)}
                  />
                </Field>
                <Field label="Text color">
                  <input
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="Text color"
                    value={selectedNode.style?.textColor ?? ""}
                    onChange={(e) => setStyleValue("textColor", e.target.value)}
                  />
                </Field>
                <Field label="Background image URL">
                  <input
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="Background image URL"
                    value={selectedNode.style?.backgroundImage ?? ""}
                    onChange={(e) => setStyleValue("backgroundImage", e.target.value)}
                  />
                </Field>
                <button
                  type="button"
                  className="w-full rounded border border-dashed border-border bg-gray-50 px-2 py-1 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => openMediaPicker("backgroundImage")}
                >
                  Change background image
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Font size">
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Font size"
                      value={String(selectedNode.style?.fontSize ?? "")}
                      onChange={(e) => setStyleValue("fontSize", e.target.value)}
                    />
                  </Field>
                  <Field label="Border radius">
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Border radius"
                      value={String(selectedNode.style?.borderRadius ?? "")}
                      onChange={(e) => setStyleValue("borderRadius", e.target.value)}
                    />
                  </Field>
                  <Field label="Border color">
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Border color"
                      value={selectedNode.style?.borderColor ?? ""}
                      onChange={(e) => setStyleValue("borderColor", e.target.value)}
                    />
                  </Field>
                  <Field label="Border width">
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Border width"
                      value={String(selectedNode.style?.borderWidth ?? "")}
                      onChange={(e) => setStyleValue("borderWidth", e.target.value)}
                    />
                  </Field>
                  <Field label="Opacity">
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Opacity"
                      value={String(selectedNode.style?.opacity ?? "")}
                      onChange={(e) => setStyleValue("opacity", e.target.value)}
                    />
                  </Field>
                  <Field label="Box shadow">
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Box shadow"
                      value={selectedNode.style?.boxShadow ?? ""}
                      onChange={(e) => setStyleValue("boxShadow", e.target.value)}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Background size">
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={selectedNode.style?.backgroundSize ?? "cover"}
                      onChange={(e) => setStyleValue("backgroundSize", e.target.value)}
                    >
                      <option value="cover">cover</option>
                      <option value="contain">contain</option>
                      <option value="auto">auto</option>
                    </select>
                  </Field>
                  <Field label="Background repeat">
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
                  </Field>
                  <Field label="Background position">
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
                  </Field>
                  <Field label="Text align">
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={selectedNode.style?.textAlign ?? "left"}
                      onChange={(e) => setStyleValue("textAlign", e.target.value)}
                    >
                      <option value="left">left</option>
                      <option value="center">center</option>
                      <option value="right">right</option>
                    </select>
                  </Field>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold">Media</h3>
                <Field label="Source URL">
                  <input
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="Source URL"
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
                </Field>
                <button
                  type="button"
                  className="w-full rounded border border-dashed border-border bg-gray-50 px-2 py-1 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() =>
                    openMediaPicker(
                      "src" in selectedProps
                        ? "src"
                        : selectedNode.type === "Frame" ||
                            selectedNode.type === "Card" ||
                            selectedNode.type === "Slider"
                          ? "backgroundImage"
                          : "href",
                    )
                  }
                >
                  Change image
                </button>
                <Field label="Alt / text">
                  <input
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="Alt / text"
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
                </Field>
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
                <div className="flex gap-2 rounded-md border border-border bg-bg p-1 text-xs font-semibold">
                  <button
                    type="button"
                    className={`flex-1 rounded px-3 py-2 ${resourceTab === "source" ? "bg-fg text-bg" : "text-muted"}`}
                    onClick={() => setResourceTab("source")}
                  >
                    Source
                  </button>
                  <button
                    type="button"
                    className={`flex-1 rounded px-3 py-2 ${resourceTab === "columns" ? "bg-fg text-bg" : "text-muted"}`}
                    onClick={() => setResourceTab("columns")}
                  >
                    Columns
                  </button>
                </div>

                {resourceTab === "source" ? (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={!!selectedNode.runtime?.repeat?.enabled}
                        onChange={(e) => setRuntimeRepeat("enabled", e.target.checked)}
                      />
                      Enable repeat
                    </label>
                    <Field label="Menu">
                      <input
                        className="w-full border rounded px-2 py-1 text-sm"
                        placeholder="Menu"
                        value={selectedNode.runtime?.repeat?.menu ?? ""}
                        onChange={(e) => setRuntimeRepeat("menu", e.target.value)}
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Limit">
                        <input
                          className="border rounded px-2 py-1 text-sm"
                          placeholder="Limit"
                          value={String(selectedNode.runtime?.repeat?.limit ?? "")}
                          onChange={(e) => setRuntimeRepeat("limit", e.target.value)}
                        />
                      </Field>
                      <Field label="Container">
                        <label className="flex items-center gap-2 rounded border border-border px-2 py-1 text-sm">
                          <input
                            type="checkbox"
                            checked={!!selectedNode.runtime?.resourceContainer}
                            onChange={(e) => setRuntimeValue("resourceContainer", e.target.checked)}
                          />
                          <span>Enable</span>
                        </label>
                      </Field>
                    </div>
                    <Field label="Data path">
                      <input
                        className="w-full border rounded px-2 py-1 text-sm"
                        placeholder="Data path"
                        value={selectedNode.runtime?.repeat?.dataPath ?? ""}
                        onChange={(e) => setRuntimeRepeat("dataPath", e.target.value)}
                      />
                    </Field>
                    <Field label="Column map text">
                      <input
                        className="w-full border rounded px-2 py-1 text-sm"
                        placeholder="Column map text"
                        value={selectedNode.runtime?.columnMap?.text ?? ""}
                        onChange={(e) => setColumnMap("text", e.target.value)}
                      />
                    </Field>
                    <Field label="Column map source">
                      <input
                        className="w-full border rounded px-2 py-1 text-sm"
                        placeholder="Column map source"
                        value={selectedNode.runtime?.columnMap?.src ?? ""}
                        onChange={(e) => setColumnMap("src", e.target.value)}
                      />
                    </Field>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-muted">
                      Control which destination fields can hydrate in public mode.
                    </p>
                    {[
                      ["title", "Title"],
                      ["subtitle", "Subtitle"],
                      ["description", "Description"],
                      ["image", "Image"],
                      ["href", "Link"],
                      ["meta", "Meta"],
                      ["region", "Region"],
                      ["province", "Province"],
                      ["district", "District"],
                      ["bestTimeToVisit", "Best time to visit"],
                      ["nearbyAttractions", "Nearby attractions"],
                      ["latitude", "Latitude"],
                      ["longitude", "Longitude"],
                      ["featured", "Featured"],
                    ].map(([key, label]) => (
                      <label key={key} className="flex items-center justify-between gap-3 rounded border border-border px-3 py-2 text-sm">
                        <span>{label}</span>
                        <input
                          type="checkbox"
                          checked={selectedNode.runtime?.repeat?.policy?.columnVisibility?.[key] !== false}
                          onChange={(e) => setRepeatPolicyColumnVisibility(key, e.target.checked)}
                        />
                      </label>
                    ))}
                  </div>
                )}
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
      {mediaPickerOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Select tenant media</p>
                <p className="text-xs text-gray-500">
                  Pick an image, then press OK to replace the current URL.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMediaPickerOpen(false);
                  setMediaPickerTarget(null);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid gap-4 p-4 lg:grid-cols-[280px_minmax(0,1fr)]">
              <div className="space-y-3">
                <input
                  className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none"
                  placeholder="Search media"
                  value={mediaSearch}
                  onChange={(e) => setMediaSearch(e.target.value)}
                />

                <div className="rounded-xl border border-border bg-gray-50 p-3 text-sm text-gray-600">
                  <div className="flex justify-between gap-4">
                    <span>Tenant</span>
                    <span className="font-medium text-gray-900">{tenantKey ?? "-"}</span>
                  </div>
                  <div className="mt-2 flex justify-between gap-4">
                    <span>Target</span>
                    <span className="font-medium text-gray-900">{mediaPickerTarget ?? "-"}</span>
                  </div>
                  <div className="mt-2 flex justify-between gap-4">
                    <span>Selected</span>
                    <span className="truncate font-medium text-gray-900">{selectedMediaUrl || "-"}</span>
                  </div>
                </div>

                {mediaErrors?.length ? (
                  <p className="text-sm text-red-600">{mediaErrors[0]}</p>
                ) : null}
              </div>

              <div className="min-h-[420px] overflow-hidden rounded-2xl border border-border">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold">Media library</p>
                    <p className="text-xs text-gray-500">
                      {mediaLoading ? "Loading..." : `${filteredMedia.length} item(s)`}
                    </p>
                  </div>
                </div>

                <div className="max-h-[65vh] overflow-auto p-4">
                  {mediaLoading && media.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border bg-gray-50 p-8 text-center text-sm text-gray-500">
                      Loading tenant media...
                    </div>
                  ) : filteredMedia.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border bg-gray-50 p-8 text-center text-sm text-gray-500">
                      No media matches your search.
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {filteredMedia.map((item) => {
                        const imageUrl = getMediaUrl(item);
                        const isSelected = imageUrl === selectedMediaUrl;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedMediaUrl(imageUrl)}
                            className={`overflow-hidden rounded-xl border text-left transition ${
                              isSelected
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className="aspect-[4/3] bg-gray-100">
                              {imageUrl ? (
                                <div className="relative h-full w-full">
                                  <Image
                                    src={imageUrl}
                                    alt={item.label ?? `Media ${item.id}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    unoptimized
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="flex h-full items-center justify-center text-gray-400">
                                  <span className="text-sm">No preview</span>
                                </div>
                              )}
                            </div>
                            <div className="space-y-1 p-3">
                              <p className="truncate text-sm font-semibold text-gray-900">
                                {item.label?.trim() || `Media #${item.id}`}
                              </p>
                              <p className="truncate text-xs text-gray-500">{imageUrl || "-"}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-3">
              <button
                type="button"
                onClick={() => {
                  setMediaPickerOpen(false);
                  setMediaPickerTarget(null);
                }}
                className="rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void commitMediaSelection()}
                disabled={!selectedMediaUrl.trim()}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.aside>
  );
}
