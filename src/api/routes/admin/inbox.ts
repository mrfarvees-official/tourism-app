import { csrf, http } from "../../config/http";

export type InboxStatus = "new" | "read" | "replied" | "archived";

export type InboxUpdatePayload = {
  status?: InboxStatus;
  read_at?: string | null;
  replied_at?: string | null;
};

export const getTenantInbox = async (tenantKey: string) => {
  return http.get("api/admin/inbox", {
    params: { tenantKey },
  });
};

export const updateTenantInboxMessage = async (
  tenantKey: string,
  inboxMessageId: number,
  payload: InboxUpdatePayload,
) => {
  await csrf();
  return http.patch(`api/admin/inbox/${inboxMessageId}`, {
    tenantKey,
    ...payload,
  });
};

export const deleteTenantInboxMessage = async (
  tenantKey: string,
  inboxMessageId: number,
) => {
  await csrf();
  return http.delete(`api/admin/inbox/${inboxMessageId}`, {
    params: { tenantKey },
  });
};
