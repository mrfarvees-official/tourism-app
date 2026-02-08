"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Palette, PresetId, PRESETS, TokenKey, TOKENS } from "./types";
import { clampHex, contrastRatio, pickReadableText } from "./utils";
import { FaRegCopy } from "react-icons/fa6";
import { IoMdRefresh } from "react-icons/io";
import { useRouter } from "next/navigation";
import PreviewComponent from "./Preview";
import { useTheme } from "@/src/api/hooks/useTheme";

export default function General() {
  const router = useRouter();

  const [tenantKey, setTenantKey] = useState<string | null>(null);
  const [manualPresetId, setManualPresetId] = useState<PresetId | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathParts = window.location.pathname.split("/");
      const tenant = pathParts[2];
      setTenantKey(tenant); // Set tenantKey after checking that it's the client-side
    }
  }, []);

  const { loading, errors, result, currentTheme, setPayload, clearState } =
    useTheme(tenantKey!);
  const [presetId, setPresetId] = useState<PresetId>("midnight");
  const [customize, setCustomize] = useState<boolean>(true);
  const [overrides, setOverrides] = useState<Partial<Palette>>({});
  const isRequestInProgress = useRef(false);
  const preset = PRESETS[presetId].palette;

  useEffect(() => {
    if (loading || !currentTheme || !currentTheme.tokens) return;

    try {
      const themeData = JSON.parse(currentTheme.tokens);

      if (!themeData || !themeData.colors) {
        console.error("Colors are not available in the theme data.");
        return;
      }

      // Only set initial presetId from currentTheme if manualPresetId is not set (i.e., the user hasn't selected one)
      if (!manualPresetId) {
        setPresetId(themeData.id);
        setManualPresetId(themeData.id); // Store the initial presetId from currentTheme
      }

      // Apply the overrides based on currentTheme colors
      const newOverrides: Partial<Palette> = {};
      Object.keys(themeData.colors).forEach((key) => {
        const colorKey = key as TokenKey;
        const currentColor = themeData.colors[colorKey];
        const presetColor = preset[colorKey];

        if (currentColor !== presetColor) {
          newOverrides[colorKey] = currentColor; // Only override if there's a difference
        }
      });

      setOverrides(newOverrides);
    } catch (error) {
      console.error("Failed to parse theme tokens:", error);
    }
  }, [currentTheme, loading, manualPresetId, customize]);

  const resolved: Palette = useMemo(() => {
    const out: any = { ...preset };
    for (const key of Object.keys(overrides) as TokenKey[]) {
      const v = overrides[key];
      if (v) out[key] = v; // Apply any overrides
    }
    return out as Palette;
  }, [preset, presetId, overrides]);

  const allPresetColors = useMemo(() => {
    return Object.entries(PRESETS).map(([presetId, p]) => ({
      presetId,
      name: p.name,
      colors: p.palette, //   ONLY colors (bg/fg/primary/secondary/menu/icons/content/info/toast)
    }));
  }, []);

  //   final payload (ONLY colors + minimal config)
  const buildPayload = () => ({
    id: presetId,
    name: PRESETS[presetId].name,
    colors: resolved,
  });

  const applyTheme = async (payload: ReturnType<typeof buildPayload>) => {
    if (isRequestInProgress.current) {
      // Prevent the request if another request is already in progress
      return;
    }

    isRequestInProgress.current = true; // Set the request as in progress

    try {
      setPayload({
        tenantKey: tenantKey!,
        tokens: JSON.stringify(payload),
      });
      // Simulate an API call delay for demonstration (remove this in real use case)
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
      console.log("Theme applied successfully.");
    } catch (error) {
      console.error("Failed to apply theme:", error);
    } finally {
      isRequestInProgress.current = false; // Reset the request state when done
    }
  };

  const onApply = async () => {
    const payload = buildPayload();
    try {
      console.log("PAYLOAD:", payload);
      await applyTheme(payload);

      // Wait for loading to finish (check if loading is false)
      if (!loading) {
        // Force reload the page once loading is finished
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to apply theme.");
    }
  };

  const effectiveValue = (key: TokenKey) => resolved[key];

  const setToken = (key: TokenKey, value: string) => {
    const normalized = clampHex(value);
    if (!normalized) return;

    setOverrides((prev) => {
      // If not customizing, enable customization
      if (!customize) setCustomize(true);

      const next = { ...prev, [key]: normalized };

      // If the new color is the same as the preset, delete the override
      if (normalized === preset[key]) {
        delete next[key];
      }
      return next;
    });
  };

  const clearTokenOverride = (key: TokenKey) => {
    setOverrides((prev) => {
      const next = { ...prev };
      delete (next as any)[key];
      return next;
    });
  };

  const resetAll = () => setOverrides({});

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const exportJson = async () => {
    const payload = {
      appearance: {
        palette: { presetId, overrides },
      },
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "appearance-settings.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImportClick = () => fileInputRef.current?.click();

  const importJson = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      const nextPresetId: PresetId | undefined =
        parsed?.appearance?.palette?.presetId;
      const nextOverrides: Partial<Palette> | undefined =
        parsed?.appearance?.palette?.overrides;

      if (nextPresetId && PRESETS[nextPresetId]) setPresetId(nextPresetId);
      if (nextOverrides && typeof nextOverrides === "object") {
        const cleaned: Partial<Palette> = {};
        for (const k of Object.keys(nextOverrides) as TokenKey[]) {
          const v = (nextOverrides as any)[k];
          const normalized = typeof v === "string" ? clampHex(v) : "";
          if (normalized) cleaned[k] = normalized;
        }
        setOverrides(cleaned);
        setCustomize(true);
      }
    } catch {
      {
        /** TODO: Edit with toast later. */
      }
      alert("Import failed: invalid JSON.");
    }
  };

  const checks = useMemo(() => {
    const pairs: Array<{ name: string; fg: string; bg: string }> = [
      // Default color checks
      { name: "fg on bg", fg: resolved.fg, bg: resolved.bg },
      { name: "fg on nav", fg: resolved.fg, bg: resolved.nav },
      { name: "fg on content", fg: resolved.fg, bg: resolved.content },
      { name: "icons on menu", fg: resolved.icons, bg: resolved.menu },
      { name: "fg on menu", fg: resolved.fg, bg: resolved.menu },
      { name: "fg on primary", fg: resolved.fg, bg: resolved.primary },
      { name: "fg on secondary", fg: resolved.fg, bg: resolved.secondary },
      { name: "fg on toast", fg: resolved.fg, bg: resolved.toast },
      { name: "fg on heading", fg: resolved.fg, bg: resolved.title },
      { name: "fg on input", fg: resolved.fg, bg: resolved.input },
      { name: "fg on button", fg: resolved.fg, bg: resolved.button },
      { name: "fg on accent", fg: resolved.fg, bg: resolved.accent },
      { name: "fg on border", fg: resolved.fg, bg: resolved.border },
      { name: "fg on hover", fg: resolved.fg, bg: resolved.hover },
      { name: "button on primary", fg: resolved.button, bg: resolved.primary },
      {
        name: "button on secondary",
        fg: resolved.button,
        bg: resolved.secondary,
      },
    ];

    return pairs.map((p) => {
      const ratio = contrastRatio(p.fg, p.bg);
      const ok = ratio != null ? ratio >= 4.5 : false;
      return { ...p, ratio, ok };
    });
  }, [resolved]);

  const anyContrastFail = checks.some((c) => !c.ok);

  const previewStyle = useMemo(() => {
    const cssVars: React.CSSProperties = {
      // @ts-expect-error CSS vars
      "--c-bg": resolved.bg,
      "--c-fg": resolved.fg,
      "--c-primary": resolved.primary,
      "--c-secondary": resolved.secondary,
      "--c-menu": resolved.menu,
      "--c-icons": resolved.icons,
      "--c-content": resolved.content,
      "--c-info": resolved.info,
      "--c-toast": resolved.toast,
      "--c-heading": resolved.title, // Added heading
      "--c-input": resolved.input, // Added input
      "--c-button": resolved.button, // Added button
      "--c-border": resolved.border, // Added border
      "--c-accent": resolved.accent, // Added accent
    };
    return cssVars;
  }, [resolved]);

  return (
    <div className="mt-3">
      <form action="">
        <div className="w-full max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-title">
                General Settings · Appearance
              </h2>
              <p className="text-sm text-title">
                Choose a preset palette and optionally override individual
                tokens.
              </p>
            </div>
            <div className="p-5">
              <button
                type="button"
                onClick={onApply}
                className="bg-hover px-3 py-2 rounded-xl text-hover_text"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* LEFT: Controls */}
            <div className="rounded-2xl border border-border text-fg/50 bg-content shadow-sm overflow-hidden">
              <div className="p-4 md:p-5 border-b border-border">
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
                  <div>
                    <div className="text-base text-fg font-semibold">
                      Appearance
                    </div>
                    <div className="text-sm text-fg/50">
                      Palette configuration
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-2 rounded-xl border border-border text-fg hover:bg-hover hover:text-hover_text hover:border border-border-hover text-sm"
                      onClick={resetAll}
                      type="button"
                      title="Clear all token overrides"
                    >
                      Reset overrides
                    </button>
                    <button
                      className="px-3 py-2 rounded-xl border border-border text-fg hover:bg-hover hover:text-hover_text hover:border border-border-hover text-sm"
                      onClick={exportJson}
                      type="button"
                    >
                      Export
                    </button>
                    <button
                      className="px-3 py-2 rounded-xl border border-border text-fg hover:bg-hover hover:text-hover_text hover:border border-border-hover text-sm"
                      onClick={onImportClick}
                      type="button"
                    >
                      Import
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/json"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) importJson(f);
                        e.currentTarget.value = "";
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-5 space-y-5">
                {/* Palette selection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm text-fg font-semibold">
                        Color palette
                      </div>
                      <div className="text-xs text-fg/50">
                        Pick a preset, then customize tokens
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-fg">
                      <input
                        type="checkbox"
                        checked={customize}
                        onChange={(e) => setCustomize(e.target.checked)}
                        className="h-4 w-4 rounded border border-border-border border-border "
                      />
                      Customize
                    </label>
                  </div>

                  <div className="flex flex-col md:flex-row gap-2">
                    <select
                      className="w-full md:w-auto flex-1 px-3 py-2 rounded-xl border border-border text-fg/50 bg-content text-sm"
                      value={presetId}
                      onChange={(e) => {
                        const next = e.target.value as PresetId;
                        if (next !== presetId) {
                          setPresetId(next);
                          setOverrides({}); // Reset overrides
                        }
                      }}
                    >
                      {Object.entries(PRESETS).map(([id, p]) => (
                        <option key={id} value={id}>
                          {p.name}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="px-3 py-2 rounded-xl border border-border text-fg hover:bg-hover hover:text-hover_text hover:border border-border-hover text-sm"
                      onClick={() => {
                        // Apply preset and clear overrides
                        setOverrides({});
                      }}
                    >
                      Apply preset (clear overrides)
                    </button>
                  </div>
                </div>

                {/* Contrast warnings */}
                <div className="rounded-2xl border border-border text-fg/50 bg-content p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm text-fg font-semibold">
                        Accessibility checks
                      </div>
                      <div className="text-xs text-fg/50">
                        WCAG AA target: 4.5:1 for normal text
                      </div>
                    </div>
                    <span
                      className={[
                        "text-xs px-2 py-1 rounded-full border border-border",
                        anyContrastFail
                          ? "border border-border-amber-300 bg-amber-100 text-amber-900"
                          : "border border-border-emerald-300 bg-emerald-100 text-emerald-900",
                      ].join(" ")}
                    >
                      {anyContrastFail ? "Needs attention" : "Looks good"}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {checks.map((c) => (
                      <div
                        key={c.name}
                        className="flex items-center justify-between text-xs"
                      >
                        <div className="text-fg/80">{c.name}</div>
                        <div className="flex items-center gap-2">
                          <span className="tabular-nums text-fg/80">
                            {c.ratio == null ? "—" : c.ratio.toFixed(2) + ":1"}
                          </span>
                          <span
                            className={[
                              "px-2 py-0.5 rounded-full border border-border",
                              c.ok
                                ? "border border-border-emerald-300 bg-emerald-100 text-emerald-900"
                                : "border border-border-amber-300 bg-amber-100 text-amber-900",
                            ].join(" ")}
                          >
                            {c.ok ? "OK" : "Low"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Token editors */}
                <div className="space-y-2">
                  <div className="text-sm text-fg font-semibold">Tokens</div>
                  <div className="text-xs text-fg/50 text-slate-600">
                    Toggle “Customize” to edit. Use “Auto” to inherit from
                    preset.
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {TOKENS.map(({ key, label, hint }) => {
                      const value = effectiveValue(key);
                      const isOverridden = overrides[key] != null;

                      return (
                        <div
                          key={key}
                          className="rounded-2xl border border-border text-fg/50 bg-content p-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-sm text-fg/80 font-semibold">
                                {label}
                              </div>
                              <div className="text-xs text-fg/50">{hint}</div>
                            </div>

                            <span
                              className={[
                                "text-[11px] px-2 py-0.5 rounded-full border border-border",
                                isOverridden
                                  ? "border border-border-primary bg-primary text-fg"
                                  : "text-fg/50 bg-content",
                              ].join(" ")}
                            >
                              {isOverridden ? "Custom" : "Auto"}
                            </span>
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <label className="relative inline-flex h-8 w-8 cursor-pointer items-center justify-center">
                              {/* The ONLY visible circle */}
                              <span
                                className="h-8 w-8 rounded-full border border-border text-fg/50"
                                style={{ backgroundColor: value }}
                              />

                              {/* Hidden native input (clickable overlay, not visible) */}
                              <input
                                type="color"
                                value={value}
                                disabled={!customize}
                                onChange={(e) => setToken(key, e.target.value)}
                                className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                                style={{
                                  appearance: "none",
                                  WebkitAppearance: "none",
                                  MozAppearance: "none",
                                }}
                                title="Pick color"
                              />
                            </label>

                            <input
                              value={value}
                              disabled={!customize}
                              onChange={(e) => {
                                const normalized = clampHex(e.target.value);
                                // allow typing without forcing while invalid; only commit when valid
                                if (normalized) setToken(key, normalized);
                              }}
                              className="flex-1 px-3 py-2 w-20 rounded-xl border border-border text-fg bg-content text-sm disabled:opacity-50"
                              placeholder="#RRGGBB"
                            />

                            <button
                              type="button"
                              className="px-3 py-2 rounded-xl border border-border group hover:bg-hover text-sm disabled:opacity-50"
                              disabled={!value}
                              onClick={() =>
                                navigator.clipboard?.writeText(value)
                              }
                            >
                              <FaRegCopy size={20} className="text-icons group-hover:text-hover_text" />
                            </button>

                            <button
                              type="button"
                              className="px-3 py-2 rounded-xl border border-border text-fg group hover:bg-hover text-sm disabled:opacity-50"
                              disabled={!customize || !isOverridden}
                              onClick={() => clearTokenOverride(key)}
                              title="Revert to preset"
                            >
                              <IoMdRefresh size={20} className="text-icons group-hover:text-hover_text" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Live preview */}
            <PreviewComponent
              resolved={resolved}
              presetId={presetId}
              overrides={overrides}
            />
          </div>

          {/* Integration hint */}
          <div className="mt-4 text-xs text-fg/70">
            Tip: wire <span className="font-mono">resolved</span> into your app
            theme (CSS variables, Tailwind config, or a theme provider).
            Export/Import is already compatible with the shown JSON structure.
          </div>
        </div>
      </form>
    </div>
  );
}
