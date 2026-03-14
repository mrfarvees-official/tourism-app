// src/utils/runtimeConfig.ts

function hexToRgbTriplet(hex: string) {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `${r} ${g} ${b}`;
}

export type ThemeTokens = Record<string, string>;

function toRgbTriplet(v: string) {
  const t = v.trim();
  if (/^\d+\s+\d+\s+\d+$/.test(t)) return t;
  if (t.startsWith("#")) return hexToRgbTriplet(t);
  return t;
}

/**
 * Inline apply (no <style> tag). Writes vars directly on <html>.
 * Edited to support your palette keys:
 * bg, fg, primary, secondary, menu, icons, content, info, toast (+ border, muted, radius)
 */
export function applyTenantThemeInline(tokens?: ThemeTokens) {
  if (!tokens) return;

  const el = document.documentElement;

  // Prefer "icons", fallback to "icon"
  const iconsValue = tokens.icons ?? tokens.icon;

  const entries: Array<[string, string | undefined, boolean?]> = [
    ["bg", tokens.bg, true],
    ["fg", tokens.fg, true],
    ["primary", tokens.primary, true],
    ["secondary", tokens.secondary, true],
    ["hover", tokens.hover, true],
    ["hover_text", tokens.hover_text, true],
    ["border", tokens.border, true],
    ["muted", tokens.muted, true],
    ["menu", tokens.menu, true],
    ["nav", tokens.nav, true],
    ["title", tokens.title, true],
    ["input", tokens.input, true],
    ["button", tokens.button, true],
    ["accent", tokens.accent, true],
    ["content", tokens.content, true],
    ["info", tokens.info, true],
    ["warn", tokens.warn, true],
    ["success", tokens.success, true],
    ["danger", tokens.danger, true],
    ["toast", tokens.toast, true],
    ["icons", iconsValue, true],

    // Not a color
    ["radius", tokens.radius, false],
  ];

  for (const [k, v, isColor] of entries) {
    if (!v) continue;
    const value = isColor ? toRgbTriplet(v) : v.trim();
    el.style.setProperty(`--${k}`, value);
  }
}

function tokensToCssVars(tokens?: ThemeTokens) {
  if (!tokens) return "";

  const iconsValue = tokens.icons ?? tokens.icon;

  const pairs: Array<[string, string | undefined, boolean?]> = [
    ["bg", tokens.bg, true],
    ["fg", tokens.fg, true],
    ["primary", tokens.primary, true],
    ["secondary", tokens.secondary, true],
    ["hover", tokens.hover, true],
    ["hover_text", tokens.hover_text, true],
    ["border", tokens.border, true],
    ["muted", tokens.muted, true],
    ["nav", tokens.nav, true],
    ["title", tokens.title, true],
    ["input", tokens.input, true],
    ["button", tokens.button, true],
    ["accent", tokens.accent, true],
    ["content", tokens.content, true],
    ["info", tokens.info, true],
    ["success", tokens.success, true],
    ["warn", tokens.warn, true],
    ["danger", tokens.danger, true],
    ["toast", tokens.toast, true],
    ["icons", iconsValue, true],

    // Not a color
    ["radius", tokens.radius, false],
  ];

  return pairs
    .filter(([, v]) => !!v)
    .map(([k, v, isColor]) => {
      if (!v) return "";
      const value = isColor ? toRgbTriplet(v) : v.trim();
      return `  --${k}: ${value};`;
    })
    .filter(Boolean)
    .join("\n");
}

type ThemeInput = ThemeTokens | { light?: ThemeTokens; dark?: ThemeTokens };

function isModeObject(
  x: ThemeInput
): x is { light?: ThemeTokens; dark?: ThemeTokens } {
  return typeof x === "object" && x !== null && ("light" in x || "dark" in x);
}

/**
 * Writes CSS variables in a scoped way so switching works:
 * - light vars -> :root
 * - dark vars  -> html[data-theme="dark"]
 *
 * Accepts either:
 *  - applyTenantTheme(tokens)  // old (single mode)
 *  - applyTenantTheme({ light, dark }) // new
 *
 * Edited to support your palette keys + icon/icons compatibility.
 */
export function applyTenantTheme(input: ThemeInput) {
  const id = "tenant-runtime-theme";
  let style = document.getElementById(id) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = id;
    document.head.appendChild(style);
  }

  let light: ThemeTokens | undefined;
  let dark: ThemeTokens | undefined;

  if (isModeObject(input)) {
    light = input.light;
    dark = input.dark;
  } else {
    // Backward compatible: treat provided tokens as light
    light = input;
    dark = undefined;
  }

  const lightCss = tokensToCssVars(light);
  const darkCss = tokensToCssVars(dark);

  // If nothing to apply, don't wipe out existing theme styles
  if (!lightCss && !darkCss) return;

  style.textContent = `
:root {
${lightCss}
}
${darkCss ? `
html[data-theme="dark"] {
${darkCss}
}
`.trim() : ""}
`.trim();
}

export function resetToGlobalTheme() {
  const el = document.documentElement;

  // Remove inline vars written by applyTenantThemeInline
  const keys = [
    "bg","fg","primary","secondary","hover","hover_text","border","muted",
    "menu","nav","title","input","button","accent","content","info","warn",
    "danger","toast","icons","radius",
  ] as const;

  for (const k of keys) el.style.removeProperty(`--${k}`);

  // Remove any runtime theme style tag if you also use applyTenantTheme()
  const runtimeStyle = document.getElementById("tenant-runtime-theme");
  if (runtimeStyle) runtimeStyle.remove();

  // Remove tenant custom css
  const custom = document.getElementById("tenant-custom-css");
  if (custom) custom.remove();

  // Reset flags
  delete el.dataset.theme;
  el.classList.remove("dark");
}