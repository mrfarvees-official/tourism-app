"use client";

import dynamic from "next/dynamic";

const SiteRenderer = dynamic(() => import("./SiteRenderer"), { ssr: false });

export default function SitePageClient() {
  return <SiteRenderer />;
}
