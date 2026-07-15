import { useCallback, useEffect, useState } from "react";
import { getTenantActivityLogs } from "../../routes/admin/activityLogs";

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

export type ActivityLogItem = {
  id: number;
  actor_name: string;
  actor_email?: string | null;
  action: string;
  label: string;
  summary?: string | null;
  subject_type?: string | null;
  subject_id?: number | null;
  route?: string | null;
  method?: string | null;
  ip_address?: string | null;
  meta?: Record<string, unknown>;
  timestamp?: string | null;
};

export type ActivityLogMeta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from?: number | null;
  to?: number | null;
};

export const useTenantActivityLogs = (tenantKey: string, page: number, perPage: number) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[] | null>(null);
  const [items, setItems] = useState<ActivityLogItem[]>([]);
  const [meta, setMeta] = useState<ActivityLogMeta | null>(null);

  const loadActivityLogs = useCallback(async () => {
    if (!tenantKey) return null;

    setLoading(true);
    setErrors(null);

    try {
      const response = await getTenantActivityLogs(tenantKey, {
        page,
        per_page: perPage,
      });

      const data = response?.data?.data ?? response?.data ?? null;
      const nextItems = Array.isArray(data?.items) ? (data.items as ActivityLogItem[]) : [];
      const nextMeta = data?.meta && typeof data.meta === "object" && !Array.isArray(data.meta) ? (data.meta as ActivityLogMeta) : null;

      setItems(nextItems);
      setMeta(nextMeta);

      return { items: nextItems, meta: nextMeta };
    } catch (error: unknown) {
      setItems([]);
      setMeta(null);
      setErrors([getErrorMessage(error, "Failed to load activity logs")]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [page, perPage, tenantKey]);

  useEffect(() => {
    void loadActivityLogs();
  }, [loadActivityLogs]);

  return {
    loading,
    errors,
    items,
    meta,
    refetch: loadActivityLogs,
  };
};
