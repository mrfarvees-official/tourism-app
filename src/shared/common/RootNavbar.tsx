"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { Navbar } from "@/src/shared/common/Navbar";

export function RootNavbar() {
  const segments = useSelectedLayoutSegments();
  const firstSegment = segments[0];
  const isTenantSiteRoute =
    firstSegment === "_sites" || firstSegment === "%5Fsites";

  if (isTenantSiteRoute) return null;

  return <Navbar />;
}
