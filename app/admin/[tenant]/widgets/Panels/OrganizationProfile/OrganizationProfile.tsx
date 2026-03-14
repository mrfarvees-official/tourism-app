import React, { useEffect, useMemo, useState } from "react";
import { useOrganization } from "@/src/api/hooks/settings/useOrganization";
import { Option, SelectField } from "@/src/shared/components/selectField";
import { TextField } from "@/src/shared/components/textField";
import { CheckboxField } from "@/src/shared/components/checkBoxField";

type TabKey = "owner" | "company" | "brand" | "domain";

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-3 py-2 rounded-md text-sm font-medium transition",
        "border",
        active
          ? "bg-accent text-hover_text border-accent"
          : "bg-transparent text-fg/80 border-border hover:bg-input",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </button>
  );
}

function PanelCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background shadow-sm">
      <div className="p-5 border-b border-border">
        <h2 className="text-fg font-semibold">{title}</h2>
        {subtitle ? (
          <p className="text-sm text-fg/70 mt-1">{subtitle}</p>
        ) : null}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function OrganizationProfile() {
  const [tenantKey, setTenantKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("company");

  // owner fields
  const [ownerName, setOwnerName] = useState<string>("");
  const [ownerEmail, setOwnerEmail] = useState<string>("");
  const [ownerVerification, setOwnerVerification] = useState<string>("");

  // org fields
  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [locale, setLocale] = useState("");
  const [timeZone, setTimeZone] = useState("");

  // brand fields
  const [brandName, setBrandName] = useState<string>("");

  // domain fields
  const [host, setHost] = useState("");
  const [type, setType] = useState("");
  const [dnsToken, setDnsToken] = useState("");
  const [primary, setPrimary] = useState(false);
  const [sslStatus, setSslStatus] = useState("");

  const [customHost, setCustomHost] = useState("");
  const [customType, setCustomType] = useState("");
  const [customDnsToken, setCustomDnsToken] = useState("");
  const [customPrimary, setCustomPrimary] = useState(false);
  const [customSslStatus, setCustomSslStatus] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathParts = window.location.pathname.split("/");
      const tenant = pathParts[2] ?? null;
      setTenantKey(tenant);
    }
  }, []);

  const { loading, errors, details } = useOrganization(tenantKey);
  const org = details?.organization?.[0];

  const localeOptions: Option[] = useMemo(() => {
    const base: Option[] = [
      { label: "English (US)", value: "en-US" },
      { label: "English (UK)", value: "en-GB" },
      { label: "Sinhala", value: "si-LK" },
      { label: "Tamil", value: "ta-LK" },
      { label: "Arabic", value: "ar" },
    ];
    if (locale && !base.some((o) => o.value === locale)) {
      base.unshift({ label: locale, value: locale });
    }
    return base;
  }, [locale]);

  const timezoneOptions: Option[] = useMemo(() => {
    const base: Option[] = [
      { label: "Asia/Colombo", value: "Asia/Colombo" },
      { label: "UTC", value: "UTC" },
      { label: "Asia/Dubai", value: "Asia/Dubai" },
      { label: "Asia/Kuala_Lumpur", value: "Asia/Kuala_Lumpur" },
      { label: "Europe/London", value: "Europe/London" },
      { label: "America/New_York", value: "America/New_York" },
    ];
    if (timeZone && !base.some((o) => o.value === timeZone)) {
      base.unshift({ label: timeZone, value: timeZone });
    }
    return base;
  }, [timeZone]);

  const domainTypeOptions: Option[] = useMemo(() => {
    const base: Option[] = [
      { label: "Subdomain", value: "subdomain" },
      { label: "Custom Domain", value: "custom" },
    ];
    if (type && !base.some((o) => o.value === type)) {
      base.unshift({ label: type, value: type });
    }
    return base;
  }, [type]);

  const sslStatusOptions: Option[] = useMemo(() => {
    const base: Option[] = [
      { label: "Pending", value: "pending" },
      { label: "Provisioning", value: "provisioning" },
      { label: "Active", value: "active" },
      { label: "Failed", value: "failed" },
      { label: "Disabled", value: "disabled" },
    ];
    if (sslStatus && !base.some((o) => o.value === sslStatus)) {
      base.unshift({ label: sslStatus, value: sslStatus });
    }
    return base;
  }, [sslStatus]);

  useEffect(() => {
    if (!org) return;

    setOwnerName(org.owner?.[0]?.name ?? "");
    setOwnerEmail(org.owner?.[0]?.email ?? "");
    setOwnerVerification(org.owner?.[0]?.email_verified_at ?? "Not verified");

    setKey(org.key ?? "");
    setName(org.name ?? "");
    setLocale(org.locale ?? "");
    setTimeZone(org.timezone ?? "");

    setHost(org.domain?.host ?? "");
    setType(org.domain?.type ?? "");
    setPrimary(Boolean(org.domain?.is_primary));
    setSslStatus(org.domain?.ssl_status ?? "");
    setDnsToken(org.domain?.dns_token ?? "");

    setBrandName(org.brand?.brand_name ?? "");
  }, [org]);

  const resetToServer = () => {
    if (!org) return;
    setKey(org.key ?? "");
    setName(org.name ?? "");
    setLocale(org.locale ?? "");
    setTimeZone(org.timezone ?? "");
    setHost(org.domain?.host ?? "");
    setType(org.domain?.type ?? "");
    setPrimary(Boolean(org.domain?.is_primary));
    setSslStatus(org.domain?.ssl_status ?? "");
    setDnsToken(org.domain?.dns_token ?? "");
    setBrandName(org.brand?.brand_name ?? "");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call your update mutation here
    // payload example:
    // {
    //   key, name, locale, timezone: timeZone,
    //   brand: { brand_name: brandName },
    //   domain: { host, type, is_primary: primary, ssl_status: sslStatus, dns_token: dnsToken }
    // }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="flex items-start justify-between gap-4 mt-4">
        <div>
          <h1 className="text-xl font-semibold text-title">
            Organization Details
          </h1>
          <p className="text-sm text-title/70">
            Edit your organization information. Do not share these details.
          </p>
        </div>
      </div>

      {/* Sticky Tabs (modern UX) */}
      <div className="mt-5 sticky top-0 z-10 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-border">
        <div className="py-3 flex flex-wrap gap-2">
          <TabButton
            active={activeTab === "owner"}
            onClick={() => setActiveTab("owner")}
          >
            Owner
          </TabButton>
          <TabButton
            active={activeTab === "company"}
            onClick={() => setActiveTab("company")}
          >
            Company
          </TabButton>
          <TabButton
            active={activeTab === "brand"}
            onClick={() => setActiveTab("brand")}
          >
            Brand
          </TabButton>
          <TabButton
            active={activeTab === "domain"}
            onClick={() => setActiveTab("domain")}
          >
            Domain
          </TabButton>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-6">
        {/* Panels */}
        {activeTab === "owner" ? (
          <PanelCard
            title="Owner Details"
            subtitle="These fields are read-only and linked to the organization owner."
          >
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-5">
              <TextField
                label="Full name"
                value={ownerName}
                placeholder={loading ? "Loading..." : "Full name"}
                onChange={setOwnerName}
                disabled
              />

              <TextField
                label="Email"
                value={ownerEmail}
                placeholder={loading ? "Loading..." : "Email"}
                onChange={setOwnerEmail}
                disabled
              />

              <TextField
                label="Verification Status"
                value={ownerVerification}
                placeholder={loading ? "Loading..." : "Verification status"}
                onChange={setOwnerVerification}
                disabled
              />
            </div>
          </PanelCard>
        ) : null}

        {activeTab === "company" ? (
          <PanelCard
            title="Company Details"
            subtitle="Core organization identity settings."
          >
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-5">
              <TextField
                label="Slug"
                value={key}
                placeholder={loading ? "Loading..." : "Slug"}
                onChange={setKey}
                disabled={loading}
              />

              <TextField
                label="Name"
                value={name}
                placeholder={loading ? "Loading..." : "Organization name"}
                onChange={setName}
                disabled={loading}
              />

              <SelectField
                label="Locale"
                value={locale}
                placeholder={loading ? "Loading..." : "Select locale"}
                options={localeOptions}
                onChange={setLocale}
                disabled={loading}
              />

              <SelectField
                label="Timezone"
                value={timeZone}
                placeholder={loading ? "Loading..." : "Select timezone"}
                options={timezoneOptions}
                onChange={setTimeZone}
                disabled={loading}
              />
            </div>

            {errors ? (
              <p className="text-sm text-red-500 mt-4">
                {Array.isArray(errors) ? errors.join(", ") : String(errors)}
              </p>
            ) : null}
          </PanelCard>
        ) : null}

        {activeTab === "brand" ? (
          <PanelCard
            title="Brand Details"
            subtitle="Brand name shown in customer-facing screens."
          >
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-5">
              <TextField
                label="Brand Name"
                value={brandName}
                placeholder={loading ? "Loading..." : "Brand name"}
                onChange={setBrandName}
                disabled={loading}
              />

              {/* If you truly want org name/locale/timezone repeated here, keep them;
                  otherwise remove for a cleaner UX. */}
              <TextField
                label="Organization Name"
                value={name}
                placeholder={loading ? "Loading..." : "Organization name"}
                onChange={setName}
                disabled={loading}
              />

              <SelectField
                label="Locale"
                value={locale}
                placeholder={loading ? "Loading..." : "Select locale"}
                options={localeOptions}
                onChange={setLocale}
                disabled={loading}
              />

              <SelectField
                label="Timezone"
                value={timeZone}
                placeholder={loading ? "Loading..." : "Select timezone"}
                options={timezoneOptions}
                onChange={setTimeZone}
                disabled={loading}
              />
            </div>
          </PanelCard>
        ) : null}

        {activeTab === "domain" ? (
          <PanelCard
            title="Domain Details"
            subtitle="Domain and SSL configuration for your organization."
          >
            <div className="w-full flex flex-col gap-y-10">
              <div>
                <h2 className="text-fg font-semibold py-3">Default tenant domain</h2>
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-5">
                  <TextField
                    label="Host"
                    value={host}
                    placeholder={loading ? "Loading..." : "host url"}
                    onChange={setHost}
                    disabled={loading}
                  />

                  <SelectField
                    label="Type"
                    value={type}
                    placeholder={loading ? "Loading..." : "Select type"}
                    options={domainTypeOptions}
                    onChange={setType}
                    disabled
                  />

                  <TextField
                    label="DNS Token"
                    value={dnsToken}
                    placeholder={loading ? "Loading..." : "token"}
                    onChange={setDnsToken}
                    disabled={loading}
                  />

                  <SelectField
                    label="SSL Status"
                    value={sslStatus}
                    placeholder={loading ? "Loading..." : "Select status"}
                    options={sslStatusOptions}
                    onChange={setSslStatus}
                    disabled={loading}
                  />

                  <CheckboxField
                    label="Primary domain"
                    checked={primary}
                    onChange={setPrimary}
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <h2 className="text-fg font-semibold py-3">Custom tenant domain</h2>
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-5">
                  <TextField
                    label="Host"
                    value={customHost}
                    placeholder={loading ? "Loading..." : "host url"}
                    onChange={setHost}
                    disabled={loading}
                  />

                  <SelectField
                    label="Type"
                    value={customType}
                    placeholder={loading ? "Loading..." : "Select type"}
                    options={domainTypeOptions}
                    onChange={setType}
                    disabled
                  />

                  <TextField
                    label="DNS Token"
                    value={customDnsToken}
                    placeholder={loading ? "Loading..." : "token"}
                    onChange={setDnsToken}
                    disabled={loading}
                  />

                  <SelectField
                    label="SSL Status"
                    value={customSslStatus}
                    placeholder={loading ? "Loading..." : "Select status"}
                    options={sslStatusOptions}
                    onChange={setSslStatus}
                    disabled={loading}
                  />

                  <CheckboxField
                    label="Primary domain"
                    checked={customPrimary}
                    onChange={setPrimary}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </PanelCard>
        ) : null}

        {/* Actions (global) */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-accent text-hover_text disabled:opacity-60"
            disabled={loading}
          >
            Save changes
          </button>

          <button
            type="button"
            className="px-4 py-2 rounded-md border border-border text-fg/80 hover:bg-input disabled:opacity-60"
            disabled={loading}
            onClick={resetToServer}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
