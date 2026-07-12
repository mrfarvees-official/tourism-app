import { useCallback, useEffect, useState } from "react";
import { getTenantDashboard } from "../../routes/admin/dashboard";

type ApiError = {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const typedError = error as ApiError;
  return typedError?.response?.data?.message ?? typedError?.response?.data?.error ?? typedError?.message ?? fallback;
};

export type DashboardData = {
  tenant: {
    id: number;
    key: string;
    name: string;
    status?: string | null;
    timezone?: string | null;
    locale?: string | null;
  };
  summary: {
    pages_total: number;
    pages_published: number;
    pages_draft: number;
    media_total: number;
    media_bytes: number;
    schemas_total: number;
    schemas_enabled: number;
    records_total: number;
    members_total: number;
    owners_total: number;
    invites_total: number;
    updated_at?: string | null;
  };
  pages: Array<Record<string, unknown>>;
  media: Array<Record<string, unknown>>;
  schemas: Array<Record<string, unknown>>;
  members: Array<Record<string, unknown>>;
  invites: Array<Record<string, unknown>>;
  records: Array<Record<string, unknown>>;
  inbox: Array<Record<string, unknown>>;
  categories: Record<string, Array<Record<string, unknown>>>;
  activity: Array<Record<string, unknown>>;
};

export const useTenantDashboard = (tenantKey: string) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[] | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!tenantKey) return null;

    setLoading(true);
    setErrors(null);

    try {
      const response = await getTenantDashboard(tenantKey);
      const data = response?.data?.data ?? response?.data ?? null;
      setDashboard(data as DashboardData | null);
      return data as DashboardData | null;
    } catch (error: unknown) {
      setDashboard(null);
      setErrors([getErrorMessage(error, "Failed to load dashboard")]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [tenantKey]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return {
    loading,
    errors,
    dashboard,
    refetch: loadDashboard,
  };
};
