"use client";

import { ChevronRight, ChevronLeft, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import { ComponentNode, DesignerState } from "./palette/types";
import { DesignerTree } from "./componentService";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
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

export default function SideNav({
  open,
  setOpen,
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

  return (
    <motion.aside
      initial={false}
      animate={{ width: open ? 288 : 56 }}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      className="h-screen bg-[#fff] shadow-xl border-r border-border overflow-hidden shrink-0"
    >
      <div className="h-full p-2 overflow-y-auto">
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

        {open && (
          <div className="space-y-3">
            <div className="border border-border rounded-md">
              <button
                type="button"
                onClick={() => setHeaderOpen((prev) => !prev)}
                className="w-full px-3 py-2 flex items-center justify-between text-left"
              >
                <span className="text-sm font-semibold">Header</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    headerOpen ? "rotate-0" : "-rotate-90"
                  }`}
                />
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
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    templateOpen ? "rotate-0" : "-rotate-90"
                  }`}
                />
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
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    footerOpen ? "rotate-0" : "-rotate-90"
                  }`}
                />
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
    </motion.aside>
  );
}