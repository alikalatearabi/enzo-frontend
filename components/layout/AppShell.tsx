"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_SECTIONS } from "../../lib/navigation";
import { cn } from "../../lib/utils/cn";
import { ThemeToggle } from "../theme/ThemeToggle";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-foreground">
      <aside className="hidden w-72 shrink-0 border-l border-border bg-layer md:flex md:flex-col shadow-sm" dir="rtl">
        <div className="flex h-20 shrink-0 items-center gap-3 border-b border-border px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-base font-bold text-primary-foreground shadow-sm">
            EZ
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold leading-tight text-foreground">
              آینه‌های انزو
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">
              کنسول تولید
            </span>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-8 px-4 py-6 overflow-y-auto">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="flex flex-col gap-3">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                {section.label}
              </span>
              <div className="flex flex-col gap-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      "text-muted-foreground hover:bg-layer-hover hover:text-foreground",
                      isActive(item.href)
                        ? "bg-primary/10 text-foreground shadow-sm"
                        : "",
                    )}
                  >
                    {isActive(item.href) && (
                      <span className="absolute right-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-l-full bg-primary" />
                    )}
                    <span className="flex-1">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-border bg-layer/80 backdrop-blur-sm px-6">
          <div className="md:hidden">
            <span className="text-sm font-bold text-foreground">آینه‌های انزو</span>
          </div>
          <div className="flex items-center gap-4" style={{ direction: "ltr" }}>
            <ThemeToggle />
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-layer-hover hover:text-foreground"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>خروج از سیستم</span>
            </button>
          </div>
        </header>
        <main className="flex flex-1 flex-col overflow-y-auto bg-surface px-6 py-8">
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

