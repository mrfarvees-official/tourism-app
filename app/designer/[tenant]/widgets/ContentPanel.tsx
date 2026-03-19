"use client";

import { Dispatch, SetStateAction } from "react";
import { ComponentNode, DesignerState } from "./palette/types";
import RenderComponent from "./palette/RenderComponent";

export default function ContentPanel({
  nodes,
  setNodes,
  setDesignerState
}: {
  nodes: Record<string, ComponentNode>;
  setNodes: Dispatch<SetStateAction<Record<string, ComponentNode>>>;
  setDesignerState: Dispatch<SetStateAction<DesignerState>>;
}) {
  return (
  <div className="min-h-screen min-w-0 border border-border">
    <RenderComponent component={nodes.root} isDesigner={true} isRoot={true} />
  </div>
);
}
