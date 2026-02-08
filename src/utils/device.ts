export async function getDeviceInfo() {
  let browser = "Unknown";
  let os = "Unknown";

  const ua = navigator.userAgent || "";
  const uaLower = ua.toLowerCase();

  // -----------------------
  // OS detection
  // -----------------------
  const uaData: any = (navigator as any).userAgentData;
  if (uaData?.platform) {
    os = uaData.platform; // often: "Windows", "macOS", "Android", "iOS", "Linux"
  } else {
    const p = (navigator.platform || "").toLowerCase();
    if (p.includes("win")) os = "Windows";
    else if (p.includes("mac")) os = "macOS";
    else if (p.includes("linux")) os = "Linux";
    else if (uaLower.includes("android")) os = "Android";
    else if (uaLower.includes("iphone") || uaLower.includes("ipad") || uaLower.includes("ipod")) os = "iOS";
  }

  // -----------------------
  // Browser detection
  // Priority: explicit/special -> common
  // -----------------------

  // 1) Brave confirmation (best when available)
  try {
    const isBrave = await (navigator as any).brave?.isBrave?.();
    if (isBrave === true) browser = "Brave";
  } catch {}

  // 2) Opera / Opera GX (UA is most reliable)
  // Opera UA contains "OPR/xx" ; Opera GX includes "GX" token in many builds
  const isOpera = /\bOPR\/|Opera\//.test(ua);
  const isOperaGX = isOpera && (uaLower.includes("gx") || uaLower.includes("opera gx"));
  if (browser === "Unknown" && isOperaGX) browser = "Opera GX";
  if (browser === "Unknown" && isOpera) browser = "Opera";

  // 3) Edge (Chromium Edge uses "Edg/")
  if (browser === "Unknown" && /\bEdg\/\d+/.test(ua)) browser = "Edge";

  // 4) Firefox
  if (browser === "Unknown" && /\bFirefox\/\d+/.test(ua)) browser = "Firefox";

  // 5) Safari (must exclude Chromium-based)
  const isSafari =
    /\bSafari\/\d+/.test(ua) &&
    !/\bChrome\/\d+/.test(ua) &&
    !/\bChromium\/\d+/.test(ua) &&
    !/\bEdg\/\d+/.test(ua) &&
    !/\bOPR\/\d+/.test(ua);

  if (browser === "Unknown" && isSafari) browser = "Safari";

  // 6) Chrome (last, because many Chromium browsers include Chrome/)
  if (browser === "Unknown" && /\bChrome\/\d+/.test(ua)) browser = "Chrome";

  // 7) If still unknown, try Client Hints brands (nice-to-have)
  if (browser === "Unknown" && uaData?.brands?.length) {
    const brands = uaData.brands.map((b: any) => String(b.brand).toLowerCase());
    if (brands.includes("brave")) browser = "Brave";
    else if (brands.includes("microsoft edge")) browser = "Edge";
    else if (brands.includes("google chrome")) browser = "Chrome";
    else if (brands.includes("chromium")) browser = "Chromium";
  }

  // -----------------------
  // Device type
  // -----------------------
  const deviceType =
    /Mobi|Android|iPhone|iPad|iPod/i.test(ua) ? "mobile" : "desktop";

  return {
    browser,
    os,
    deviceType,
    deviceName: `${browser} on ${os}`,
  };
}
