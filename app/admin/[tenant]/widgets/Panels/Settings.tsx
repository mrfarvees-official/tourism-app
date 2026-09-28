"use client";

import React, { useState } from "react";
import { FaBolt, FaCircleInfo, FaClockRotateLeft, FaPalette, FaShieldHalved, FaUsers } from "react-icons/fa6";
import { useContactSettings } from "@/src/api/hooks/settings/useContactSettings";
import { useDevice } from "@/src/api/hooks/settings/useDevice";
import { useOrganization } from "@/src/api/hooks/settings/useOrganization";
import { useTheme } from "@/src/api/hooks/settings/useTheme";
import { getTheme, updateTheme } from "@/src/api/routes/settings/theme";
import { updateOrganizationProfile } from "@/src/api/routes/settings/organization";
import { useAppDispatch } from "@/src/shared/redux/store/hooks";
import { fetchTenantBootstrap } from "@/src/shared/redux/store/tenantBootstrapSlice";
import { applyTenantTheme } from "@/src/utils/runtimeConfig";
import { formatDateLong } from "./panelUtils";

type Props = {
  tenant: string;
};

type ThemePalette = Record<string, string>;
type ThemeMode = "light" | "dark";

type ThemeEditorState = {
  light: ThemePalette;
  dark: ThemePalette;
  hasDark: boolean;
};

const themeColorFields = [
  ["bg", "Background"],
  ["fg", "Foreground"],
  ["primary", "Primary"],
  ["secondary", "Secondary"],
  ["menu", "Menu"],
  ["content", "Content"],
  ["border", "Border"],
  ["muted", "Muted"],
  ["hover", "Hover"],
  ["hover_text", "Hover text"],
  ["accent", "Accent"],
  ["icons", "Icons"],
  ["info", "Info"],
  ["success", "Success"],
  ["warn", "Warning"],
  ["danger", "Danger"],
  ["toast", "Toast"],
] as const;

const defaultThemePalette: ThemePalette = {
  bg: "#f8fafc",
  fg: "#0f172a",
  primary: "#0f766e",
  secondary: "#475569",
  menu: "#ffffff",
  content: "#ffffff",
  border: "#e2e8f0",
  muted: "#64748b",
  hover: "#f1f5f9",
  hover_text: "#0f172a",
  accent: "#f59e0b",
  icons: "#475569",
  info: "#2563eb",
  success: "#16a34a",
  warn: "#d97706",
  danger: "#dc2626",
  toast: "#0f172a",
  radius: "16px",
};

function asThemePalette(value: unknown): ThemePalette {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.entries(value).reduce<ThemePalette>((result, [key, item]) => {
    if (typeof item === "string") result[key] = item;
    return result;
  }, {});
}

function parseThemeEditor(value: unknown): ThemeEditorState {
  let parsed = value;

  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      parsed = null;
    }
  }

  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    const record = parsed as Record<string, unknown>;
    const light = asThemePalette(record.light);
    const dark = asThemePalette(record.dark);

    if (Object.keys(light).length || Object.keys(dark).length) {
      return {
        light: { ...defaultThemePalette, ...light },
        dark: { ...defaultThemePalette, ...dark },
        hasDark: Object.keys(dark).length > 0,
      };
    }

    const single = asThemePalette(parsed);
    if (Object.keys(single).length) {
      return {
        light: { ...defaultThemePalette, ...single },
        dark: { ...defaultThemePalette, ...single },
        hasDark: false,
      };
    }
  }

  return {
    light: { ...defaultThemePalette },
    dark: { ...defaultThemePalette },
    hasDark: false,
  };
}

function isColorValue(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value);
}

function Metric({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="bg-menu px-5 py-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">{title}</p>
          <p className="mt-2 text-lg font-semibold text-fg">{value}</p>
        </div>
        <Icon className="text-muted" />
      </div>
    </div>
  );
}

