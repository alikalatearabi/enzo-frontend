"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useTheme } from "./ThemeProvider";

const THEME_LABELS: Record<"light" | "dark" | "system", string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

const ICONS = {
  light: "☀️",
  dark: "🌙",
  system: "🌓",
};

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest("[data-theme-toggle]")) return;
      setOpen(false);
    };
    if (open) {
      window.addEventListener("click", handleClick);
    }
    return () => window.removeEventListener("click", handleClick);
  }, [open]);

  return (
    <div className="relative" data-theme-toggle>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen((prev) => !prev)}
        className="gap-3 text-sm text-muted-foreground"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span aria-hidden className="mr-2">{ICONS[resolvedTheme]}</span>
        {THEME_LABELS[theme]}
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-md border border-border bg-layer p-2 shadow-lg">
          {(["light", "dark", "system"] as const).map((option) => (
            <button
              key={option}
              type="button"
              className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition hover:bg-layer-hover ${
                theme === option ? "text-foreground font-medium" : "text-muted-foreground"
              }`}
              onClick={() => {
                setTheme(option);
                setOpen(false);
              }}
            >
              <span aria-hidden>{ICONS[option]}</span>
              <span>{THEME_LABELS[option]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

