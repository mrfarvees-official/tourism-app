import { csrf, http } from "@/src/api/config/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { redirectToTenantIfNeeded } from "@/src/utils/tenant";
import { getDeviceInfo } from "@/src/utils/device";

type Tenant = {
  id: number;
  key: string;
  name: string;
  role: string;
  status: string;
  joined_at: string;
};

type User = {
  id?: number;
  name: string;
  email: string;
  tenants: Tenant[];
  tenant_key?: string;
};

type LoginResponse = {
  ok: boolean;
  user: User;
  errors?: Record<string, string[]>;
  message?: string;
};

type MeResponse = {
  ok: boolean;
  user: User;
};

/**
 * FIXED: split "auth truth" vs "request state"
 * - authStatus: only changes when auth truth changes
 * - requestStatus: only for loading/errors
 */
type AuthState = {
  user: User | null;
  authStatus: "unknown" | "authenticated" | "guest";
  requestStatus: "idle" | "loading" | "error";
  error: string | null;
  meChecked: boolean;
};

const initialState: AuthState = {
  user: null,
  authStatus: "unknown",
  requestStatus: "idle",
  error: null,
  meChecked: false,
};

export const authMe = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const device =
        typeof window !== "undefined" ? await getDeviceInfo() : null;

      const { data } = await http.get<MeResponse>("/api/me", {
        params: {
          device_name: device?.deviceName,
          browser_name: device?.browser,
          os_name: device?.os,
          device_type: device?.deviceType,
        },
      });
      
      if (!data?.ok || !data?.user) return rejectWithValue("Not authenticated");
      return data.user;
    } catch {
      return rejectWithValue("Not authenticated");
    }
  },
);

export const login = createAsyncThunk<
  User,
  { email: string; password: string; remember?: boolean },
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const device = typeof window !== "undefined" ? await getDeviceInfo() : null;

    await csrf();
    const { data } = await http.post<LoginResponse>("/auth/login", {
      ...payload,
      device_name: device?.deviceName, // "Brave on Windows"
      browser_name: device?.browser, // "Brave"
      os_name: device?.os, // "Windows"
      device_type: device?.deviceType, // "desktop"
    });

    if (!data?.ok || !data?.user) {
      return rejectWithValue("Unexpected login response.");
    }

    return data.user;
  } catch (e: unknown) {
    const error = e as {
      response?: {
        status?: number;
        data?: { message?: string; errors?: Record<string, string[]> };
      };
    };
    const status = error?.response?.status;

    if (status === 302) {
      return rejectWithValue(
        "Server redirected the login request (302). Remove 'guest' middleware or return JSON for already-authenticated users.",
      );
    }

    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.errors?.email?.[0] ||
      error?.response?.data?.errors?.password?.[0] ||
      (status === 419
        ? "CSRF token mismatch. Call /sanctum/csrf-cookie first."
        : null) ||
      "Login failed";

    return rejectWithValue(msg);
  }
});

export const register = createAsyncThunk<
  User,
  {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    tenantKey?: string;
  },
  { rejectValue: string }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const device = typeof window !== "undefined" ? await getDeviceInfo() : null;
    await csrf();
    const { data } = await http.post<LoginResponse>("/auth/register", {
      ...payload,
      tenantKey: payload.tenantKey?.trim() || undefined,
      device_name: device?.deviceName, // "Brave on Windows"
      browser_name: device?.browser, // "Brave"
      os_name: device?.os, // "Windows"
      device_type: device?.deviceType, // "desktop"
    });

    // If your backend doesn't return { ok, user } for register, adjust here.
    if (!data?.ok || !data?.user) {
      return rejectWithValue("Unexpected register response.");
    }

    return data.user;
  } catch (e: unknown) {
    const error = e as { response?: { data?: { message?: string } } };
    const msg = error?.response?.data?.message || "Register failed";
    return rejectWithValue(msg);
  }
});

export const logout = createAsyncThunk<
  void,
  { redirectTo?: string } | void,
  { rejectValue: string }
>(
  "auth/logout",
  async (_payload, { rejectWithValue }) => {
    try {
      await csrf();
      await http.post("/auth/logout");
    } catch {
      return rejectWithValue("Logout failed");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
      // If you want to clear error requestStatus too:
      if (state.requestStatus === "error") state.requestStatus = "idle";
    },
    markAuthCheckedAsGuest(state) {
      state.user = null;
      state.authStatus = "guest";
      state.requestStatus = "idle";
      state.error = null;
      state.meChecked = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // -----------------------
      // ME (session check)
      // -----------------------
      .addCase(authMe.pending, (s) => {
        s.requestStatus = "loading";
        s.error = null;
      })
      .addCase(authMe.fulfilled, (s, a) => {
        s.user = a.payload;
        s.authStatus = "authenticated";
        s.requestStatus = "idle";
        s.meChecked = true;
      })
      .addCase(authMe.rejected, (s) => {
        s.user = null;
        s.authStatus = "guest";
        s.requestStatus = "idle";
        s.meChecked = true;
      })

      // -----------------------
      // LOGIN
      // -----------------------
      .addCase(login.pending, (s) => {
        s.requestStatus = "loading";
        s.error = null;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.user = a.payload;
        s.authStatus = "authenticated";
        s.requestStatus = "idle";

        if (typeof window !== "undefined") {
          redirectToTenantIfNeeded(a.payload, "/");
        }
      })
      .addCase(login.rejected, (s, a: { payload?: string }) => {
        s.user = null;
        s.authStatus = "guest"; // auth truth after failed login
        s.requestStatus = "error";
        s.error = a.payload || "Login failed";
      })

      // -----------------------
      // REGISTER
      // -----------------------
      .addCase(register.pending, (s) => {
        s.requestStatus = "loading";
        s.error = null;
      })
      .addCase(register.fulfilled, (s, a) => {
        s.user = a.payload;
        s.authStatus = "authenticated";
        s.requestStatus = "idle";

        if (typeof window !== "undefined") {
          redirectToTenantIfNeeded(a.payload, "/");
        }
      })
      .addCase(register.rejected, (s, a: { payload?: string }) => {
        s.requestStatus = "error";
        s.error = a.payload || "Register failed";
      })

      // -----------------------
      // LOGOUT
      // -----------------------
      .addCase(logout.pending, (s) => {
        s.requestStatus = "loading";
        s.error = null;
      })
      .addCase(logout.fulfilled, (s) => {
        s.user = null;
        s.authStatus = "guest";
        s.requestStatus = "idle";
        s.error = null;
      })
      .addCase(logout.rejected, (s, a: { payload?: string }) => {
        // If logout fails, keep user as-is, but show error
        s.requestStatus = "error";
        s.error = a.payload || "Logout failed";
      });
  },
});

export const { clearAuthError, markAuthCheckedAsGuest } = authSlice.actions;
export default authSlice.reducer;

/**
 * Component usage (direct)
 *
 * const { authStatus, requestStatus, user } = useSelector((s:any)=>s.auth);
 * const isAuthenticated = authStatus === "authenticated";
 * const isChecking = authStatus === "unknown" && requestStatus === "loading";
 */