export default function SettingsPanel({ tenant }: Props) {
  const dispatch = useAppDispatch();
  const { details } = useOrganization(tenant);
  const { currentTheme } = useTheme(tenant);
  const { settings, setSettings, loading: contactLoading, saving: contactSaving, errors: contactErrors, saveSettings } = useContactSettings(tenant);
  const { sessions, loading, actionLoading, logoutDevice, logoutOtherDevices } = useDevice();
  const [contactMessage, setContactMessage] = useState<string | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [organizationMessage, setOrganizationMessage] = useState<string | null>(null);
  const [themeEditor, setThemeEditor] = useState<ThemeEditorState>(() => parseThemeEditor(null));
  const [themeModeDefault, setThemeModeDefault] = useState<"light" | "dark">("light");
  const [themeMessage, setThemeMessage] = useState<string | null>(null);
  const [themeError, setThemeError] = useState<string | null>(null);
  const [themeSaving, setThemeSaving] = useState(false);
  const [organizationSaving, setOrganizationSaving] = useState(false);

  const organization = details?.organization ?? details ?? null;
  const themeTokens = currentTheme?.tokens ?? null;
  const paymentSummary = `${settings.payment_provider ?? "paypal_sandbox"} • LKR`;
  const [organizationForm, setOrganizationForm] = useState({
    name: organization?.name ?? tenant,
    key: organization?.key ?? tenant,
    timezone: organization?.timezone ?? "Asia/Colombo",
    locale: organization?.locale ?? "en",
  });

  React.useEffect(() => {
    setOrganizationForm({
      name: organization?.name ?? tenant,
      key: organization?.key ?? tenant,
      timezone: organization?.timezone ?? "Asia/Colombo",
      locale: organization?.locale ?? "en",
    });
  }, [organization?.key, organization?.locale, organization?.name, organization?.timezone, tenant]);

  React.useEffect(() => {
    if (currentTheme?.tokens) {
      setThemeEditor(parseThemeEditor(currentTheme.tokens));
    }
    if (currentTheme?.mode_default === "light" || currentTheme?.mode_default === "dark") {
      setThemeModeDefault(currentTheme.mode_default);
    }
  }, [currentTheme?.mode_default, currentTheme?.tokens]);

  const handleContactSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setContactMessage(null);

    try {
      await saveSettings(settings);
      setContactMessage("Contact mail settings saved.");
    } catch {
      setContactMessage(null);
    }
  };

  const handlePaymentSave = async () => {
    setPaymentMessage(null);

    try {
      await saveSettings(settings);
      setPaymentMessage("Payment settings saved.");
    } catch {
      setPaymentMessage(null);
    }
  };

  const handleOrganizationSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOrganizationMessage(null);
    setOrganizationSaving(true);

    try {
      await updateOrganizationProfile({
        tenantKey: tenant,
        name: organizationForm.name.trim() || tenant,
        key: organizationForm.key.trim() || tenant,
        timezone: organizationForm.timezone.trim() || "Asia/Colombo",
        locale: organizationForm.locale.trim() || "en",
      });
      setOrganizationMessage("Tenant settings saved.");
    } catch (error) {
      setOrganizationMessage(error instanceof Error ? error.message : "Failed to save tenant settings.");
    } finally {
      setOrganizationSaving(false);
    }
  };

  const updateThemeColor = (mode: "light" | "dark", key: string, value: string) => {
    setThemeEditor((previous) => ({
      ...previous,
      [mode]: { ...previous[mode], [key]: value },
    }));
    setThemeMessage(null);
    setThemeError(null);
  };

  const handleThemeSave = async () => {
    setThemeSaving(true);
    setThemeMessage(null);
    setThemeError(null);

    try {
      const tokens = themeEditor.hasDark
        ? { light: themeEditor.light, dark: themeEditor.dark }
        : themeEditor.light;

      await updateTheme({
        tenantKey: tenant,
        mode_default: themeModeDefault,
        tokens: JSON.stringify(tokens),
      });

      // Read the persisted value back from the API, then refresh the shared
      // tenant bootstrap so every screen uses the saved theme.
      const savedTheme = await getTheme(tenant);
      if (!savedTheme) throw new Error("Theme was saved but could not be read back.");
      const savedTokens = savedTheme?.data?.tokens;
      setThemeEditor(parseThemeEditor(savedTokens));
      if (savedTheme.data.mode_default === "light" || savedTheme.data.mode_default === "dark") {
        setThemeModeDefault(savedTheme.data.mode_default);
      }

      const savedEditor = parseThemeEditor(savedTokens);
      const savedThemeInput = savedEditor.hasDark
        ? { light: savedEditor.light, dark: savedEditor.dark }
        : savedEditor.light;
      applyTenantTheme(savedThemeInput);
      dispatch(fetchTenantBootstrap(tenant));

      setThemeMessage("Theme settings saved.");
    } catch (error) {
      setThemeError(error instanceof Error ? error.message : "Failed to save theme settings.");
    } finally {
      setThemeSaving(false);
    }
  };

  const handleThemeReset = () => {
    setThemeEditor(parseThemeEditor(themeTokens));
    setThemeMessage(null);
    setThemeError(null);
  };

  return (
    <div className="min-h-[calc(100vh-2px)] bg-bg text-fg">
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="bg-menu px-6 py-6 shadow-sm">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-muted">
            <FaShieldHalved />
            Settings
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Tenant configuration</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            Inspect the tenant profile, theme payload, and active device sessions from one screen.
          </p>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Metric title="Tenant" value={organization?.name ?? tenant} icon={FaCircleInfo} />
          <Metric title="Status" value={organization?.status ?? "unknown"} icon={FaBolt} />
          <Metric title="Theme" value={themeTokens ? "Loaded" : "Unavailable"} icon={FaPalette} />
          <Metric title="Devices" value={`${sessions.length} active`} icon={FaUsers} />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="bg-bg px-6 py-5 shadow-sm">
            <div className="border-b border-border pb-4">
              <h2 className="text-lg font-semibold">Organization profile</h2>
              <p className="mt-1 text-sm text-muted">Edit the tenant name, key, timezone, and locale that drive routing and reporting.</p>
            </div>

            <form className="mt-5 grid gap-4" onSubmit={handleOrganizationSave}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-fg">
                  Tenant name
                  <input
                    value={organizationForm.name}
                    onChange={(event) => setOrganizationForm((prev) => ({ ...prev, name: event.target.value }))}
                    className="bg-menu px-4 py-3 text-fg outline-none ring-1 ring-border transition focus:ring-2 focus:ring-fg/40"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-fg">
                  Tenant key
                  <input
                    value={organizationForm.key}
                    onChange={(event) => setOrganizationForm((prev) => ({ ...prev, key: event.target.value }))}
                    className="bg-menu px-4 py-3 text-fg outline-none ring-1 ring-border transition focus:ring-2 focus:ring-fg/40"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-fg">
                  Timezone
                  <input
                    value={organizationForm.timezone}
                    onChange={(event) => setOrganizationForm((prev) => ({ ...prev, timezone: event.target.value }))}
                    className="bg-menu px-4 py-3 text-fg outline-none ring-1 ring-border transition focus:ring-2 focus:ring-fg/40"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-fg">
                  Locale
                  <input
                    value={organizationForm.locale}
                    onChange={(event) => setOrganizationForm((prev) => ({ ...prev, locale: event.target.value }))}
                    className="bg-menu px-4 py-3 text-fg outline-none ring-1 ring-border transition focus:ring-2 focus:ring-fg/40"
                  />
                </label>
              </div>

              <div className="grid gap-3 text-sm text-muted">
                <div className="bg-menu px-4 py-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">Updated</p>
                  <p className="mt-2 font-medium text-fg">{formatDateLong(organization?.updated_at)}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={organizationSaving}
                  className="bg-fg px-5 py-3 text-sm font-semibold text-bg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {organizationSaving ? "Saving..." : "Save tenant settings"}
                </button>
                <span className="text-xs uppercase tracking-[0.3em] text-muted">Name, key, timezone, locale</span>
              </div>

              {organizationMessage ? <p className="text-sm text-green-700">{organizationMessage}</p> : null}
            </form>
          </section>

          <section className="bg-menu px-6 py-5 shadow-sm">
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div>
                <h2 className="text-lg font-semibold">Active sessions</h2>
                <p className="mt-1 text-sm text-muted">Signed-in devices and the current session manager.</p>
              </div>
              <button
                type="button"
                disabled={actionLoading.logoutOthers}
                onClick={() => void logoutOtherDevices()}
                className="bg-bg px-4 py-2 text-sm font-semibold text-fg transition hover:bg-hover hover:text-hover_text disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading.logoutOthers ? "Signing out..." : "Logout others"}
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {loading && sessions.length === 0 ? (
                <div className="bg-bg px-4 py-8 text-sm text-muted shadow-sm">Loading sessions...</div>
              ) : sessions.length === 0 ? (
                <div className="bg-bg px-4 py-8 text-sm text-muted shadow-sm">No active sessions were returned by the backend.</div>
              ) : (
                sessions.map((session) => (
                  <div key={session.id} className="bg-bg px-4 py-4 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-fg">{session.device_name ?? "Unknown device"}</p>
                          {session.is_current ? (
                            <span className="border-b border-border text-[11px] uppercase tracking-[0.2em] text-muted">
                              Current
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-muted">
                          {session.browser ?? "Unknown browser"} {session.os ? `• ${session.os}` : ""}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {session.ip_last ?? "Unknown IP"} {session.last_seen_at ? `• ${formatDateLong(session.last_seen_at)}` : ""}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={actionLoading.logoutOne === session.id || session.is_current}
                        onClick={() => void logoutDevice(session.id)}
                        className="bg-danger/10 px-4 py-2 text-sm font-semibold text-danger transition hover:bg-danger/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {actionLoading.logoutOne === session.id ? "Signing out..." : "Logout"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <section className="mt-6 bg-menu px-6 py-5 shadow-sm">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="text-lg font-semibold">Contact mail settings</h2>
              <p className="mt-1 text-sm text-muted">
                Configure the Gmail address and app key used to send contact form inquiries.
              </p>
            </div>
          </div>

          <form className="mt-5 grid gap-4 lg:grid-cols-2" onSubmit={handleContactSave}>
            <label className="grid gap-2 text-sm font-medium text-fg">
              Contact email
              <input
                type="email"
                value={settings.email}
                onChange={(event) => setSettings((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="support@yourdomain.com"
                className="bg-bg px-4 py-3 text-fg outline-none ring-1 ring-border transition focus:ring-2 focus:ring-fg/40"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-fg">
              Google App Key
              <input
                type="password"
                value={settings.google_app_key}
                onChange={(event) => setSettings((prev) => ({ ...prev, google_app_key: event.target.value }))}
                placeholder="16-character app password"
                className="bg-bg px-4 py-3 text-fg outline-none ring-1 ring-border transition focus:ring-2 focus:ring-fg/40"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-fg">
              Sender name
              <input
                type="text"
                value={settings.sender_name ?? ""}
                onChange={(event) => setSettings((prev) => ({ ...prev, sender_name: event.target.value }))}
                placeholder={organization?.name ?? tenant}
                className="bg-bg px-4 py-3 text-fg outline-none ring-1 ring-border transition focus:ring-2 focus:ring-fg/40"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-fg">
              Reply-to email
              <input
                type="email"
                value={settings.reply_to_email ?? ""}
                onChange={(event) => setSettings((prev) => ({ ...prev, reply_to_email: event.target.value }))}
                placeholder="optional@yourdomain.com"
                className="bg-bg px-4 py-3 text-fg outline-none ring-1 ring-border transition focus:ring-2 focus:ring-fg/40"
              />
            </label>

            <div className="flex flex-col gap-3 lg:col-span-2">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={contactLoading || contactSaving}
                  className="bg-fg px-5 py-3 text-sm font-semibold text-bg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {contactSaving ? "Saving..." : "Save contact settings"}
                </button>
                <span className="text-xs uppercase tracking-[0.3em] text-muted">
                  {contactLoading ? "Loading settings..." : "Ready"}
                </span>
              </div>

              {contactMessage ? <p className="text-sm text-green-700">{contactMessage}</p> : null}
              {contactErrors ? <p className="text-sm text-danger">{contactErrors}</p> : null}
            </div>
          </form>
        </section>

        <section className="mt-6 bg-menu px-6 py-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="text-lg font-semibold">Theme management</h2>
              <p className="mt-1 text-sm text-muted">
                Adjust the tenant color palette and preview the changes before saving.
              </p>
            </div>
            <FaPalette className="text-muted" />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-fg">
              Default appearance
              <select
                value={themeModeDefault}
                onChange={(event) => setThemeModeDefault(event.target.value as "light" | "dark")}
                className="bg-bg px-3 py-2 text-fg outline-none ring-1 ring-border transition focus:ring-2 focus:ring-fg/40"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-fg">
              <input
                type="checkbox"
                checked={themeEditor.hasDark}
                onChange={(event) => setThemeEditor((previous) => ({ ...previous, hasDark: event.target.checked }))}
                className="h-4 w-4 accent-current"
              />
              Enable separate dark palette
            </label>
            <span className="text-xs uppercase tracking-[0.3em] text-muted">
              {themeEditor.hasDark ? "Light and dark tokens" : "Single palette"}
            </span>
          </div>

          <div className={`mt-5 grid gap-6 ${themeEditor.hasDark ? "xl:grid-cols-2" : ""}`}>
            {(themeEditor.hasDark ? (["light", "dark"] as ThemeMode[]) : (["light"] as ThemeMode[])).map((mode) => (
              <div key={mode} className="bg-bg px-4 py-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold capitalize text-fg">{mode} palette</h3>
                  <div
                    className="h-8 w-16 rounded border border-border"
                    style={{ backgroundColor: isColorValue(themeEditor[mode].primary) ? themeEditor[mode].primary : undefined }}
                    title={`${mode} primary preview`}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {themeColorFields.map(([key, label]) => {
                    const value = themeEditor[mode][key] ?? "";

                    return (
                      <label key={key} className="grid gap-2 text-sm font-medium text-fg">
                        {label}
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={isColorValue(value) ? value : "#000000"}
                            onChange={(event) => updateThemeColor(mode, key, event.target.value)}
                            className="h-11 w-12 cursor-pointer bg-transparent"
                            aria-label={`${mode} ${label} color`}
                          />
                          <input
                            value={value}
                            onChange={(event) => updateThemeColor(mode, key, event.target.value)}
                            placeholder="#000000"
                            className="min-w-0 flex-1 bg-menu px-3 py-3 text-fg outline-none ring-1 ring-border transition focus:ring-2 focus:ring-fg/40"
                          />
                        </div>
                      </label>
                    );
                  })}
                </div>

                <label className="mt-3 grid gap-2 text-sm font-medium text-fg">
                  Border radius
                  <input
                    value={themeEditor[mode].radius ?? ""}
                    onChange={(event) => updateThemeColor(mode, "radius", event.target.value)}
                    placeholder="16px"
                    className="bg-menu px-3 py-3 text-fg outline-none ring-1 ring-border transition focus:ring-2 focus:ring-fg/40"
                  />
                </label>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void handleThemeSave()}
              disabled={themeSaving}
              className="bg-fg px-5 py-3 text-sm font-semibold text-bg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {themeSaving ? "Saving..." : "Save theme settings"}
            </button>
            <button
              type="button"
              onClick={handleThemeReset}
              disabled={themeSaving}
              className="bg-bg px-5 py-3 text-sm font-semibold text-fg transition hover:bg-hover hover:text-hover_text disabled:cursor-not-allowed disabled:opacity-60"
            >
              Reset changes
            </button>
            <span className="text-xs uppercase tracking-[0.3em] text-muted">
              {themeSaving ? "Saving theme..." : "Changes apply to the tenant palette"}
            </span>
          </div>

          {themeMessage ? <p className="mt-3 text-sm text-green-700">{themeMessage}</p> : null}
          {themeError ? <p className="mt-3 text-sm text-danger">{themeError}</p> : null}
        </section>

        <section className="mt-6 bg-bg px-6 py-5 shadow-sm">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="text-lg font-semibold">Customer intake payment settings</h2>
              <p className="mt-1 text-sm text-muted">
                Store only the sandbox account values needed for customer-intake payments. Customer data and partial payment amounts are handled in Inbox and the intake portal.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-fg">
              Payment provider
              <select
                value={settings.payment_provider ?? "paypal_sandbox"}
                onChange={(event) =>
                  setSettings((prev) => ({ ...prev, payment_provider: event.target.value }))
                }
                className="bg-menu px-4 py-3 text-fg outline-none ring-1 ring-border transition focus:ring-2 focus:ring-fg/40"
              >
                <option value="paypal_sandbox">PayPal sandbox</option>
                <option value="manual_sandbox">Manual sandbox</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-fg">
              PayPal sandbox business email
              <input
                type="email"
                value={settings.payment_business_email ?? ""}
                onChange={(event) =>
                  setSettings((prev) => ({ ...prev, payment_business_email: event.target.value }))
                }
                placeholder="merchant-facilitator@example.com"
                className="bg-menu px-4 py-3 text-fg outline-none ring-1 ring-border transition focus:ring-2 focus:ring-fg/40"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-fg">
              PayPal sandbox client ID
              <input
                type="text"
                value={settings.payment_client_id ?? ""}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    payment_client_id: event.target.value,
                  }))
                }
                placeholder="optional client id"
                className="bg-menu px-4 py-3 text-fg outline-none ring-1 ring-border transition focus:ring-2 focus:ring-fg/40"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-fg">
              PayPal sandbox secret
              <input
                type="password"
                value={settings.payment_client_secret ?? ""}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    payment_client_secret: event.target.value,
                  }))
                }
                placeholder="optional secret"
                className="bg-menu px-4 py-3 text-fg outline-none ring-1 ring-border transition focus:ring-2 focus:ring-fg/40"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-fg">
              Currency
              <input
                type="text"
                value="LKR"
                readOnly
                className="bg-menu px-4 py-3 text-fg outline-none ring-1 ring-border opacity-80"
              />
            </label>
          </div>

          <div className="mt-4 rounded-2xl border border-dashed border-border bg-menu px-4 py-4 text-sm text-muted">
            Payment gateway summary: {paymentSummary}. The intake portal generates the partial payment flow and customer form; settings only store sandbox credentials.
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void handlePaymentSave()}
              disabled={contactLoading || contactSaving}
              className="bg-fg px-5 py-3 text-sm font-semibold text-bg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {contactSaving ? "Saving..." : "Save payment configs"}
            </button>
            <span className="text-xs uppercase tracking-[0.3em] text-muted">
              Sandbox credentials only
            </span>
          </div>

          {paymentMessage ? <p className="mt-3 text-sm text-green-700">{paymentMessage}</p> : null}
        </section>

        <section className="mt-6 bg-bg px-6 py-5 shadow-sm">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="text-lg font-semibold">Theme payload</h2>
              <p className="mt-1 text-sm text-muted">Read-only preview of the current tenant theme data.</p>
            </div>
            <FaClockRotateLeft className="text-muted" />
          </div>

          <pre className="mt-5 overflow-auto bg-[#0f1720] p-4 text-xs leading-6 text-white">
            {JSON.stringify(themeTokens ?? { message: "No theme tokens returned." }, null, 2)}
          </pre>
        </section>
      </div>
    </div>
  );
}
