import { http, csrf } from "../../config/http";

export const getOrganizationProfile = async (tenantKey: string) => {
  try {
    return await http.get(`api/organization?tenantKey=${tenantKey}`);
  } catch (err: any) {
    throw new Error(err);
  }
};
