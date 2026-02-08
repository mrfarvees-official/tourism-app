import { csrf, http } from "../config/http";

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

export type ApiResponse =
  | DeviceSession[]
  | { sessions: DeviceSession[]; current_session_id?: string };

export const getLoggedDevicesInfo = async () => {
  await csrf();
  const { data } = await http.get<ApiResponse>("api/me/sessions");
  return data; // return the payload directly
};

export const logoutSingleDevice = async (sessionId: string) => {
  await csrf();
  const { data } = await http.post(`api/me/sessions/${sessionId}/logout`);
  return data;
};

export const logoutOtherDevices = async () => {
  await csrf();
  const { data } = await http.post('api/me/sessions/logout-others');
  return data;
};
