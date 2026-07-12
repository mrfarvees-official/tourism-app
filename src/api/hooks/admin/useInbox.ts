import { useCallback, useEffect, useState } from "react";
import {
  deleteTenantInboxMessage,
  getTenantInbox,
  updateTenantInboxMessage,
  type InboxStatus,
  type InboxUpdatePayload,
} from "../../routes/admin/inbox";

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

export type InboxMessage = {
  id: number;
  tenant_id?: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  subject?: string | null;
  message?: string | null;
  page_slug?: string | null;
  pageSlug?: string | null;
  source?: string | null;
  status?: InboxStatus | string | null;
  read_at?: string | null;
  replied_at?: string | null;
  meta?: Record<string, unknown> | null;
  updated_at?: string | null;
  created_at?: string | null;
  title?: string | null;
  preview?: string | null;
};

export const useInbox = (tenantKey: string) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[] | null>(null);
  const [result, setResult] = useState<unknown>(null);
  const [inbox, setInbox] = useState<InboxMessage[]>([]);

  const clearState = useCallback(() => {
    setErrors(null);
    setLoading(false);
  }, []);

  const loadInbox = useCallback(async () => {
    if (!tenantKey) return null;

    clearState();

    try {
      setLoading(true);
      const response = await getTenantInbox(tenantKey);
      const rows = response ? response.data?.data ?? response.data ?? [] : [];
      setInbox(Array.isArray(rows) ? (rows as InboxMessage[]) : []);
      setResult(rows);
      return response;
    } catch (error: unknown) {
      setInbox([]);
      setResult(null);
      setErrors([getErrorMessage(error, "Failed to load inbox")]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearState, tenantKey]);

  const saveInboxMessage = useCallback(
    async (inboxMessageId: number, payload: InboxUpdatePayload) => {
      clearState();

      try {
        setLoading(true);
        const response = await updateTenantInboxMessage(tenantKey, inboxMessageId, payload);
        setResult(response);
        return response;
      } catch (error: unknown) {
        setResult(null);
        setErrors([getErrorMessage(error, "Failed to update inbox message")]);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [clearState, tenantKey],
  );

  const removeInboxMessage = useCallback(
    async (inboxMessageId: number) => {
      clearState();

      try {
        setLoading(true);
        const response = await deleteTenantInboxMessage(tenantKey, inboxMessageId);
        setResult(response);
        return response;
      } catch (error: unknown) {
        setResult(null);
        setErrors([getErrorMessage(error, "Failed to delete inbox message")]);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [clearState, tenantKey],
  );

  useEffect(() => {
    void loadInbox();
  }, [loadInbox]);

  return {
    loading,
    errors,
    result,
    inbox,
    refetch: loadInbox,
    saveInboxMessage,
    removeInboxMessage,
  };
};
