import { csrf, http } from "../config/http";

export type TenantMediaPayload = {
  tenantKey: string;
  label?: string;
  file: File;
};

export const getAllMedia = async (tenantKey: string) => {
  try {
    const result = await http.get("api/tenant/media", {
      params: { tenantKey },
    });
    if (result.data) return result;
    return false;
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : "Failed to load media");
  }
};

export const uploadMedia = async ({ tenantKey, label, file }: TenantMediaPayload) => {
  try {
    await csrf();
    const formData = new FormData();
    formData.append("tenantKey", tenantKey);
    formData.append("file", file);
    if (label?.trim()) {
      formData.append("label", label.trim());
    }

    const result = await http.post("api/tenant/media", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (result.data) return result;
    return false;
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : "Failed to upload media");
  }
};

export const deleteMedia = async (tenantKey: string, mediaId: number) => {
  try {
    await csrf();
    const result = await http.delete(`api/tenant/media/${mediaId}`, {
      params: { tenantKey },
    });
    if (result.data) return result;
    return false;
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : "Failed to delete media");
  }
};
