import React from "react";
import { MenuKey } from "./SideNavbar";
import { AnimatePresence, motion } from "framer-motion";
import HomePanel from "./Panels/Home";
import InboxPanel from "./Panels/Inbox";
import CustomersPanel from "./Panels/Customers";
import AnalyticsPanel from "./Panels/Analytics";
import ContentStudioPanel from "./Panels/ContentStudio";
import ContentRecordsPanel from "./Panels/ContentRecords";
import MediaPanel from "./Panels/Media";
import SettingsPanel from "./Panels/Settings";
import BusinessModulePanel from "./Panels/BusinessModulePanel";
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
            <InboxPanel tenant={tenant} />
          )}
          {currentMenu === "customers" && (
            <CustomersPanel tenant={tenant} />
          )}
          {currentMenu === "analytics" && (
            <AnalyticsPanel tenant={tenant} />
          )}
          {currentMenu === "content" &&
            (selectedContentSchemaId === null ? (
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
            ))}
          {currentMenu === "media" && <MediaPanel tenant={tenant} />}
          {currentMenu === "settings" && <SettingsPanel tenant={tenant} />}
          {currentMenu === "destinations" && (
            <BusinessModulePanel
              tenant={tenant}
              moduleKey="destinations"
              title="Destinations"
              description="Manage tenant destinations, location content, status, and featured inventory."
            />
          )}
          {currentMenu === "packages" && (
            <BusinessModulePanel
              tenant={tenant}
              moduleKey="packages"
              title="Packages"
              description="Manage tour packages, prices, descriptions, and publishing status."
            />
          )}
          {currentMenu === "services" && (
            <BusinessModulePanel
              tenant={tenant}
              moduleKey="services"
              title="Services"
              description="Manage bookable tourism services and add-ons."
            />
          )}
          {currentMenu === "activities" && (
            <BusinessModulePanel
              tenant={tenant}
              moduleKey="activities"
              title="Activities"
              description="Manage local experiences and activities."
            />
          )}
          {currentMenu === "accommodations" && (
            <BusinessModulePanel
              tenant={tenant}
              moduleKey="accommodations"
              title="Stays"
              description="Manage accommodations connected to tours and bookings."
            />
          )}
          {currentMenu === "transport" && (
            <BusinessModulePanel
              tenant={tenant}
              moduleKey="transport"
              title="Transport"
              description="Manage transport options, capacity, and pricing."
            />
          )}
          {currentMenu === "bookings" && (
            <BusinessModulePanel
              tenant={tenant}
              moduleKey="bookings"
              title="Bookings"
              description="Review booking requests, statuses, payments, travelers, and add-ons."
            />
          )}
          {currentMenu === "inquiries" && (
            <BusinessModulePanel
              tenant={tenant}
              moduleKey="inquiries"
              title="Inquiries"
              description="Triage customer inquiries and prepare booking conversions."
            />
          )}
          {currentMenu === "reviews" && (
            <BusinessModulePanel
              tenant={tenant}
              moduleKey="reviews"
              title="Reviews"
              description="Moderate customer reviews and published feedback."
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
