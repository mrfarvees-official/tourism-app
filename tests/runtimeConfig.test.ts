import { afterEach, describe, expect, it } from "vitest";
import { applyTenantTheme, applyTenantThemeInline, resetToGlobalTheme } from "../src/utils/runtimeConfig";

afterEach(() => {
  resetToGlobalTheme();
});

describe("runtime theme config", () => {
  it("writes inline theme variables to the root element", () => {
    applyTenantThemeInline({
      bg: "#ffffff",
      fg: "12 34 56",
      radius: "1rem",
      icons: "#112233",
    });

    expect(document.documentElement.style.getPropertyValue("--bg")).toBe("255 255 255");
    expect(document.documentElement.style.getPropertyValue("--fg")).toBe("12 34 56");
    expect(document.documentElement.style.getPropertyValue("--radius")).toBe("1rem");
    expect(document.documentElement.style.getPropertyValue("--icons")).toBe("17 34 51");
  });

  it("creates a scoped style tag for light and dark theme tokens", () => {
    applyTenantTheme({
      light: {
        bg: "#000000",
        fg: "#ffffff",
        icon: "#abcdef",
      },
      dark: {
        bg: "#111111",
        fg: "#eeeeee",
      },
    });

    const style = document.getElementById("tenant-runtime-theme");
    expect(style).not.toBeNull();
    expect(style?.textContent).toContain(":root");
    expect(style?.textContent).toContain("html[data-theme=\"dark\"]");
    expect(style?.textContent).toContain("--icons: 171 205 239;");
  });

  it("keeps existing theme styles untouched when no tokens are provided", () => {
    applyTenantTheme({
      bg: "#123456",
    });

    const before = document.getElementById("tenant-runtime-theme")?.textContent;
    applyTenantTheme({});
    const after = document.getElementById("tenant-runtime-theme")?.textContent;

    expect(after).toBe(before);
  });

  it("resets runtime theme state and removes theme artifacts", () => {
    document.documentElement.style.setProperty("--bg", "1 2 3");
    document.documentElement.dataset.theme = "dark";
    document.documentElement.classList.add("dark");

    const style = document.createElement("style");
    style.id = "tenant-runtime-theme";
    document.head.appendChild(style);

    const custom = document.createElement("style");
    custom.id = "tenant-custom-css";
    document.head.appendChild(custom);

    resetToGlobalTheme();

    expect(document.documentElement.style.getPropertyValue("--bg")).toBe("");
    expect(document.getElementById("tenant-runtime-theme")).toBeNull();
    expect(document.getElementById("tenant-custom-css")).toBeNull();
    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
