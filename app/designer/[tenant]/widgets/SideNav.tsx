"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";
import { ComponentNode, DesignerState } from "./palette/types";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  nodes: Record<string, ComponentNode>;
  setNodes: Dispatch<SetStateAction<Record<string, ComponentNode>>>;
  designerState: DesignerState;
  setDesignerState: Dispatch<SetStateAction<DesignerState>>;
};

export default function SideNav({ open, setOpen, nodes, setNodes }: Props) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: open ? 288 : 56 }}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      className="h-screen bg-bg shadow-xl border-r border-border overflow-hidden shrink-0"
    >
      <div className="h-full p-2">
        <div
          className={`flex items-center mb-6 ${
            open ? "justify-between" : "justify-center"
          }`}
        >
          {open && (
            <h2 className="text-md font-semibold whitespace-nowrap">
              Layout Frame
            </h2>
          )}

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="shrink-0 flex items-center justify-center w-8 h-8"
          >
            {open ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
