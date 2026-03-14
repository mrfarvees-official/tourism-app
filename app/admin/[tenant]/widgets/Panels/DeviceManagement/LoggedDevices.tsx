"use client";

import React from "react";
import { useDevice } from "@/src/api/hooks/settings/useDevice";
import {
  FaDesktop,
  FaLaptop,
  FaTabletScreenButton,
  FaMobileScreen,
  FaBrave,
} from "react-icons/fa6";
import {
  BsBrowserFirefox,
  BsBrowserEdge,
  BsBrowserSafari,
  BsBrowserChrome,
} from "react-icons/bs";
import { FaOpera, FaWindows, FaLinux, FaApple } from "react-icons/fa";
import { SiTorbrowser } from "react-icons/si";
import { DiAndroid } from "react-icons/di";
import { formatLastSeen } from "@/src/utils/time";

type DeviceSession = {
  id: string;
  device_name?: string | null;
  device_type?: string | null;
  os?: string | null;
  browser?: string | null;
  ip_last?: string | null;
  last_seen_at?: string | null;
  created_at?: string | null;
  expires_at?: string | null;
  is_current?: boolean;
};

export default function LoggedDevices() {
  const {
    loading,
    actionLoading,
    errors,
    sessions,
    clearState,
    logoutDevice,
    logoutOtherDevices,
  } = useDevice();

  const hasErrors =
    !!errors && (Array.isArray(errors) ? errors.length > 0 : true);

  const handleLogoutOne = async (sessionId: string) => {
    await logoutDevice(sessionId);
  };

  const handleLogoutOthers = async () => {
    await logoutOtherDevices();
  };

  return (
    <div className="w-full min-h-screen">
      <div className="flex items-start justify-between gap-4">
        <div className="mt-4">
          <h1 className="text-xl font-semibold text-title">Activity</h1>
          <p className="text-sm text-title/70">
            Your account is currently logged in on these devices. Remove/Logout
            any unauthorized devices.
          </p>

          {hasErrors && (
            <div className="mt-3 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
              <div className="flex items-center justify-between gap-3">
                <span>
                  {Array.isArray(errors)
                    ? errors.join(", ")
                    : "Something went wrong."}
                </span>
                <button
                  className="underline"
                  onClick={() => clearState?.()}
                  type="button"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4">
          <button
            className="bg-accent text-hover_text px-3 py-2 rounded-xl disabled:opacity-60 text-nowrap"
            type="button"
            disabled={
              loading || sessions.length <= 1 || !!actionLoading.logoutOthers
            }
            onClick={handleLogoutOthers}
          >
            {actionLoading.logoutOthers
              ? "Logging out…"
              : "Logout other devices"}
          </button>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="text-sm text-title/70">Loading devices…</div>
        ) : sessions.length === 0 ? (
          <div className="text-sm text-title/70">No other devices found!</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
            {sessions.map((s: DeviceSession) => (
              <div
                key={s.id}
                className="rounded-2xl border border-border p-4 flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-title truncate">
                      {s.device_name ||
                        `${s.browser ?? "Browser"} on ${s.os ?? "Unknown OS"}`}
                    </div>

                    {s.is_current && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-info text-hover_text">
                        This device
                      </span>
                    )}
                  </div>

                  <div className="mt-1 text-sm text-title/70 flex items-center space-x-2">
                    <span>
                      {s.device_type === "desktop" ? (
                        <FaDesktop size={20} />
                      ) : s.device_type === "laptop" ? (
                        <FaLaptop size={20} />
                      ) : s.device_type === "tablet" ? (
                        <FaTabletScreenButton size={20} />
                      ) : s.device_type === "mobile" ? (
                        <FaMobileScreen size={20} />
                      ) : null}
                    </span>
                    <span>•</span>
                    <span>
                      {s.browser === "Chrome" ? (
                        <BsBrowserChrome size={20} />
                      ) : s.browser === "Edge" ? (
                        <BsBrowserEdge size={20} />
                      ) : s.browser === "FireFox" ? (
                        <BsBrowserFirefox size={20} />
                      ) : s.browser === "Opera" ? (
                        <FaOpera size={20} />
                      ) : s.browser === "Brave" ? (
                        <FaBrave size={20} />
                      ) : s.browser === "Tor" ? (
                        <SiTorbrowser size={20} />
                      ) : s.browser === "Safari" ? (
                        <BsBrowserSafari size={20} />
                      ) : null}
                    </span>
                    <span>•</span>
                    <span>
                      {s.os === "Windows" ? (
                        <FaWindows size={20} />
                      ) : s.os === "Linux" ? (
                        <FaLinux size={20} />
                      ) : s.os === "AndroidOS" ? (
                        <DiAndroid size={20} />
                      ) : s.os === "Mac" ? (
                        <FaApple size={20} />
                      ) : s.os === "IOS" ? (
                        <FaApple />
                      ) : null}
                    </span>
                  </div>

                  <div className="mt-1 text-xs font-semibold text-title space-x-2">
                    {s.ip_last && (
                      <span>
                        IP: <span className="text-info">{s.ip_last}</span>
                      </span>
                    )}
                    {s.last_seen_at && (
                      <span>
                        Last active:{" "}
                        <span className="text-info">
                          {formatLastSeen(s.last_seen_at)}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  <button
                    className="px-3 py-2 rounded-xl border border-accent/30 text-accent hover:bg-danger/10 disabled:opacity-60"
                    type="button"
                    disabled={
                      loading ||
                      !!s.is_current ||
                      actionLoading.logoutOne === s.id
                    }
                    onClick={() => handleLogoutOne(s.id)}
                  >
                    {actionLoading.logoutOne === s.id
                      ? "Logging out…"
                      : "Logout"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
