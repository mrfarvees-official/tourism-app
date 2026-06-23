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
