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
  colors: Palette; // single palette only
  custom_css?: string | null;
};

type ThemeTokensWire = string | { light: unknown; dark: unknown };

type BootstrapResponse = {
  data: {
    tenant: { key: string; name: string };
    theme: {
      id?: string; // optional from API
      name?: string; // optional from API
      mode_default: "light" | "dark";
      tokens: ThemeTokensWire;
      custom_css: string | null;
    };
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

function parseTokens(
  tokensRaw: ThemeTokensWire,
): { light: Palette; dark: Palette } | null {
  let parsed: unknown = tokensRaw;

  if (typeof tokensRaw === "string") {
    try {
      parsed = JSON.parse(tokensRaw);
    } catch {
      return null;
    }
  }

  if (!isRecord(parsed)) return null;
  const light = (parsed as any).light;
  const dark = (parsed as any).dark;
  if (!isRecord(light) || !isRecord(dark)) return null;

  // We trust API provides correct keys (hex strings). Cast to Palette.
  return { light: light as Palette, dark: dark as Palette };
}

// ---- thunk ----
export const fetchTenantBootstrap = createAsyncThunk(
  "tenantBootstrap/fetch",
  async (tenantKey: string, { rejectWithValue }) => {
    try {
      const res = await http.get("/api/company/bootstrap", {
        params: { tenantKey },
      });

      const data = (res as any).data.data;

      const tokensRaw = data.theme.tokens;
      const parsed =
        typeof tokensRaw === "string" ? JSON.parse(tokensRaw) : tokensRaw;

      const themeRecord: ThemeRecord = {
        id: parsed?.id ?? "midnight",
        name: parsed?.name ?? "Midnight",
        colors: (parsed?.colors ?? {}) as Palette, // hex colors
        custom_css: data.theme.custom_css,
      };

      return {
        tenant: data.tenant,
        mode_default: data.theme.mode_default,
        themes: [themeRecord],
        activeThemeId: themeRecord.id,
        custom_css: data.theme.custom_css,
      };
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
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
