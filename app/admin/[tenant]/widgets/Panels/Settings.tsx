"use client";

import React, { useState } from "react";
import { FaBolt, FaCircleInfo, FaClockRotateLeft, FaPalette, FaShieldHalved, FaUsers } from "react-icons/fa6";
import { useContactSettings } from "@/src/api/hooks/settings/useContactSettings";
import { useDevice } from "@/src/api/hooks/settings/useDevice";
import { useOrganization } from "@/src/api/hooks/settings/useOrganization";
import { useTheme } from "@/src/api/hooks/settings/useTheme";
import { updateOrganizationProfile } from "@/src/api/routes/settings/organization";
import { formatDateLong } from "./panelUtils";

type Props = {
  tenant: string;
};

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
  const { details } = useOrganization(tenant);
  const { currentTheme } = useTheme(tenant);
  const { settings, setSettings, loading: contactLoading, saving: contactSaving, errors: contactErrors, saveSettings } = useContactSettings(tenant);
  const { sessions, loading, actionLoading, logoutDevice, logoutOtherDevices } = useDevice();
  const [contactMessage, setContactMessage] = useState<string | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [organizationMessage, setOrganizationMessage] = useState<string | null>(null);
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
