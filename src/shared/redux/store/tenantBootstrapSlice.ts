// src/store/slices/tenantBootstrapSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { http } from "@/src/api/config/http";

type ThemeMode = "light" | "dark" | "system";

type Palette = {
  bg: string;
  fg: string;
  primary: string;
  secondary: string;
  menu: string;
  icons: string;
  content: string;
  info: string;
  toast: string;

  border?: string;
  muted?: string;
  radius?: string; // e.g. "16px"
};

type ThemeRecord = {
  id: string;
  name: string;
  colors: Palette | { light?: Palette; dark?: Palette };
  custom_css?: string | null;
};

type BootstrapData = {
  tenant: { key: string; name: string };
  theme: {
    mode_default: "light" | "dark";
    tokens: unknown;
    custom_css: string | null;
  };
};

export type State = {
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;

  tenant?: { key: string; name: string };

  appearance: {
    mode: ThemeMode; // user's choice
    mode_default: "light" | "dark"; // tenant default
    activeThemeId: string; // selected theme id
    themes: ThemeRecord[]; // all themes from DB
    overrides?: Partial<Palette>;
    custom_css?: string | null; // active theme css (optional)
  };
};

const initialState: State = {
  status: "idle",
  appearance: {
    mode: "system",
    mode_default: "light",
    activeThemeId: "midnight",
    themes: [],
    overrides: {},
    custom_css: null,
  },
};

// ---- helpers ----
function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

// ---- thunk ----
export const fetchTenantBootstrap = createAsyncThunk(
  "tenantBootstrap/fetch",
  async (tenantKey: string, { rejectWithValue }) => {
    try {
      const res = await http.get<{ data: BootstrapData }>("/api/company/bootstrap", {
        params: { tenantKey },
      });

      const data = res.data.data;

      const tokensRaw = data.theme.tokens;
      const parsed =
        typeof tokensRaw === "string" ? JSON.parse(tokensRaw) : tokensRaw;

      const themePayload = isRecord(parsed) ? parsed : {};
      const colors = themePayload.colors ?? (
        themePayload.light || themePayload.dark
          ? { light: themePayload.light, dark: themePayload.dark }
          : themePayload
      );

      const themeRecord: ThemeRecord = {
        id: typeof themePayload.id === "string" ? themePayload.id : "midnight",
        name: typeof themePayload.name === "string" ? themePayload.name : "Midnight",
        colors: colors as ThemeRecord["colors"],
        custom_css: data.theme.custom_css,
      };

      return {
        tenant: data.tenant,
        mode_default: data.theme.mode_default,
        themes: [themeRecord],
        activeThemeId: themeRecord.id,
        custom_css: data.theme.custom_css,
      };
    } catch (err: unknown) {
      const error = isRecord(err) ? err : {};
      const response = isRecord(error.response) ? error.response : {};
      const responseData = isRecord(response.data) ? response.data : {};
      const message =
        (typeof responseData.message === "string" && responseData.message) ||
        (typeof error.message === "string" && error.message) ||
        "Bootstrap request failed";
      return rejectWithValue(message);
    }
  },
);

// ---- slice ----
const slice = createSlice({
  name: "tenantBootstrap",
  initialState,
  reducers: {
    setAppearanceMode(s, a: PayloadAction<ThemeMode>) {
      s.appearance.mode = a.payload;
    },
    setActiveThemeId(s, a: PayloadAction<string>) {
      s.appearance.activeThemeId = a.payload;
    },
    setOverrides(s, a: PayloadAction<Partial<Palette>>) {
      s.appearance.overrides = a.payload;
    },
    clearOverrides(s) {
      s.appearance.overrides = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTenantBootstrap.pending, (s) => {
        s.status = "loading";
        s.error = undefined;
      })
      .addCase(fetchTenantBootstrap.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.tenant = a.payload.tenant;

        s.appearance.mode_default = a.payload.mode_default;
        s.appearance.themes = a.payload.themes;
        s.appearance.activeThemeId = a.payload.activeThemeId;
        s.appearance.custom_css = a.payload.custom_css ?? null;
      })
      .addCase(fetchTenantBootstrap.rejected, (s, a) => {
        s.status = "failed";
        s.error = (a.payload as string) ?? "Unknown error";
      });
  },
});

export const {
  setAppearanceMode,
  setActiveThemeId,
  setOverrides,
  clearOverrides,
} = slice.actions;

export default slice.reducer;
