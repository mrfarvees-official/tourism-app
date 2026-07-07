"use client";

import React from "react";
import SideNavbar, { MenuKey } from "./SideNavbar";
import TenantPanels from "./TenantPanels";
import { useQueryState } from "@/src/utils/useParam";
import { useSchema } from "@/src/api/hooks/content/useSchema";
import { useTenantDashboard } from "@/src/api/hooks/admin/useDashboard";

const MENU_DEFAULT: MenuKey = "home";
const MENU_PARAM = "menu";

const isMenuKey = (v: string): v is MenuKey =>
  [
    "home",
    "inbox",
    "tours",
    "customers",
    "analytics",
    "media",
    "discounts",
    "content",
    "marketing",
    "settings",
    "destinations",
    "packages",
    "services",
    "activities",
    "accommodations",
    "transport",
    "bookings",
    "inquiries",
    "reviews",
  ].includes(v);

export default function MainPanel({ tenant }: { tenant: string }) {
  const [currentMenu, onChangeMenu] = useQueryState<MenuKey>(MENU_PARAM, {
    defaultValue: MENU_DEFAULT,
    parse: (raw) => {
      if (!raw) return MENU_DEFAULT;
      return isMenuKey(raw) ? raw : MENU_DEFAULT;
    },
    serialize: (v) => (v === MENU_DEFAULT ? null : v), // remove from URL if default
  });
  const [selectedContentSchemaId, setSelectedContentSchemaId] = React.useState<number | null>(null);
  const [selectedStudioSchemaId, setSelectedStudioSchemaId] = React.useState<number | null>(null);
  const { schemas, handleGetAllSchema } = useSchema();
  const { dashboard, loading: dashboardLoading } = useTenantDashboard(tenant);

  const contentSchemas = React.useMemo(() => {
    const rows = Array.isArray(schemas)
      ? (schemas as Array<{
          id: number;
          name?: string;
          menu?: string;
          source_key?: string | null;
          version?: string;
          status?: string;
        }>)
      : [];
    return rows;
  }, [schemas]);

  React.useEffect(() => {
    if (!tenant) return;
    void handleGetAllSchema(tenant);
  }, [handleGetAllSchema, tenant]);

  React.useEffect(() => {
    if (contentSchemas.length === 0) {
      if (selectedStudioSchemaId !== null) {
        setSelectedStudioSchemaId(null);
      }
      return;
    }

    if (selectedStudioSchemaId !== null && contentSchemas.some((schema) => schema.id === selectedStudioSchemaId)) {
      return;
    }

    setSelectedStudioSchemaId(null);
  }, [contentSchemas, selectedStudioSchemaId, setSelectedStudioSchemaId]);

  return (
    <div className="w-full flex">
      <SideNavbar
        currentMenu={currentMenu}
        onChangeMenu={onChangeMenu}
        contentSchemas={contentSchemas}
        selectedContentSchemaId={selectedContentSchemaId}
        onSelectContentSchema={setSelectedContentSchemaId}
        onOpenContentStudio={() => setSelectedContentSchemaId(null)}
      />
      
      {/* only content scrolls */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        <TenantPanels
          currentMenu={currentMenu}
          tenant={tenant}
          dashboard={dashboard}
          dashboardLoading={dashboardLoading}
          selectedStudioSchemaId={selectedStudioSchemaId}
          onSelectStudioSchema={setSelectedStudioSchemaId}
          selectedContentSchemaId={selectedContentSchemaId}
          onOpenContentStudio={() => setSelectedContentSchemaId(null)}
          onJumpToMenu={onChangeMenu}
        />
      </div>
    </div>
  );
}
