import React, { useMemo } from "react";
import { FaRegBell, FaCog, FaBars } from "react-icons/fa"; // React Icons
import { Palette, PresetId, PRESETS, TokenKey } from "./types";

const PreviewComponent = ({
  resolved,
  presetId,
  overrides,
}: {
  resolved: Palette;
  presetId: PresetId;
  overrides: Partial<Palette>;
}) => {
  // Function to calculate readable text color based on background color
  const pickReadableText = (backgroundColor: string) => {
    const hexToRgb = (hex: string) => {
      let r: number, g: number, b: number;
      if (hex.length === 4) {
        // 3-digit hex
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
      } else {
        // 6-digit hex
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
      }
      return [r, g, b];
    };

    const [r, g, b] = hexToRgb(backgroundColor);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000000" : "#FFFFFF"; // Return black or white based on brightness
  };

  const previewStyle = useMemo(() => {
    const cssVars = {
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
      "--c-nav": resolved.nav, // Added nav for navigation bar color
    } as React.CSSProperties;
    return cssVars;
  }, [resolved]);

  return (
    <div className="rounded-2xl border border-border text-fg/50 bg-content shadow-sm overflow-hidden">
      <div className="p-4 md:p-5 text-fg/50">
        <div className="text-base text-fg font-semibold">Live Preview</div>
        <div className="text-sm text-fg/50">A fresh look at your resolved tokens</div>
      </div>

      <div className="p-4 md:p-5">
        <div
          style={previewStyle}
          className="rounded-2xl overflow-hidden border border-border text-fg/50"
        >
          {/* Outer app area */}
          <div
            className="min-h-[420px] p-4"
            style={{ background: "var(--c-bg)", color: "var(--c-fg)" }}
          >
            {/* Navigation Bar */}
            <div
              className="rounded-2xl p-3 flex items-center justify-between"
              style={{ background: "var(--c-nav)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-2xl flex items-center justify-center font-bold"
                  style={{
                    background: "var(--c-content)",
                    color: "var(--c-icons)",
                  }}
                  aria-label="App icon"
                >
                  <FaBars size={20} /> {/* React Icon for Menu */}
                </div>
                <div>
                  <div className="text-sm font-semibold">Menu</div>
                  <div className="text-xs opacity-80">Navigation bar using colors</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    background: "var(--c-info)",
                    color: pickReadableText(resolved.info),
                  }}
                >
                  New
                </span>
                <FaRegBell size={20} style={{ color: "var(--c-icons)" }} /> {/* React Icon for Notification */}
                <FaCog size={20} style={{ color: "var(--c-icons)" }} /> {/* React Icon for Settings */}
              </div>
            </div>

            {/* Content area */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="rounded-2xl p-4"
                style={{ background: "var(--c-content)" }}
              >
                <div className="text-sm font-semibold">Main Content</div>
                <div className="text-xs opacity-80 mt-1">
                  Text uses <code>fg</code> color and backgrounds use <code>content</code>.
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    className="px-3 py-2 rounded-xl text-sm font-semibold"
                    style={{
                      background: "var(--c-primary)",
                      color: pickReadableText(resolved.primary),
                    }}
                    type="button"
                  >
                    Primary Action
                  </button>
                  <button
                    className="px-3 py-2 rounded-xl text-sm font-semibold"
                    style={{
                      background: "var(--c-secondary)",
                      color: pickReadableText(resolved.secondary),
                    }}
                    type="button"
                  >
                    Secondary Action
                  </button>
                </div>

                <div className="mt-4">
                  <div className="text-xs opacity-80 mb-2">Sample Input</div>
                  <div
                    className="rounded-xl px-3 py-2 text-sm"
                    style={{
                      background: "var(--c-bg)",
                      border: "1px solid rgba(148,163,184,0.35)",
                      color: "var(--c-fg)",
                    }}
                  >
                    Enter Text...
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {/* Info Panel */}
                <div
                  className="rounded-2xl p-4"
                  style={{ background: "var(--c-content)" }}
                >
                  <div className="text-sm font-semibold">Info Panel</div>
                  <div className="text-xs opacity-80 mt-1">
                    Info badges and links use <code>info</code>.
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        background: "var(--c-info)",
                        color: pickReadableText(resolved.info),
                      }}
                    >
                      Info Badge
                    </span>
                    <span className="text-xs opacity-80">
                      Your palette is applied live.
                    </span>
                  </div>
                </div>

                {/* Toast Preview */}
                <div
                  className="rounded-2xl p-4 flex items-start justify-between gap-3"
                  style={{
                    background: "var(--c-toast)",
                    color: pickReadableText(resolved.toast),
                  }}
                >
                  <div>
                    <div className="text-sm font-semibold">Toast Notification</div>
                    <div className="text-xs opacity-90 mt-1">
                      Example of how a toast might appear.
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-xs px-2 py-1 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      color: pickReadableText(resolved.toast),
                    }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Row */}
            <div className="mt-4 text-xs opacity-80">
              Preset:{" "}
              <span className="font-semibold opacity-100">
                {PRESETS[presetId].name}
              </span>
              {Object.keys(overrides).length > 0 ? (
                <>
                  {" "}
                  · Overrides:{" "}
                  <span className="font-semibold opacity-100">
                    {Object.keys(overrides).length}
                  </span>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* Optional: Display Resolved Values */}
        <div className="mt-4 rounded-2xl border border-border text-fg/50 bg-content p-4">
          <div className="text-sm text-fg font-semibold">Resolved Tokens</div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {(Object.keys(resolved) as TokenKey[]).map((k) => (
              <div key={k} className="flex items-center justify-between gap-2">
                <span className="text-fg/80">{k}</span>
                <span className="font-mono text-fg/80">{resolved[k]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewComponent;
