import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getContactSettings,
  updateContactSettings,
  type ContactSettingsPayload,
} from "../../routes/settings/contact";

type ApiError = {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
  message?: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const typedError = error as ApiError;
  return (
    typedError?.response?.data?.error ??
    typedError?.response?.data?.message ??
    typedError?.message ??
    fallback
  );
};

export type ContactSettings = {
  email: string;
  google_app_key: string;
  reply_to_email?: string;
  sender_name?: string;
  payment_provider?: string;
  payment_business_email?: string;
  payment_client_id?: string;
  payment_client_secret?: string;
  payment_currency?: string;
  payment_brand_name?: string;
  payment_partial_amount?: string;
  payment_note?: string;
};

function normalizeSettings(data: unknown): ContactSettings {
  const record =
    data && typeof data === "object" && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : {};

  const settings =
    record.settings && typeof record.settings === "object" && !Array.isArray(record.settings)
      ? (record.settings as Record<string, unknown>)
      : record;

  return {
    email: String(settings.email ?? ""),
    google_app_key: String(settings.google_app_key ?? ""),
    reply_to_email: settings.reply_to_email ? String(settings.reply_to_email) : "",
    sender_name: settings.sender_name ? String(settings.sender_name) : "",
    payment_provider: settings.payment_provider ? String(settings.payment_provider) : "paypal_sandbox",
    payment_business_email: settings.payment_business_email ? String(settings.payment_business_email) : "",
    payment_client_id: settings.payment_client_id ? String(settings.payment_client_id) : "",
    payment_client_secret: settings.payment_client_secret ? String(settings.payment_client_secret) : "",
    payment_currency: settings.payment_currency ? String(settings.payment_currency) : "LKR",
    payment_brand_name: settings.payment_brand_name ? String(settings.payment_brand_name) : "",
    payment_partial_amount: settings.payment_partial_amount ? String(settings.payment_partial_amount) : "100",
    payment_note: settings.payment_note ? String(settings.payment_note) : "",
  };
}

export function useContactSettings(tenantKey: string | null) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
  const [settings, setSettings] = useState<ContactSettings>({
    email: "",
    google_app_key: "",
    reply_to_email: "",
    sender_name: "",
    payment_provider: "paypal_sandbox",
    payment_business_email: "",
    payment_client_id: "",
    payment_client_secret: "",
    payment_currency: "LKR",
    payment_brand_name: "",
    payment_partial_amount: "100",
    payment_note: "",
  });

  const fetchSettings = useCallback(async () => {
    if (!tenantKey) {
      setSettings({
        email: "",
        google_app_key: "",
        reply_to_email: "",
        sender_name: "",
        payment_provider: "paypal_sandbox",
        payment_business_email: "",
        payment_client_id: "",
        payment_client_secret: "",
        payment_currency: "LKR",
        payment_brand_name: "",
        payment_partial_amount: "100",
        payment_note: "",
      });
      return;
    }

    setLoading(true);
    setErrors(null);

    try {
      const { data } = await getContactSettings(tenantKey);
      setSettings(normalizeSettings(data));
    } catch (error: unknown) {
      setErrors(getErrorMessage(error, "Failed to load contact settings."));
    } finally {
      setLoading(false);
    }
  }, [tenantKey]);

  useEffect(() => {
    void fetchSettings();
  }, [fetchSettings]);

  const saveSettings = useCallback(
    async (nextSettings: ContactSettings) => {
      if (!tenantKey) {
        throw new Error("Missing tenant key.");
      }

      setSaving(true);
      setErrors(null);

      const payload: ContactSettingsPayload = {
        tenantKey,
        email: nextSettings.email,
        google_app_key: nextSettings.google_app_key,
        reply_to_email: nextSettings.reply_to_email?.trim() || undefined,
        sender_name: nextSettings.sender_name?.trim() || undefined,
        payment_provider: nextSettings.payment_provider?.trim() || "paypal_sandbox",
        payment_business_email: nextSettings.payment_business_email?.trim() || undefined,
        payment_client_id: nextSettings.payment_client_id?.trim() || undefined,
        payment_client_secret: nextSettings.payment_client_secret?.trim() || undefined,
        payment_currency: nextSettings.payment_currency?.trim() || "LKR",
        payment_brand_name: nextSettings.payment_brand_name?.trim() || undefined,
        payment_partial_amount: nextSettings.payment_partial_amount?.trim() || undefined,
        payment_note: nextSettings.payment_note?.trim() || undefined,
      };

      try {
        const { data } = await updateContactSettings(payload);
        const next = normalizeSettings(data);
        setSettings(next);
        return next;
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to save contact settings.");
        setErrors(message);
        throw new Error(message);
      } finally {
        setSaving(false);
      }
    },
    [tenantKey],
  );

  const ready = useMemo(() => !loading && !saving, [loading, saving]);

  return {
    loading,
    saving,
    ready,
    errors,
    settings,
    setSettings,
    refetch: fetchSettings,
    saveSettings,
  };
}
