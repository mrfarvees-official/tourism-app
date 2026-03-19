"use client";

import { useEffect, useState } from "react";
import ContentPanel from "./ContentPanel";
import SideNav from "./SideNav";
import { ComponentNode, DesignerState } from "./palette/types";
import { componentTree } from "./palette/data";
import { initializeDesignStates } from "./componentService";

export default function MainPanel() {
  const [open, setOpen] = useState(true);
  const [nodes, setNodes] =
    useState<Record<string, ComponentNode>>(componentTree);
  const [designerState, setDesignerState] = useState<DesignerState>({
    nodes: {},
    rootIds: [],
    selectedId: null,
    hoveredId: null,
    history: [],
    future: [],
  });

  useEffect(() => {
    initializeDesignStates(nodes.root, setDesignerState);
  }, []);

  // TODO: remove this debugger log later on.
  useEffect(() => { console.log(designerState)}, [designerState]);

  return (
    <div className="w-full min-h-screen bg-bg flex">
      <SideNav
        open={open}
        setOpen={setOpen}
        nodes={nodes}
        setNodes={setNodes}
        designerState={designerState}
        setDesignerState={setDesignerState}
      />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <ContentPanel
          nodes={nodes}
          setNodes={setNodes}
          setDesignerState={setDesignerState}
        />
      </div>
    </div>
  );
}
