export type TokenKey =
  | "bg"
  | "fg"
  | "nav"
  | "primary"
  | "secondary"
  | "menu"
  | "icons"
  | "content"
  | "info"
  | "warn"
  | "danger"
  | "toast"
  | "title"
  | "input"
  | "button"
  | "border"
  | "accent"
  | "hover"
  | "hover_text";

export type Palette = Record<TokenKey, string>;

export type PresetId = "midnight" | "ocean" | "sunset" | "slateLight";

export const TOKENS: Array<{ key: TokenKey; label: string; hint: string }> = [
  { key: "bg", label: "Background (bg)", hint: "App background" },
  { key: "fg", label: "Foreground (fg)", hint: "Default text color" },
  { key: "nav", label: "Navigation (nav)", hint: "Navigation bar color" },
  { key: "primary", label: "Primary", hint: "Primary buttons, highlights" },
  { key: "secondary", label: "Secondary", hint: "Secondary actions, accents" },
  { key: "menu", label: "Menu", hint: "Sidebar/nav surfaces" },
  { key: "icons", label: "Icons", hint: "Default icon tint" },
  { key: "content", label: "Content", hint: "Cards/panels/inputs background" },
  { key: "info", label: "Info", hint: "Info badges/links state" },
  { key: "warn", label: "Warning", hint: "Warning background" },
  { key: "danger", label: "Danger", hint: "Danger background" },
  { key: "toast", label: "Toast", hint: "Toast base background" },
  { key: "title", label: "Title", hint: "Heading color" },
  { key: "input", label: "Input", hint: "Input field background" },
  { key: "button", label: "Button", hint: "Button background" },
  { key: "border", label: "Border", hint: "Border color" },
  { key: "hover", label: "Hover", hint: "Hover background" },
  { key: "hover_text", label: "Hover Text", hint: "Hover text color" },
  { key: "accent", label: "Accent", hint: "Toast base background" },
];

export const PRESETS: Record<PresetId, { name: string; palette: Palette }> = {
  midnight: {
    name: "Midnight",
    palette: {
      bg: "#0B0F19",
      fg: "#E5E7EB",
      hover: "#3B82F6",
      hover_text: "#FFFFFF",
      nav: "#0B0F19",
      primary: "#3B82F6", // Light blue
      secondary: "#10B981", // Bright green
      menu: "#1E293B", // Lighter shade for menu
      icons: "#C7D2FE",
      content: "#111827",
      info: "#38BDF8",
      warn: "#F5AF36",
      danger: "#EB4034",
      toast: "#1F2937",
      title: "#E5E7EB",
      input: "#111827",
      button: "#3B82F6",
      border: "#1E293B", // Lighter border for contrast
      accent: "#10B981", // Bright green
    },
  },
  ocean: {
    name: "Ocean",
    palette: {
      bg: "#06131F",
      fg: "#E6F0FF",
      hover: "#06B6D4",
      hover_text: "#FFFFFF",
      nav: "#06131F",
      primary: "#06B6D4", // Teal blue
      secondary: "#0D9488", // Strong teal green
      menu: "#0F2533", // Darker shade for contrast
      icons: "#A5F3FC",
      content: "#0B2236",
      info: "#22D3EE",
      warn: "#F5AF36",
      danger: "#EB4034",
      toast: "#0B2A3F",
      title: "#E6F0FF",
      input: "#0B2236",
      button: "#06B6D4",
      border: "#0F2533", // Darker border for better distinction
      accent: "#0D9488", // Strong teal green
    },
  },
  sunset: {
    name: "Sunset",
    palette: {
      bg: "#140A0A",
      fg: "#FFF1F2",
      hover: "#D71F11",
      hover_text: "#FFFFFF",
      nav: "#140A0A",
      primary: "#D71F11", // Darker red
      secondary: "#F43F5E", // Strong pinkish tone
      menu: "#3B1F1F", // Darker shade for contrast
      icons: "#FED7AA",
      content: "#241010",
      info: "#FB7185",
      warn: "#F5AF36",
      danger: "#EB4034",
      toast: "#2A1414",
      title: "#FFF1F2",
      input: "#241010",
      button: "#D71F11",
      border: "#3B1F1F", // Darker border for contrast
      accent: "#F43F5E", // Strong pinkish tone
    },
  },
  slateLight: {
    name: "Slate Light",
    palette: {
      bg: "#F8FAFC",
      fg: "#0F172A",
      hover: "#1D4ED8",
      hover_text: "#FFFFFF",
      nav: "#F8FAFC",
      primary: "#1D4ED8", // Brighter blue for primary
      secondary: "#14B8A6", // Lighter teal for secondary
      menu: "#FFFFFF",
      icons: "#334155",
      content: "#FFFFFF",
      info: "#0284C7",
      warn: "#F5AF36",
      danger: "#EB4034",
      toast: "#0F172A",
      title: "#0F172A",
      input: "#FFFFFF",
      button: "#1D4ED8", // Bright blue button
      border: "#D1D5DB", // Lighter border for contrast
      accent: "#14B8A6", // Light teal accent
    },
  },
};
