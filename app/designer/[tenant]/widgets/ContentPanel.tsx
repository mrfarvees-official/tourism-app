"use client";

import { Dispatch, SetStateAction } from "react";
import { ComponentNode, DesignerState } from "./palette/types";
import RenderComponent from "./palette/RenderComponent";

export default function ContentPanel({
  headerNode,
  templateNode,
  footerNode,
  setHeaderNode,
  setTemplateNode,
  setFooterNode,
  setDesignerState,
  setShowComponentModal,
}: {
  headerNode: ComponentNode;
  templateNode: ComponentNode;
  footerNode: ComponentNode;
  setHeaderNode: Dispatch<SetStateAction<ComponentNode>>;
  setTemplateNode: Dispatch<SetStateAction<ComponentNode>>;
  setFooterNode: Dispatch<SetStateAction<ComponentNode>>;
  setDesignerState: Dispatch<SetStateAction<DesignerState>>;
  setShowComponentModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="min-h-screen min-w-0 border border-border">
      <RenderComponent
        component={headerNode}
        isDesigner={true}
        isRoot={true}
        section="header"
        setDesignerState={setDesignerState}
        setShowComponentModal={setShowComponentModal}
      />

      <RenderComponent
        component={templateNode}
        isDesigner={true}
        isRoot={true}
        section="template"
        setDesignerState={setDesignerState}
        setShowComponentModal={setShowComponentModal}
      />

      <RenderComponent
        component={footerNode}
        isDesigner={true}
        isRoot={true}
        section="footer"
        setDesignerState={setDesignerState}
        setShowComponentModal={setShowComponentModal}
      />
    </div>
  );
}