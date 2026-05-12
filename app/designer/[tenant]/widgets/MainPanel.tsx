"use client";

import { useEffect, useState } from "react";
import ContentPanel from "./ContentPanel";
import SideNav from "./SideNav";
import { ComponentNode, DesignerState } from "./palette/types";
import { header, template, footer } from "./palette/data";
import { initializeDesignStates } from "./componentService";
import ComponentModal from "./componentService";

export default function MainPanel() {
  const [open, setOpen] = useState(true);

  const [headerNode, setHeaderNode] = useState<ComponentNode>(header);
  const [templateNode, setTemplateNode] = useState<ComponentNode>(template);
  const [footerNode, setFooterNode] = useState<ComponentNode>(footer);

  const [designerState, setDesignerState] = useState<DesignerState>({
  header: {
    nodes: {},
    rootIds: [],
  },
  template: {
    nodes: {},
    rootIds: [],
  },
  footer: {
    nodes: {},
    rootIds: [],
  },
  selectedSection: null,
  selectedId: null,
  hoveredSection: null,
  hoveredId: null,
  history: [],
  future: [],
});

  const [showComponentModel, setShowComponentModal] = useState(true);

  useEffect(() => {
    initializeDesignStates(templateNode, setDesignerState);
  }, [templateNode]);

  useEffect(() => {
    console.log(designerState);
  }, [designerState]);

  return (
    <div className="w-full h-screen bg-bg flex">
      <SideNav
        open={open}
        setOpen={setOpen}
        headerNode={headerNode}
        setHeaderNode={setHeaderNode}
        templateNode={templateNode}
        setTemplateNode={setTemplateNode}
        footerNode={footerNode}
        setFooterNode={setFooterNode}
        designerState={designerState}
        setDesignerState={setDesignerState}
        setShowComponentModal={setShowComponentModal}
      />

      <div className="relative flex-1 min-w-0 h-full overflow-hidden">
        <div className="h-full overflow-y-auto">
          <ContentPanel
            headerNode={headerNode}
            templateNode={templateNode}
            footerNode={footerNode}
            setHeaderNode={setHeaderNode}
            setTemplateNode={setTemplateNode}
            setFooterNode={setFooterNode}
            setDesignerState={setDesignerState}
            setShowComponentModal={setShowComponentModal}
          />
        </div>

        <ComponentModal
          open={showComponentModel}
          onOpenChange={setShowComponentModal}
          designerState={designerState}
          setDesignerState={setDesignerState}
        />
      </div>
    </div>
  );
}
