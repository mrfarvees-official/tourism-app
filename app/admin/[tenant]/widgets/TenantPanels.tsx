import React from "react";
import { MenuKey } from "./SideNavbar";
import { AnimatePresence, motion } from "framer-motion";
import HomePanel from "./Panels/Home";
import InboxPanel from "./Panels/Inbox";
import ToursPanel from "./Panels/Tours";
import CustomersPanel from "./Panels/Customers";
import AnalyticsPanel from "./Panels/Analytics";
import ContentStudioPanel from "./Panels/ContentStudio";
import ContentRecordsPanel from "./Panels/ContentRecords";
import MediaPanel from "./Panels/Media";
import SettingsPanel from "./Panels/Settings";
import type { DashboardData } from "@/src/api/hooks/admin/useDashboard";

export default function TenantPanels({
  currentMenu,
  tenant,
  dashboard,
  dashboardLoading,
  selectedStudioSchemaId,
  onSelectStudioSchema,
  selectedContentSchemaId,
  onOpenContentStudio,
  onJumpToMenu,
}: {
  currentMenu: MenuKey;
  tenant: string;
  dashboard: DashboardData | null;
  dashboardLoading: boolean;
  selectedStudioSchemaId: number | null;
  onSelectStudioSchema: (schemaId: number | null) => void;
  selectedContentSchemaId: number | null;
  onOpenContentStudio: () => void;
  onJumpToMenu: (menu: MenuKey) => void;
}) {
  return (
    <div className="flex-1 min-w-0 bg-bg">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMenu}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.18 }}
        >
          {currentMenu === "home" && (
            <HomePanel
              tenant={tenant}
              dashboard={dashboard}
              loading={dashboardLoading}
              onOpenContentStudio={onOpenContentStudio}
              onJumpToMenu={onJumpToMenu}
            />
          )}
          {currentMenu === "inbox" && (
            <InboxPanel tenant={tenant} dashboard={dashboard} />
          )}
          {currentMenu === "tours" && (
            <ToursPanel tenant={tenant} dashboard={dashboard} />
          )}
          {currentMenu === "customers" && (
            <CustomersPanel tenant={tenant} dashboard={dashboard} />
          )}
          {currentMenu === "analytics" && (
            <AnalyticsPanel tenant={tenant} dashboard={dashboard} />
          )}
          {currentMenu === "content" && (
            selectedContentSchemaId === null ? (
              <ContentStudioPanel
                tenant={tenant}
                selectedStudioSchemaId={selectedStudioSchemaId}
                onSelectStudioSchema={onSelectStudioSchema}
              />
            ) : (
              <ContentRecordsPanel
                tenant={tenant}
                selectedStudioSchemaId={selectedStudioSchemaId}
                onSelectStudioSchema={onSelectStudioSchema}
                selectedContentSchemaId={selectedContentSchemaId}
              />
            )
          )}
          {currentMenu === "media" && <MediaPanel tenant={tenant} />}
          {currentMenu === "settings" && <SettingsPanel tenant={tenant} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
