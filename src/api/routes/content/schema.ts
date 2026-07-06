import { csrf, http } from "../../config/http";

export type ContentSchemaPayload = {
  tenantKey: string;
  name: string;
  menu: string;
  schema: string;
  version: string;
  status: "enabled" | "disabled";
};

export const createSchema = async (payload: ContentSchemaPayload) => {
  try {
    await csrf();
    const result = await http.post("api/content", payload);
    if (result.data) return result;
    return false;
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : "Failed to create schema");
  }
};

export const getAllSchema = async (tKey: string) => {
  try {
    const result = await http.get("api/content/available", {
      params: { tenantKey: tKey },
    });
    if (result.data) return result;
    return false;
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : "Failed to load schemas");
  }
};

export const getSchema = async (tKey: string, schemaId: number) => {
  try {
    const result = await http.get(`api/content/${schemaId}`, {
      params: { tenantKey: tKey },
    });
    if (result.data) return result;
    return false;
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : "Failed to load schema");
  }
};

export const updateSchema = async (payload: Partial<ContentSchemaPayload>, schemaId: number) => {
  await csrf();
  try {
    const result = await http.put(`api/content/${schemaId}`, payload);
    if (result.data) return result;
    return false;
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : "Failed to update schema");
  }
};

export const deleteSchema = async (tKey: string, schemaId: number | null) => {
  try {
    const result = await http.delete(`api/content/${schemaId}`, {
      params: { tenantKey: tKey },
    });
    if (result.data) return result;
    return false;
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : "Failed to delete schema");
  }
};
