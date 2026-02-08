export function clampHex(hex: string): string {
  // normalize to #RRGGBB
  const h = hex.trim().toUpperCase();
  if (/^#[0-9A-F]{6}$/.test(h)) return h;
  if (/^#[0-9A-F]{3}$/.test(h)) {
    const r = h[1],
      g = h[2],
      b = h[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return "";
}

export function hexToRgb(
  hex: string,
): { r: number; g: number; b: number } | null {
  const h = clampHex(hex);
  if (!h) return null;
  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  return { r, g, b };
}

export function srgbToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex: string): number | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const R = srgbToLinear(rgb.r);
  const G = srgbToLinear(rgb.g);
  const B = srgbToLinear(rgb.b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export const contrastRatio = (fg: string, bg: string) => {
  const rgb = (hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  const luminance = (rgb: [number, number, number]) => {
    const [r, g, b] = rgb.map((x) => {
      const s = x / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const [r1, g1, b1] = rgb(fg);
  const [r2, g2, b2] = rgb(bg);

  const luminance1 = luminance([r1, g1, b1]);
  const luminance2 = luminance([r2, g2, b2]);

  const ratio =
    (Math.max(luminance1, luminance2) + 0.05) /
    (Math.min(luminance1, luminance2) + 0.05);

  return ratio;
};

export function pickReadableText(bgHex: string): string {
  // Choose black/white based on luminance
  const L = relativeLuminance(bgHex);
  if (L == null) return "#FFFFFF";
  return L > 0.55 ? "#0F172A" : "#FFFFFF";
}
