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
    <div className="flex min-h-screen bg-surface text-foreground">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-layer md:flex md:flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            EZ
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight">
              Enzo Mirrors
            </span>
            <span className="text-xs text-muted-foreground">
              Production Console
            </span>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-6 px-3 py-4 text-sm">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="flex flex-col gap-2">
              <span className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {section.label}
              </span>
              <div className="flex flex-col gap-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-layer-hover hover:text-foreground",
                      isActive(item.href) &&
                        "bg-layer-hover text-foreground shadow-sm",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="flex flex-col gap-1 border-t border-border px-6 py-4 text-xs text-muted-foreground">
          <span>Plant status: Nominal</span>
          <span>MinIO: Connected</span>
        </div>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-layer px-6">
          <div className="md:hidden">
            <span className="text-sm font-semibold">Enzo Mirrors</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <ThemeToggle />
            <span>Logged out</span>
            <div className="h-8 w-8 rounded-full bg-layer-hover" />
          </div>
        </header>
        <main className="flex flex-1 flex-col bg-surface px-6 py-8">
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

