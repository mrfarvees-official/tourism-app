import { http } from "../config/http";

const getLaravelApiUrl = (path: string) => {
  const origin = (process.env.NEXT_PUBLIC_API_ORIGIN ?? process.env.API_ORIGIN ?? "").replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const apiRoot = origin.endsWith("/api") ? origin : `${origin}/api`;
  return `${apiRoot}${normalizedPath}`;
};

export const adminBusinessDashboardService = {
  get: (tenantKey: string, params?: { period?: "yearly" | "monthly"; year?: number; month?: number }) =>
    http.get(getLaravelApiUrl("/admin/business-dashboard"), {
      params: {
        tenantKey,
        ...params,
      },
    }),
};
