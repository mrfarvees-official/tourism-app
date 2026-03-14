import { useState, useEffect, useCallback, useMemo } from "react";
import { getOrganizationProfile } from "../../routes/settings/organization";

export const useOrganization = (tenantKey: string | null) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>(null);
  const [details, setDetails] = useState<any>(null);

  const clearState = useCallback(() => {
    setLoading(false);
    setErrors(null);
  }, []);

  const fetchOrganizationProfile = useCallback(async (tenantKey: string | null) => {
    clearState();

    if (!tenantKey) return;

    try {
      const { data } = await getOrganizationProfile(tenantKey);
      setDetails(data ?? null);
    } catch (err: any) {
      setDetails(null);
      setErrors([
        err?.response?.data?.message ??
          err?.message ??
          "Failed to logout device",
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrganizationProfile(tenantKey);
  }, [tenantKey]);

  return { loading, errors, details };
};
