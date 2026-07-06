import { useCallback, useState } from "react";
import { deleteMedia, getAllMedia, uploadMedia, type TenantMediaPayload } from "../../routes/media";

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const typedError = error as ApiError;
  return typedError?.response?.data?.message ?? typedError?.message ?? fallback;
};

export type MediaItem = {
  id: number;
  tenant_id?: number;
  kind?: string;
  disk?: string;
  path?: string;
  public_id?: string | null;
  secure_url?: string | null;
  mime?: string | null;
  size?: number | null;
  label?: string | null;
  created_at?: string;
  updated_at?: string;
  url?: string | null;
};

export const useMedia = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[] | null>(null);
  const [result, setResult] = useState<unknown>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);

  const clearState = useCallback(() => {
    setErrors(null);
    setLoading(false);
  }, []);

  const handleGetAllMedia = useCallback(
    async (tenantKey: string) => {
      clearState();

      try {
        setLoading(true);
        const response = await getAllMedia(tenantKey);
        const rows = response ? response.data?.data ?? response.data ?? [] : [];
        setMedia(Array.isArray(rows) ? rows : []);
        setResult(rows);
        return response;
      } catch (err: unknown) {
        setMedia([]);
        setResult(null);
        setErrors([getErrorMessage(err, "Failed to load media")]);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [clearState],
  );

  const handleUploadMedia = useCallback(
    async (payload: TenantMediaPayload) => {
      clearState();

      try {
        setLoading(true);
        const response = await uploadMedia(payload);
        setResult(response);
        return response;
      } catch (err: unknown) {
        setResult(null);
        setErrors([getErrorMessage(err, "Failed to upload media")]);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [clearState],
  );

  const handleDeleteMedia = useCallback(
    async (tenantKey: string, mediaId: number) => {
      clearState();

      try {
        setLoading(true);
        const response = await deleteMedia(tenantKey, mediaId);
        setResult(response);
        return response;
      } catch (err: unknown) {
        setResult(null);
        setErrors([getErrorMessage(err, "Failed to delete media")]);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [clearState],
  );

  return {
    loading,
    errors,
    result,
    media,
    clearState,
    handleGetAllMedia,
    handleUploadMedia,
    handleDeleteMedia,
  };
};
