"use client";

import {
  Dispatch,
  MouseEvent,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Component,
  ComponentList,
  ComponentNode,
  componentRegistry,
  DesignerState,
} from "./palette/types";
import { LuFrame, LuTextCursorInput } from "react-icons/lu";
import {
  MdTextFields,
  MdOutlineDataObject,
  MdOutlineCompare,
} from "react-icons/md";
import { FaLink, FaVideo, FaImage, FaList } from "react-icons/fa";
import { TbCircuitPushbutton } from "react-icons/tb";
import { GoPackage } from "react-icons/go";
import { PiSlidersHorizontalBold } from "react-icons/pi";
import { IoText } from "react-icons/io5";
import { IoIosAddCircleOutline } from "react-icons/io";
import { ChevronDown, Search } from "lucide-react";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogFooter,
  DialogHeader,
} from "@/src/shared/components/dailog";
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { components } from "./palette/data";
import RenderComponent from "./palette/RenderComponent";

const iSize = 12;
const ROW_HEIGHT = 24;

const isHeroSection = (label?: string) => {
  if (!label) return false;

  const l = label.toLowerCase();

  return l.includes("hero") || l.includes("banner") || l.includes("slideshow");
};

const getPreviewHeight = (label: string, isHero: boolean) => {
  const l = label.toLowerCase();

  if (isHero) return PREVIEW_HEIGHT; // 810
  if (l.includes("collection list: carousel")) return 270;
  if (l.includes("collection list: bento")) return 580;
  if (l.includes("contact form")) return 580;
  if (l.includes("divider")) return 40;
  if (l.includes("featured collection: editorial")) return 480;
  if (l.includes("featured collection: grid")) return 720;
  if (l.includes("featured product")) return 460;
  if (l.includes("product highlight")) return 580;
  if (l.includes("product hotspots")) return 580;
  if (l.includes("recommended products")) return 460;
  if (l.includes("blog posts: carousel")) return 420;
  if (l.includes("blog posts: editorial")) return 580;
  if (l.includes("blog posts: grid")) return 420;
  if (l.includes("carousel")) return 420;
  if (l.includes("video")) return PREVIEW_HEIGHT;
  if (l.includes("editorial: jumbo text")) return 480;
  if (l === "editorial") return 480;
  if (l.includes("image compare")) return 480;
  if (l.includes("image with text")) return 530;
  if (l.includes("marquee")) return 120;
  if (l.includes("multicolumn")) return 220;
  if (l.includes("rich text")) return 270;
  if (l.includes("pull quote")) return 270;

  return 270;
};

export const typeIcons: Record<Exclude<Component, "Model">, ReactNode> = {
  Frame: <LuFrame size={iSize} />,
  Text: <MdTextFields size={iSize} />,
  Link: <FaLink size={iSize} />,
  Video: <FaVideo size={iSize} />,
  ImageCompare: <MdOutlineCompare size={iSize} />,
  Image: <FaImage size={iSize} />,
  Button: <TbCircuitPushbutton size={iSize} />,
  List: <FaList size={iSize} />,
  Card: <GoPackage size={iSize} />,
  Slider: <PiSlidersHorizontalBold size={iSize} />,
  Form: <MdOutlineDataObject size={iSize} />,
  Input: <LuTextCursorInput size={iSize} />,
  Label: <IoText size={iSize} />,
  Icon: <FaImage size={iSize} />,
};

const traverse = (node: ComponentNode, rootIds: string[]) => {
  rootIds.push(node.id);

  if (!node.children?.length) return;

  for (const child of node.children) {
    traverse(child, rootIds);
  }
};

export const initializeDesignStates = (
  nodes: ComponentNode,
  setDesignerState: Dispatch<SetStateAction<DesignerState>>,
) => {
  const rootIds: string[] = [];
  traverse(nodes, rootIds);

  setDesignerState((prev: DesignerState) => ({
    ...prev,
    nodes: { root: nodes },
    rootIds,
    selectedId: prev.selectedId,
    selectedSection: prev.selectedSection,
    insertIndex: prev.insertIndex ?? null,
    hoveredId: prev.hoveredId,
    history: [],
    future: [],
  }));
};

type DesignerTreeProps = {
  component: ComponentNode;
  level?: number;
  isLast?: boolean;
  section: string;
  ancestorHasNext?: boolean[];
  designerState: DesignerState;
  setDesignerState: Dispatch<SetStateAction<DesignerState>>;
  setShowComponentModal: Dispatch<SetStateAction<boolean>>;
};

