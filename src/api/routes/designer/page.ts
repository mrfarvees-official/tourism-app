import { csrf, http } from "../../config/http";

export type TenantPagePayload = {
  tenantKey: string;
  slug: string;
  title: string;
  status?: "draft" | "published";
  schema: {
    header: unknown;
    template: unknown;
    footer: unknown;
  };
  components?: unknown[];
  seo?: Record<string, unknown>;
  meta_title?: string;
  meta_description?: string;
  og_asset_id?: number | null;
  published_at?: string;
  content_datas?: ContentDataSnapshotPayload[];
};

export type ContentDataSnapshotPayload = {
  content_schema_menu: string;
  data: Record<string, unknown>;
  children?: ContentDataChildPayload[];
};

export type ContentDataChildPayload = {
  source_key?: string | null;
  row_key?: string | null;
  sort_order?: number;
  payload?: Record<string, unknown> | unknown[] | null;
  data?: Record<string, unknown> | unknown[] | null;
  fields?: ContentDataChildFieldPayload[];
};

export type ContentDataChildFieldPayload = {
  field_key: string;
  source_column?: string | null;
  field_type?: "string" | "text" | "int" | "bool" | "decimal" | "asset" | "url";
  value_string?: string | null;
  value_text?: string | null;
  value_int?: number | null;
  value_bool?: boolean | null;
  value_decimal?: number | null;
  value_asset_id?: number | null;
};

export const listTenantPages = async (tenantKey: string) => {
  return http.get("api/tenant/pages", { params: { tenantKey } });
};

export const loadTenantPage = async (tenantKey: string, slug: string) => {
  const normalizedSlug = slug.trim().replace(/^\/+/, "");
  return http.get(`api/tenant/pages/${encodeURI(normalizedSlug)}`, {
    params: { tenantKey },
  });
};

export const saveTenantPage = async (payload: TenantPagePayload) => {
  await csrf();
  return http.post("api/tenant/pages", payload);
};

export const updateTenantPage = async (payload: TenantPagePayload, originalSlug?: string) => {
  await csrf();
  const normalizedSlug = (originalSlug ?? payload.slug).trim().replace(/^\/+/, "");
  return http.put(`api/tenant/pages/${encodeURI(normalizedSlug)}`, payload);
};

export const deleteTenantPage = async (tenantKey: string, slug: string) => {
  const normalizedSlug = slug.trim().replace(/^\/+/, "");
  return http.delete(`api/tenant/pages/${encodeURI(normalizedSlug)}`, {
    params: { tenantKey },
  });
};
