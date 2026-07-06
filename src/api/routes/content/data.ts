import { csrf, http } from "../../config/http";

export type ContentDataChildFieldPayload = {
  field_key: string;
  source_column?: string;
  field_type?: "string" | "text" | "int" | "bool" | "decimal" | "asset" | "url";
  value_string?: string | null;
  value_text?: string | null;
  value_int?: number | null;
  value_bool?: boolean | null;
  value_decimal?: number | null;
  value_asset_id?: number | null;
};

export type ContentDataChildPayload = {
  source_key?: string | null;
  row_key?: string | null;
  sort_order?: number;
  payload?: Record<string, unknown> | unknown[] | null;
  data?: Record<string, unknown> | unknown[] | null;
  fields?: ContentDataChildFieldPayload[];
};

export type ContentDataSourceField = {
  field_key: string;
  source_column?: string | null;
  field_type?: string | null;
  visible?: boolean;
  required?: boolean;
  sample_value?: unknown;
};

export type ContentDataSource = {
  source_key: string;
  label: string;
  content_data_count: number;
  row_count: number;
  field_count: number;
  schema_count?: number;
  schema_blueprint?: string | Record<string, unknown> | null;
  sample_row_key?: string | null;
  fields: ContentDataSourceField[];
};

export type ContentDataPayload = {
  tenantKey: string;
  content_schema_id: number;
  data: Record<string, unknown> | unknown[];
  children?: ContentDataChildPayload[];
};

export const getContentData = async (tenantKey: string, schemaId: number) => {
  return http.get("api/content/data", {
    params: { tenantKey, content_schema_id: schemaId },
  });
};

export const getContentDataSources = async (
  tenantKey: string,
  schemaId?: number | null,
) => {
  return http.get("api/content/data/sources", {
    params: {
      tenantKey,
      ...(schemaId ? { content_schema_id: schemaId } : {}),
    },
  });
};

export const createContentData = async (payload: ContentDataPayload) => {
  await csrf();
  return http.post("api/content/data", payload);
};

export const updateContentData = async (
  contentDataId: number,
  payload: ContentDataPayload,
) => {
  await csrf();
  return http.put(`api/content/data/${contentDataId}`, payload);
};

export const deleteContentData = async (tenantKey: string, contentDataId: number) => {
  await csrf();
  return http.delete(`api/content/data/${contentDataId}`, {
    params: { tenantKey },
  });
};
