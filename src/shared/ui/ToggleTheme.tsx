"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";
const DEFAULT_THEME = "light";

// Keep this consistent everywhere
const applyTheme = (theme: string) => {
  const t = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = t;
  // optional but recommended if any css uses .dark
  document.documentElement.classList.toggle("dark", t === "dark");
};

export const ToggleTheme = ({
  tenantDefault,
}: {
  tenantDefault?: "light" | "dark";
}) => {
  const [theme, setTheme] = useState<"light" | "dark">(DEFAULT_THEME);

  // Initial load: saved > tenantDefault > DEFAULT_THEME
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as "light" | "dark" | null;
    const initial = saved ?? tenantDefault ?? DEFAULT_THEME;
    setTheme(initial);
    applyTheme(initial);
  }, [tenantDefault]);

  // Persist + apply when user changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
    window.dispatchEvent(new Event("tenant-theme-changed")); //  add this
  }, [theme]);

  // Sync across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (
        e.key === STORAGE_KEY &&
        (e.newValue === "light" || e.newValue === "dark")
      ) {
        setTheme(e.newValue);
        applyTheme(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      title={`Theme: ${theme}`}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg text-fg"
    >
      {theme === "dark" ? <Moon /> : <Sun />}
    </button>
  );
};
