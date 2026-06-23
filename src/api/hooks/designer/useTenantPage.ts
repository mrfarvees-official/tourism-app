import { useCallback, useState } from "react";
import {
  deleteTenantPage,
  listTenantPages,
  loadTenantPage,
  saveTenantPage,
  TenantPagePayload,
  updateTenantPage,
} from "@/src/api/routes/designer/page";

type PageRecord = Record<string, unknown>;

const asRecord = (value: unknown): PageRecord | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as PageRecord;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === "object") {
    const record = error as Record<string, unknown>;
    const response = asRecord(record.response);
    const data = asRecord(response?.data);
    const message = data?.error ?? record.message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallback;
};

const unwrapRecord = (value: unknown): PageRecord | null => {
  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const candidates = [record.data, record.page, record.item];
  for (const candidate of candidates) {
    const nested = asRecord(candidate);
    if (nested) {
      return nested;
    }
  }

  return record;
};

const unwrapCollection = (value: unknown): PageRecord[] => {
  const record = asRecord(value);
  const candidates = [record?.data, record?.pages, record?.items, value];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as PageRecord[];
    }

    const nested = asRecord(candidate);
    if (!nested) {
      continue;
    }

    const nestedCandidates = [nested.data, nested.pages, nested.items];
    for (const item of nestedCandidates) {
      if (Array.isArray(item)) {
        return item as PageRecord[];
      }
    }
  }

  return [];
};

export const useTenantPage = (tenantKey: string | null) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[] | null>(null);
  const [pages, setPages] = useState<PageRecord[]>([]);
  const [currentPage, setCurrentPage] = useState<PageRecord | null>(null);

  const clearErrors = useCallback(() => {
    setErrors(null);
  }, []);

  const refreshPages = useCallback(async () => {
    if (!tenantKey) return [];

    clearErrors();
    setLoading(true);
    try {
      const res = await listTenantPages(tenantKey);
      const next = unwrapCollection(res);
      setPages(next);
      return next;
    } catch (error: unknown) {
      setErrors([getErrorMessage(error, "Failed to load pages")]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [tenantKey, clearErrors]);

  const fetchPage = useCallback(
    async (slug: string) => {
      if (!tenantKey || !slug) return null;

      clearErrors();
      setLoading(true);
      try {
        const res = await loadTenantPage(tenantKey, slug);
        const next = unwrapRecord(res);
        setCurrentPage(next);
        return next;
      } catch (error: unknown) {
        setCurrentPage(null);
        setErrors([getErrorMessage(error, "Failed to load page")]);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [tenantKey, clearErrors],
  );

  const persistPage = useCallback(
    async (payload: TenantPagePayload) => {
      if (!tenantKey) return null;

      clearErrors();
      setSaving(true);
      try {
        const nextPayload = {
          ...payload,
          tenantKey,
        };

        const res = currentPage
          ? await updateTenantPage(nextPayload, String(currentPage.slug ?? payload.slug))
          : await saveTenantPage(nextPayload);

        const next = unwrapRecord(res);
        setCurrentPage(next);
        return next;
      } catch (error: unknown) {
        setErrors([getErrorMessage(error, "Failed to save page")]);
        throw error;
      } finally {
        setSaving(false);
      }
    },
    [tenantKey, currentPage, clearErrors],
  );

  const removePage = useCallback(
    async (slug: string) => {
      if (!tenantKey) return null;

      clearErrors();
      setSaving(true);
      try {
        const res = await deleteTenantPage(tenantKey, slug);
        setCurrentPage(null);
        return res;
      } catch (error: unknown) {
        setErrors([getErrorMessage(error, "Failed to delete page")]);
        throw error;
      } finally {
        setSaving(false);
      }
    },
    [tenantKey, clearErrors],
  );

  return {
    loading,
    saving,
    errors,
    pages,
    currentPage,
    setCurrentPage,
    refreshPages,
    fetchPage,
    persistPage,
    removePage,
  };
};
