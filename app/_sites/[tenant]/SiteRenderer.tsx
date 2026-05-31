"use client";

import { useState } from "react";
import RenderComponent from "@/app/designer/[tenant]/widgets/palette/RenderComponent";
import { sitePage } from "@/app/designer/[tenant]/widgets/palette/data";
import { DesignerState } from "@/app/designer/[tenant]/widgets/palette/types";

const initialDesignerState: DesignerState = {
  header: { nodes: {}, rootIds: [] },
  template: { nodes: {}, rootIds: [] },
  footer: { nodes: {}, rootIds: [] },
  selectedSection: null,
  selectedId: null,
  hoveredSection: null,
  hoveredId: null,
  history: [],
  future: [],
};

export default function SiteRenderer() {
  const [, setDesignerState] = useState<DesignerState>(initialDesignerState);

  return (
    <main className="w-full min-h-screen">
      <RenderComponent
        component={sitePage.header}
        isDesigner={false}
        isRoot={true}
        section="header"
        setShowComponentModal={() => {}}
        setDesignerState={setDesignerState}
      />
      <RenderComponent
        component={sitePage.template}
        isDesigner={false}
        isRoot={true}
        section="template"
        setShowComponentModal={() => {}}
        setDesignerState={setDesignerState}
      />
      <RenderComponent
        component={sitePage.footer}
        isDesigner={false}
        isRoot={true}
        section="footer"
        setShowComponentModal={() => {}}
        setDesignerState={setDesignerState}
      />
    </main>
  );
}
