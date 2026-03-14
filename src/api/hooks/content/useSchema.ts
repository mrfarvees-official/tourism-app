import {
  createSchema,
  deleteSchema,
  getAllSchema,
  updateSchema,
} from "../../routes/content/schema";
import { useState, useEffect, useCallback } from "react";

export const useSchema = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [schemas, setSchemas] = useState<any>(null);

  const clearState = useCallback(() => {
    setErrors(null);
    setLoading(false);
  }, []);

  const handleCreateSchema = useCallback(
    async (payload: any) => {
      clearState();

      try {
        setLoading(true);
        const result = await createSchema(payload);
        setResult(result);
      } catch (err: any) {
        setResult(null);
        setErrors([
          err?.response?.data?.message ??
            err?.message ??
            "Failed to create schema",
        ]);
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
        setSchemas(result && result.data.data);
      } catch (err: any) {
        setResult(null);
        setErrors([
          err?.response?.data?.message ??
            err?.message ??
            "Failed to create schema",
        ]);
      } finally {
        setLoading(false);
      }
    },
    [clearState],
  );

  const handleGetSchema = useCallback(async () => {}, []);

  const handleUpdateSchema = useCallback(
    async (payload: any, schemaId: number) => {
      clearState();

      try {
        setLoading(true);
        const result = await updateSchema(payload, schemaId);
        setResult(result && (result.data.data ?? result.data));
        return result;
      } catch (err: any) {
        setResult(null);
        const errorMessages = [
          err?.response?.data?.message ??
            err?.message ??
            "Failed to delete schema",
        ];
        setErrors(errorMessages);
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
      } catch (err: any) {
        setResult(null);
        const errorMessages = [
          err?.response?.data?.message ??
            err?.message ??
            "Failed to delete schema",
        ];
        setErrors(errorMessages);
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
