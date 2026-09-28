"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/src/shared/common/Navbar";
import { isTenantSiteLocation } from "@/src/utils/tenantRouting";

export function RootNavbar() {
  const pathname = usePathname();
  const routeSegments = pathname.split("/").filter(Boolean);
  const isTenantSiteRoute = isTenantSiteLocation(routeSegments);

  if (isTenantSiteRoute) return null;

  return <Navbar />;
}
