"use client";

import React, { useState } from "react";
import SideNavbar, { MenuKey } from "./SideNavbar";
import TenantPanels from "./TenantPanels";
import { useQueryState } from "@/src/utils/useParam";

const MENU_DEFAULT: MenuKey = "home";
const MENU_PARAM = "menu";

const isMenuKey = (v: string): v is MenuKey =>
  [
    "home",
    "inbox",
    "tours",
    "customers",
    "analytics",
    "discounts",
    "content",
    "marketing",
    "settings",
  ].includes(v);

export default function MainPanel() {
  const [currentMenu, onChangeMenu] = useQueryState<MenuKey>(MENU_PARAM, {
    defaultValue: MENU_DEFAULT,
    parse: (raw) => {
      if (!raw) return MENU_DEFAULT;
      return isMenuKey(raw) ? raw : MENU_DEFAULT;
    },
    serialize: (v) => (v === MENU_DEFAULT ? null : v), // remove from URL if default
  });

  return (
    <div className="w-full flex">
      <SideNavbar currentMenu={currentMenu} onChangeMenu={onChangeMenu} />
      
      {/* only content scrolls */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        <TenantPanels currentMenu={currentMenu} />
      </div>
    </div>
  );
}
