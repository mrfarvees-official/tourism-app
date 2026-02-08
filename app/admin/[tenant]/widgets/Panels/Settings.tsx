import React, { useState } from "react";
import General from "./Settings/General";
import { MdOutlineSettings } from "react-icons/md";
import { useQueryState } from "@/src/utils/useParam";
import LoggedDevices from "./DeviceManagement/LoggedDevices";

export type SettingKey =
  | "General"
  | "Ownership"
  | "Organization Profile"
  | "SSO"
  | "2FA"
  | "Device Management"
  | "Notifications"
  | "Audit & Logs"
  | "White-Label"
  | "Advanced";

const settings = [
  "General",
  "Ownership",
  "Organization Profile",
  "SSO",
  "2FA",
  "Device Management",
  "Notifications",
  "Audit & Logs",
  "White-Label",
  "Advanced",
] as const;

const SettingItem = ({
  setting,
  current,
  setSetting,
}: {
  setting: SettingKey;
  current: SettingKey;
  setSetting: React.Dispatch<React.SetStateAction<SettingKey>>;
}) => {
  return (
    <button
      onClick={() => setSetting(setting)}
      className={`text-nowrap px-4 py-2 text-fg ${current === setting ? "border-b-[4px] font-semibold border-accent" : ""}`}
    >
      {setting}
    </button>
  );
};

export default function SettingsPanel() {
  const DEFAULT_SETTING: SettingKey = "General";

  const isSettingKey = (v: string): v is SettingKey =>
    (settings as readonly string[]).includes(v);

  const [setting, setSetting] = useQueryState<SettingKey>("setting", {
    defaultValue: DEFAULT_SETTING,
    parse: (raw) => (raw && isSettingKey(raw) ? raw : DEFAULT_SETTING),
    serialize: (v) => (v === DEFAULT_SETTING ? null : v),
  });

  return (
    <div className="w-full h-full p-5 bg-content flex flex-col">
      <div className="flex">
        <span className="text-2xl font-bold text-title">Settings</span>
      </div>
      {/** TODO: Search Setting later */}
      <div></div>

      <div className="w-full flex-grow overflow-hidden">
        {/* Navigation Panel */}
        <nav className="mt-1 overflow-x-auto whitespace-nowrap">
          <ul className="w-full inline-flex items-center justify-evenly border-b border-accent">
            {settings.map((key) => (
              <li key={key}>
                <SettingItem
                  setting={key}
                  setSetting={setSetting}
                  current={setting}
                />
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content Section with Scroll */}
        <div className="flex-grow overflow-auto"> {/* Makes this section scrollable */}
          {setting === "General" && <General />}
          {setting === "Ownership" && <></>}
          {setting === "Organization Profile" && <></>}
          {setting === "SSO" && <></>}
          {setting === "2FA" && <></>}
          {setting === "Device Management" && <LoggedDevices />}
          {setting === "Notifications" && <></>}
          {setting === "Audit & Logs" && <></>}
          {setting === "White-Label" && <></>}
          {setting === "Advanced" && <></>}
        </div>
      </div>
    </div>
  );
}
