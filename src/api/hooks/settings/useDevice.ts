import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ApiResponse,
  getLoggedDevicesInfo,
  logoutOtherDevices as apiLogoutOtherDevices,
  logoutSingleDevice as apiLogoutSingleDevice,
} from "../../routes/settings/device";

type DeviceSession = {
  id: string;
  device_name?: string | null;
  device_type?: string | null;
  os?: string | null;
  browser?: string | null;
  ip_last?: string | null;
  last_seen_at?: string | null;
  created_at?: string | null;
  expires_at?: string | null;
  is_current?: boolean;
};

type NormalizedSessions = {
  sessions: DeviceSession[];
  current_session_id?: string;
};

function normalizeSessions(res: ApiResponse | null): NormalizedSessions {
  if (!res) return { sessions: [] };

  if (Array.isArray(res)) return { sessions: res };

  if ("sessions" in res && Array.isArray(res.sessions)) {
    return {
      sessions: res.sessions,
      current_session_id: res.current_session_id,
    };
  }

  return { sessions: [] };
}

export function useDevice() {
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<{
    logoutOne?: string; // sessionId
    logoutOthers?: boolean;
  }>({});
  const [errors, setErrors] = useState<string[] | null>(null);
  const [raw, setRaw] = useState<ApiResponse | null>(null);

  const clearState = useCallback(() => setErrors(null), []);

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setErrors(null);

    try {
      const res = await getLoggedDevicesInfo();
      setRaw(res ?? null);
    } catch (e: any) {
      setRaw([]);
      setErrors([
        e?.response?.data?.message ?? e?.message ?? "Failed to load devices",
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const { sessions, current_session_id } = useMemo(
    () => normalizeSessions(raw ?? null),
    [raw],
  );

  const sessionsWithCurrent = useMemo(() => {
    if (!current_session_id) return sessions;
    return sessions.map((s) => ({
      ...s,
      is_current: s.is_current ?? s.id === current_session_id,
    }));
  }, [sessions, current_session_id]);

  const logoutDevice = useCallback(
    async (sessionId: string) => {
      setErrors(null);
      setActionLoading((p) => ({ ...p, logoutOne: sessionId }));

      try {
        await apiLogoutSingleDevice(sessionId);
        await fetchDevices(); // refresh list
        return true;
      } catch (e: any) {
        setErrors([
          e?.response?.data?.message ?? e?.message ?? "Failed to logout device",
        ]);
        return false;
      } finally {
        setActionLoading((p) => ({ ...p, logoutOne: undefined }));
      }
    },
    [fetchDevices],
  );

  const logoutOtherDevices = useCallback(async () => {
    setErrors(null);
    setActionLoading((p) => ({ ...p, logoutOthers: true }));

    try {
      await apiLogoutOtherDevices();
      await fetchDevices(); // refresh list
      return true;
    } catch (e: any) {
      setErrors([
        e?.response?.data?.message ??
          e?.message ??
          "Failed to logout other devices",
      ]);
      return false;
    } finally {
      setActionLoading((p) => ({ ...p, logoutOthers: false }));
    }
  }, [fetchDevices]);

  const sessionsSorted = useMemo(() => {
    // ensure current flag is set consistently
    const withCurrent = sessionsWithCurrent;

    // sort rules:
    // 1) current session(s) first
    // 2) then by last_seen_at desc (fallback created_at desc)
    return [...withCurrent].sort((a, b) => {
      const aCur = a.is_current ? 1 : 0;
      const bCur = b.is_current ? 1 : 0;

      if (aCur !== bCur) return bCur - aCur;

      const aTime =
        (a.last_seen_at ? Date.parse(a.last_seen_at) : NaN) ||
        (a.created_at ? Date.parse(a.created_at) : NaN) ||
        0;

      const bTime =
        (b.last_seen_at ? Date.parse(b.last_seen_at) : NaN) ||
        (b.created_at ? Date.parse(b.created_at) : NaN) ||
        0;

      return bTime - aTime;
    });
  }, [sessionsWithCurrent]);

  return {
    loading, // loading sessions list
    actionLoading, // loading states for logout actions
    errors,
    clearState,
    refetch: fetchDevices,

    sessions: sessionsSorted, // always array
    current_session_id,

    logoutDevice, // (sessionId) => boolean
    logoutOtherDevices, // () => boolean
  };
}