const NEST_GAP = 8;

export const DesignerTree = ({
  component,
  designerState,
  section,
  setDesignerState,
  setShowComponentModal,
  level = 0,
}: DesignerTreeProps) => {
  const rules = componentRegistry[component.type as Component];
  const canHaveChildren = rules?.canHaveChildren ?? false;
  const visibleChildren =
    component.runtime?.repeat && (component.children?.length ?? 0) > 0
      ? [component.children![0]]
      : (component.children ?? []);
  const hasChildren = visibleChildren.length > 0;
  const [open, setOpen] = useState(hasChildren);

  const icon = typeIcons[component.type as Exclude<Component, "Model">];

  const handleAddChild = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    setDesignerState((prev) => ({
      ...prev,
      selectedId: component.id,
      selectedSection: section as "header" | "template" | "footer" | null,
      insertIndex: null,
    }));

    setShowComponentModal(true);
  };

  useEffect(() => {
    console.log(designerState);
  }, [designerState.hoveredId]);

  return (
    <div style={{ marginLeft: level * NEST_GAP }}>
      <motion.div
        style={{
          position: "relative",
          height: ROW_HEIGHT,
          display: "flex",
          alignItems: "center",
          border: "1px solid transparent",
          borderRadius: 6,
          paddingRight: 12,
          boxSizing: "border-box",
          background: "#fff",
          marginTop: 1,
          marginBottom: 1,
        }}
      >
        <div
          onMouseEnter={() =>
            setDesignerState((prev) => ({ ...prev, hoveredId: component.id }))
          }
          style={{
            height: ROW_HEIGHT,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "0 6px",
            cursor: "pointer",
            userSelect: "none",
            flex: 1,
            minWidth: 0,
          }}
        >
          {canHaveChildren && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setOpen((prev) => !prev);
              }}
              style={{
                width: 14,
                minWidth: 14,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <motion.span
                animate={{ rotate: open ? 0 : -90 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{
                  display: "inline-flex",
                  opacity: hasChildren ? 1 : 0.45,
                }}
              >
                <ChevronDown size={14} />
              </motion.span>
            </span>
          )}

          <span
            style={{
              width: 16,
              minWidth: 16,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </span>

          <span
            onMouseDown={(e) => {
              e.stopPropagation();
              setDesignerState((prev) => ({
                ...prev,
                selectedId: component.id,
                selectedSection: section as "header" | "template" | "footer" | null,
                insertIndex: null,
              }));
            }}
            style={{
              fontSize: 15,
              lineHeight: 1,
              color: "#111827",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              cursor: "pointer",
            }}
          >
            {component.id}
          </span>
        </div>
      </motion.div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key={`${component.id}-content`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.22, ease: "easeInOut" },
              opacity: { duration: 0.16, ease: "easeOut" },
            }}
            style={{
              overflow: "hidden",
            }}
          >
            {hasChildren &&
              visibleChildren.map((child) => (
                <DesignerTree
                  key={child.id}
                  component={child}
                  section={section}
                  designerState={designerState}
                  setDesignerState={setDesignerState}
                  setShowComponentModal={setShowComponentModal}
                  level={level + 1}
                />
              ))}
            {canHaveChildren && (
              <div
                style={{
                  marginLeft: NEST_GAP,
                  marginTop: 1,
                  marginBottom: 1,
                }}
              >
                <button
                  type="button"
                  onClick={handleAddChild}
                  style={{
                    height: 22,
                    padding: "0 8px",
                    borderRadius: 4,
                    border: "1px dashed #0366fc",
                    background: "#fff",
                    fontSize: 12,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    color: "#0366fc",
                    gap: 1,
                  }}
                >
                  <IoIosAddCircleOutline
                    size={16}
                    style={{ color: "#0366fc" }}
                  />
                  Add
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

type ComponentModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  headerNode: ComponentNode;
  templateNode: ComponentNode;
  footerNode: ComponentNode;
  setHeaderNode: Dispatch<SetStateAction<ComponentNode>>;
  setTemplateNode: Dispatch<SetStateAction<ComponentNode>>;
  setFooterNode: Dispatch<SetStateAction<ComponentNode>>;
  designerState: DesignerState;
  setDesignerState: Dispatch<SetStateAction<DesignerState>>;
};

const PREVIEW_WIDTH = 1440;
const PREVIEW_HEIGHT = 810; // 16:9
const PREVIEW_SCALE = 0.48;

export default function ComponentModal({
  open,
  onOpenChange,
  headerNode,
  templateNode,
  footerNode,
  setHeaderNode,
  setTemplateNode,
  setFooterNode,
  designerState,
  setDesignerState,
}: ComponentModalProps) {
  const [selected, setSelected] = useState<string>("");
  const [selectedNode, setSelectedNode] = useState<ComponentNode | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState<string>("");
  const [compMenu] = useState<ComponentList[]>(components);
  const [sortedComponents, setSortedComponents] =
    useState<ComponentList[]>(components);

  const getSectionRoot = (section: "header" | "template" | "footer") => {
    if (section === "header") return headerNode;
    if (section === "template") return templateNode;
    return footerNode;
  };

  const setSectionRoot = (
    section: "header" | "template" | "footer",
    next: ComponentNode,
  ) => {
    if (section === "header") {
      setHeaderNode(next);
      return;
    }
    if (section === "template") {
      setTemplateNode(next);
      return;
    }
    setFooterNode(next);
  };

  const findNodeById = (node: ComponentNode, id: string): ComponentNode | null => {
    if (node.id === id) return node;
    for (const child of node.children ?? []) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
    return null;
  };

  const cloneNodeForInsert = (
    node: ComponentNode,
    parentId: string | null,
    suffix: string,
  ): ComponentNode => {
    const nextId = `${node.id || "node"}_${suffix}`;
    const clonedChildren = (node.children ?? []).map((child, idx) =>
      cloneNodeForInsert(child, nextId, `${suffix}_${idx + 1}`),
    );

    return {
      ...node,
      id: nextId,
      parentId,
      children: clonedChildren,
    };
  };

  const addChildToParent = (
    node: ComponentNode,
    parentId: string,
    childToAdd: ComponentNode,
    prototypeOnly: boolean,
    insertIndex: number | null,
  ): ComponentNode => {
    if (node.id === parentId) {
      const children = node.children ?? [];
      const nextChildren = prototypeOnly
        ? [childToAdd]
        : insertIndex == null || insertIndex < 0 || insertIndex > children.length
          ? [...children, childToAdd]
          : [...children.slice(0, insertIndex), childToAdd, ...children.slice(insertIndex)];
      return {
        ...node,
        children: nextChildren,
      };
    }
    return {
      ...node,
      children: (node.children ?? []).map((child) =>
        addChildToParent(child, parentId, childToAdd, prototypeOnly, insertIndex),
      ),
    };
  };

  const getMaxNodeIndex = (node: ComponentNode): number => {
    let max = 0;
    const walk = (n: ComponentNode) => {
      const m = /^node_(\d+)$/.exec(n.id);
      if (m) max = Math.max(max, Number(m[1]));
      for (const c of n.children ?? []) walk(c);
    };
    walk(node);
    return max;
  };

  const renumberSubtreeDepthFirst = (
    node: ComponentNode,
    state: { count: number },
    parentId: string | null,
  ): ComponentNode => {
    state.count += 1;
    const newId = `node_${state.count}`;
    return {
      ...node,
      id: newId,
      parentId,
      children: (node.children ?? []).map((child) =>
        renumberSubtreeDepthFirst(child, state, newId),
      ),
    };
  };

  const handleInsertComponent = (itemNode: ComponentNode) => {
    const section = designerState.selectedSection;
    const parentId = designerState.selectedId;
    const insertIndex = designerState.insertIndex;
    if (!section || !parentId) return;

    const root = getSectionRoot(section);
    const parentNode = findNodeById(root, parentId);
    if (!parentNode) return;

    const parentRules = componentRegistry[parentNode.type as Component];
    if (!parentRules?.canHaveChildren) return;

    const seed = `${parentId}_new_${(parentNode.children?.length ?? 0) + 1}`;
    const insertedDraft = cloneNodeForInsert(itemNode, parentId, seed);
    const counter = { count: getMaxNodeIndex(root) };
    const insertedNode = renumberSubtreeDepthFirst(insertedDraft, counter, parentId);
    const prototypeOnly = !!parentNode.runtime?.repeat;
    const updated = addChildToParent(
      root,
      parentId,
      insertedNode,
      prototypeOnly,
      prototypeOnly ? null : insertIndex,
    );
    setSectionRoot(section, updated);

    const nextSelectedId = insertedNode.id;
    setDesignerState((prev) => ({
      ...prev,
      selectedId: nextSelectedId,
      selectedSection: section,
      insertIndex: null,
    }));

    onOpenChange(false);
    reset();
  };

  useEffect(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      setSortedComponents(compMenu);
      return;
    }

    const filtered = compMenu
      .map((category) => ({
        ...category,
        list: category.list.filter((item) => {
          return (
            item.label.toLowerCase().includes(query) ||
            item.node.type.toLowerCase().includes(query)
          );
        }),
      }))
      .filter((category) => category.list.length > 0);

    setSortedComponents(filtered);
  }, [search, compMenu]);

  const reset = () => {
    setSearch("");
    setSelected("");
    setSelectedNode(null);
  };

  // const isHero = Boolean(
  //   selectedNode?.layout?.height ||
  //   (typeof selectedNode?.layout?.minHeight?.value === "number" &&
  //     selectedNode.layout.minHeight.value >= 500) ||
  //   isHeroSection(selected),
  // );

  const isHero = isHeroSection(selected);

  const previewHeight = getPreviewHeight(selected, isHero);

  if (!open) return null;

  return (
    <div
      style={{ zIndex: 99999 }}
      className="
        absolute left-0 top-0
        h-[80%] w-[85%]
        min-w-[320px]
        rounded-lg border bg-white p-0 shadow-2xl
        overflow-hidden
      "
    >
      <button
        type="button"
        onClick={() => {
          onOpenChange(false);
          reset();
        }}
        className="absolute right-4 top-4 rounded-sm opacity-70 transition hover:opacity-100"
      >
        ✕
      </button>

      <div className="flex h-full min-h-0 items-stretch">
        {/* Components */}
        <div className="flex h-full min-h-0 w-[25%] flex-col">
          <div className="p-2">
            <div className="relative w-full">
              <Search
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />

              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
                className="
                  w-full pl-8 pr-2 py-1
                  rounded-md border-2 border-black
                  bg-neutral-100 outline-none
                  placeholder-neutral-500
                "
              />
            </div>
          </div>

          <div className="w-full h-[1px] mt-2 bg-gray-200" />

          {/* Scrollable list */}
          <div className="mt-2 flex-1 min-h-0 overflow-y-auto pr-0 custom-scrollbar">
            {sortedComponents.map((category) => {
              const isOpen = expanded[category.label] ?? true;

              return (
                <div key={category.label} className="mb-2">
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded((prev) => ({
                        ...prev,
                        [category.label]: !isOpen,
                      }))
                    }
                    className="flex w-full items-center justify-between rounded-md px-2 py-1"
                  >
                    <span className="font-semibold text-sm text-gray-600">
                      {category.label}
                    </span>

                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={16} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.22,
                          ease: "easeInOut",
                        }}
                        className="overflow-hidden"
                      >
                        <div className="mt-1 space-y-1 pl-2">
                          {category.list.map((item) => {
                            return (
                              <button
                                key={item.label}
                                onMouseEnter={() => {
                                  setSelected(item.label);
                                  setSelectedNode(item.node);
                                }}
                                onClick={() => handleInsertComponent(item.node)}
                                type="button"
                                className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-100"
                              >
                                {item.icon && (
                                  <span className="flex h-5 w-5 items-center justify-center text-sm">
                                    {item.icon}
                                  </span>
                                )}

                                <span>{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="w-full h-[1px] bg-gray-200"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 min-h-0 flex items-center justify-center overflow-auto p-4 bg-gray-200">
          {!selectedNode ? (
            <div className="flex flex-col items-center">
              <p className="text-md font-semibold">No preview available</p>
              <p className="text-sm">select any component</p>
            </div>
          ) : (
            <div
              className="w-full rounded-md max-w-6xl overflow-hidden flex items-center justify-center"
              style={{
                height: previewHeight * PREVIEW_SCALE,
              }}
            >
              <div
                style={{
                  width: PREVIEW_WIDTH * PREVIEW_SCALE,
                  height: previewHeight * PREVIEW_SCALE,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: PREVIEW_WIDTH,
                    height: previewHeight,
                    transform: `scale(${PREVIEW_SCALE})`,
                    transformOrigin: "top left",
                  }}
                >
                  <RenderComponent
                    component={{
                      ...selectedNode,
                      layout: {
                        ...selectedNode.layout,
                        width: { value: 100, unit: "%" },
                        height: {
                          value: previewHeight,
                          unit: "px",
                        },
                        minHeight: undefined,
                      },
                    }}
                    isDesigner={false}
                    isRoot={false}
                    section={selected}
                    setShowComponentModal={() => {}}
                    setDesignerState={() => {}}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
