"use client";

import dynamic from "next/dynamic";
import { ComponentNode } from "@/app/designer/[tenant]/widgets/palette/types";

const SiteRenderer = dynamic(() => import("./SiteRenderer"), { ssr: false });

type PageSchema = {
  header?: ComponentNode;
  template?: ComponentNode;
  footer?: ComponentNode;
};

type Props = {
  tenant: string;
  path: string;
  schema: PageSchema | null;
};

export default function SitePageClient({ tenant, path, schema }: Props) {
  return <SiteRenderer tenant={tenant} path={path} schema={schema} />;
}
