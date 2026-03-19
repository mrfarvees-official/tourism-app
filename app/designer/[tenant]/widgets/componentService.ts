import { Dispatch, SetStateAction } from "react";
import { ComponentNode, DesignerState } from "./palette/types";

const traverse = (
  node: ComponentNode,
  setDesignerState: Dispatch<SetStateAction<DesignerState>>,
  rootIds: string[],
) => {
  rootIds.push(node.id);

  if (!node.children || node.children.length === 0) return;

  for (const child of node.children) {
    traverse(child, setDesignerState, rootIds);
  }
};

export const initializeDesignStates = (
  nodes: ComponentNode,
  setDesignerState: Dispatch<SetStateAction<DesignerState>>,
) => {
  let rootIds: string[] = [];

  traverse(nodes, setDesignerState, rootIds);

  console.log(rootIds);

  setDesignerState((prev: DesignerState) => {
    return {
      ...prev,
      nodes: { root: nodes },
      rootIds: rootIds,
      selectedId: null,
      hoveredId: null,
      history: [],
      future: [],
    };
  });
};
