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
  ComponentNode,
  componentRegistry,
  DesignerState,
} from "./palette/types";
import { LuFrame, LuTextCursorInput } from "react-icons/lu";
import { MdTextFields, MdOutlineDataObject } from "react-icons/md";
import { FaLink, FaImage, FaList } from "react-icons/fa";
import { TbCircuitPushbutton } from "react-icons/tb";
import { GoPackage } from "react-icons/go";
import { PiSlidersHorizontalBold } from "react-icons/pi";
import { IoText } from "react-icons/io5";
import { IoIosAddCircleOutline } from "react-icons/io";
import { ChevronDown } from "lucide-react";
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

const iSize = 12;
const ROW_HEIGHT = 24;

export const typeIcons: Record<Exclude<Component, "Model">, ReactNode> = {
  Frame: <LuFrame size={iSize} />,
  Text: <MdTextFields size={iSize} />,
  Link: <FaLink size={iSize} />,
  Image: <FaImage size={iSize} />,
  Button: <TbCircuitPushbutton size={iSize} />,
  List: <FaList size={iSize} />,
  Card: <GoPackage size={iSize} />,
  Slider: <PiSlidersHorizontalBold size={iSize} />,
  Form: <MdOutlineDataObject size={iSize} />,
  Input: <LuTextCursorInput size={iSize} />,
  Label: <IoText size={iSize} />,
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
    selectedId: null,
    hoveredId: null,
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
  const hasChildren = !!component.children?.length;
  const [open, setOpen] = useState(hasChildren);

  const icon = typeIcons[component.type as Exclude<Component, "Model">];

  const handleAddChild = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    setDesignerState((prev) => ({
      ...prev,
      selectedId: component.id,
      selectedSection: section as "header" | "template" | "footer" | null,
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
          onMouseDown={() =>
            setDesignerState((prev) => ({ ...prev, selectedId: component.id }))
          }
          onClick={() => setOpen((prev) => !prev)}
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
              style={{
                width: 14,
                minWidth: 14,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
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
            style={{
              fontSize: 15,
              lineHeight: 1,
              color: "#111827",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
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
              component.children!.map((child) => (
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
  designerState: DesignerState;
  setDesignerState: Dispatch<SetStateAction<DesignerState>>;
};

export default function ComponentModal({
  open,
  onOpenChange,
  designerState,
}: ComponentModalProps) {
  if (!open) return null;

  return (
    <div
      style={{
        zIndex: 99999
      }}
      className="
        absolute left-0 top-0
        h-[80%] w-[60%]
        min-w-[320px]
        rounded-tr-lg border bg-white p-6 shadow-2xl
      "
    >
      <button
        type="button"
        onClick={() => onOpenChange(false)}
        className="absolute right-4 top-4 rounded-sm opacity-70 transition hover:opacity-100"
      >
        ✕
      </button>

      <div className="flex flex-col space-y-2 text-left">
        <h2 className="text-lg font-semibold leading-none tracking-tight">
          {designerState.selectedSection} ({designerState.selectedId})
        </h2>
        <p className="text-sm text-gray-500">Description</p>
      </div>

      <div className="py-4">
        <p>Something</p>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          Save
        </button>
      </div>
    </div>
  );
}