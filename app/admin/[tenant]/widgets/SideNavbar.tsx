"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  FaBullhorn,
  FaDatabase,
  FaGear,
  FaHouseChimney,
  FaInbox,
  FaPhotoFilm,
  FaTags,
  FaUser,
  FaMapLocationDot,
  FaHotel,
  FaCar,
  FaCalendarCheck,
  FaStar,
} from "react-icons/fa6";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { MdBarChart, MdSchema } from "react-icons/md";
import { TiThMenu } from "react-icons/ti";

const SIDEBAR_EXPANDED = 200;
const SIDEBAR_COLLAPSED = 60;

export type MenuKey =
  | "home"
  | "inbox"
  | "tours"
  | "customers"
  | "analytics"
  | "media"
  | "discounts"
  | "content"
  | "marketing"
  | "settings"
  | "destinations"
  | "packages"
  | "services"
  | "activities"
  | "accommodations"
  | "transport"
  | "bookings"
  | "inquiries"
  | "reviews";

type Props = {
  currentMenu: MenuKey;
  onChangeMenu: (menu: MenuKey) => void;
  contentSchemas: Array<{
    id: number;
    name?: string;
    menu?: string;
    source_key?: string | null;
    version?: string;
    status?: string;
  }>;
  selectedContentSchemaId: number | null;
  onSelectContentSchema: (schemaId: number | null) => void;
  onOpenContentStudio: () => void;
};

type NavItemProps = {
  active: boolean;
  open: boolean;
  label: string;
  onClick: () => void;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
};

function NavItem({ active, open, label, onClick, Icon }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full h-11",
        "flex items-center",
        "px-3 rounded-md",
        "hover:bg-hover hover:text-hover_text transition-colors",
        active ? "bg-hover text-hover_text" : "",
      ].join(" ")}
    >
      {/* Fixed icon box so nothing shifts */}
      <span className="w-6 h-6 flex items-center justify-center">
        <Icon size={18} className="shrink-0" />
      </span>

      {/* Label keeps layout stable: collapse width + opacity instead of unmounting */}
      <motion.span
        animate={{
          width: open ? "auto" : 0,
          opacity: open ? 1 : 0,
          marginLeft: open ? 12 : 0, // same feel as gap-3
        }}
        transition={{ duration: 0.18 }}
        className={`whitespace-nowrap text-md font-semibold leading-none`}
      >
        {label}
      </motion.span>
    </button>
  );
}

export default function SideNavbar({
  currentMenu,
  onChangeMenu,
  contentSchemas,
  selectedContentSchemaId,
  onSelectContentSchema,
  onOpenContentStudio,
}: Props) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", keyDown);
    return () => window.removeEventListener("keydown", keyDown);
  }, []);

  return (
    <motion.aside
      animate={{ width: open ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="sticky top-0 self-start h-screen bg-menu flex flex-col overflow-hidden border border-l border-border"
      aria-label="Side navigation"
    >
      {/* Header */}
      <div className="h-12 px-3 flex items-center justify-between text-fg shrink-0">
        <motion.strong
          animate={{
            width: open ? "auto" : 0,
            opacity: open ? 1 : 0,
            marginRight: open ? 8 : 0,
          }}
          transition={{ duration: 0.18 }}
          className="overflow-hidden whitespace-nowrap text-sm text-icons block"
        >
          Menu
        </motion.strong>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="p-2 rounded-md hover:bg-hover group"
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          <TiThMenu
            size={20}
            className="group-hover:text-hover_text text-icons"
          />
        </button>
      </div>

      {/* Nav */}
      <nav className="p-2 flex-1 overflow-hidden">
        <ul className="space-y-1  text-icons overflow-hidden">
          <li>
            <NavItem
              active={currentMenu === "home"}
              open={open}
              label="Home"
              onClick={() => onChangeMenu("home")}
              Icon={FaHouseChimney}
            />
          </li>

          <li>
            <NavItem
              active={currentMenu === "inbox"}
              open={open}
              label="Inbox"
              onClick={() => onChangeMenu("inbox")}
              Icon={FaInbox}
            />
          </li>
          <li>
            <NavItem
              active={currentMenu === "packages"}
              open={open}
              label="Packages"
              onClick={() => onChangeMenu("packages")}
              Icon={BiSolidPlaneAlt}
            />
          </li>
          <li>
            <NavItem
              active={currentMenu === "destinations"}
              open={open}
              label="Destinations"
              onClick={() => onChangeMenu("destinations")}
              Icon={FaMapLocationDot}
            />
          </li>
          <li>
            <NavItem
              active={currentMenu === "services"}
              open={open}
              label="Services"
              onClick={() => onChangeMenu("services")}
              Icon={FaTags}
            />
          </li>
          <li>
            <NavItem
              active={currentMenu === "activities"}
              open={open}
              label="Activities"
              onClick={() => onChangeMenu("activities")}
              Icon={FaBullhorn}
            />
          </li>
          <li>
            <NavItem
              active={currentMenu === "accommodations"}
              open={open}
              label="Stays"
              onClick={() => onChangeMenu("accommodations")}
              Icon={FaHotel}
            />
          </li>
          <li>
            <NavItem
              active={currentMenu === "transport"}
              open={open}
              label="Transport"
              onClick={() => onChangeMenu("transport")}
              Icon={FaCar}
            />
          </li>
          <li>
            <NavItem
              active={currentMenu === "bookings"}
              open={open}
              label="Bookings"
              onClick={() => onChangeMenu("bookings")}
              Icon={FaCalendarCheck}
            />
          </li>
          {/* <li>
            <NavItem
              active={currentMenu === "inquiries"}
              open={open}
              label="Inquiries"
              onClick={() => onChangeMenu("inquiries")}
              Icon={FaInbox}
            />
          </li> */}
          <li>
            <NavItem
              active={currentMenu === "customers"}
              open={open}
              label="Customers"
              onClick={() => onChangeMenu("customers")}
              Icon={FaUser}
            />
          </li>
          <li>
            <NavItem
              active={currentMenu === "reviews"}
              open={open}
              label="Reviews"
              onClick={() => onChangeMenu("reviews")}
              Icon={FaStar}
            />
          </li>
          <li>
            <NavItem
              active={currentMenu === "analytics"}
              open={open}
              label="Analytics"
              onClick={() => onChangeMenu("analytics")}
              Icon={MdBarChart}
            />
          </li>
          <li>
            <NavItem
              active={currentMenu === "media"}
              open={open}
              label="Media"
              onClick={() => onChangeMenu("media")}
              Icon={FaPhotoFilm}
            />
          </li>
          <li>
            <NavItem
              active={currentMenu === "settings"}
              open={open}
              label="Settings"
              onClick={() => onChangeMenu("settings")}
              Icon={FaGear}
            />
          </li>
        </ul>
      </nav>
    </motion.aside>
  );
}
