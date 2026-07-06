"use client";

import { Dispatch, SetStateAction } from "react";
import { ComponentNode, DesignerState } from "./palette/types";
import RenderComponent from "./palette/RenderComponent";

export default function ContentPanel({
  headerNode,
  templateNode,
  footerNode,
  setDesignerState,
  setShowComponentModal,
}: {
  headerNode: ComponentNode;
  templateNode: ComponentNode;
  footerNode: ComponentNode;
  setDesignerState: Dispatch<SetStateAction<DesignerState>>;
  setShowComponentModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="min-h-screen min-w-max border border-border bg-white">
      <div className="min-w-max">
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
    </div>
  );
}
