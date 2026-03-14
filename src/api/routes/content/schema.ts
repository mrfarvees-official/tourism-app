import { csrf, http } from "../../config/http";

export const createSchema = async (payload: any) => {
  try {
    await csrf();
    const result = await http.post("api/content", payload);
    if (result.data) return result;
    return false;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const getAllSchema = async (tKey: string) => {
  try {
    const result = await http.get("api/content", {params: {tenantKey: tKey}});
    if (result.data) return result;
    return false;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const getSchema = async (tKey: string, schemaId: number) => {};

export const updateSchema = async (payload: any, schemaId: number) => {
  await csrf();
  try {
    const result = await http.put(`api/content/${schemaId}`, payload);
    if (result.data) return result;
    return false;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const deleteSchema = async (tKey: string, schemaId: number) => {
  try {
    const result = await http.delete(`api/content/${schemaId}`, {params: {tenantKey: tKey}});
    if (result.data) return result;
    return false;
  } catch (err: any) {
    throw new Error(err);
  }
};
