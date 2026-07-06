import {
  createSchema,
  deleteSchema,
  getSchema,
  getAllSchema,
  updateSchema,
  type ContentSchemaPayload,
} from "../../routes/content/schema";
import { useState, useCallback } from "react";

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

export const useSchema = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[] | null>(null);
  const [result, setResult] = useState<unknown>(null);
  const [schemas, setSchemas] = useState<unknown>(null);

  const clearState = useCallback(() => {
    setErrors(null);
    setLoading(false);
  }, []);

  const handleCreateSchema = useCallback(
    async (payload: ContentSchemaPayload) => {
      clearState();

      try {
        setLoading(true);
        const result = await createSchema(payload);
        setResult(result);
      } catch (err: unknown) {
        setResult(null);
        setErrors([getErrorMessage(err, "Failed to create schema")]);
      } finally {
        setLoading(false);
      }
    },
    [clearState],
  );

  const handleGetAllSchema = useCallback(
    async (tenantKey: string) => {
      clearState();

      try {
        setLoading(true);
        const result = await getAllSchema(tenantKey);
        setSchemas(result ? result.data?.data ?? result.data ?? null : null);
      } catch (err: unknown) {
        setResult(null);
        setErrors([getErrorMessage(err, "Failed to load schemas")]);
      } finally {
        setLoading(false);
      }
    },
    [clearState],
  );

  const handleGetSchema = useCallback(
    async (tenantKey: string, schemaId: number) => {
      clearState();

      try {
        setLoading(true);
        const result = await getSchema(tenantKey, schemaId);
        setResult(result ? result.data?.data ?? result.data ?? null : null);
        return result;
      } catch (err: unknown) {
        setResult(null);
        setErrors([getErrorMessage(err, "Failed to load schema")]);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [clearState],
  );

  const handleUpdateSchema = useCallback(
    async (payload: Partial<ContentSchemaPayload>, schemaId: number) => {
      clearState();

      try {
        setLoading(true);
        const result = await updateSchema(payload, schemaId);
        setResult(result && (result.data.data ?? result.data));
        return result;
      } catch (err: unknown) {
        setResult(null);
        setErrors([getErrorMessage(err, "Failed to update schema")]);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [clearState],
  );

  const handleDeleteSchema = useCallback(
    async (tenantKey: string, schemaId: number) => {
      clearState();

      try {
        setLoading(true);
        const result = await deleteSchema(tenantKey, schemaId);
        setResult(result);
        return result;
      } catch (err: unknown) {
        setResult(null);
        setErrors([getErrorMessage(err, "Failed to delete schema")]);
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
    schemas,
    clearState,
    handleCreateSchema,
    handleGetAllSchema,
    handleGetSchema,
    handleUpdateSchema,
    handleDeleteSchema,
  };
};
