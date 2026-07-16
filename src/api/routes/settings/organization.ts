import { http, csrf } from "../../config/http";

export const getOrganizationProfile = async (tenantKey: string) => {
  try {
    return await http.get(`api/organization?tenantKey=${tenantKey}`);
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : "Failed to load organization profile.");
  }
};

export type OrganizationProfilePayload = {
  tenantKey: string;
  name: string;
  key: string;
  timezone: string;
  locale: string;
};

export const updateOrganizationProfile = async (payload: OrganizationProfilePayload) => {
  await csrf();
  return http.patch("api/organization", payload);
};
