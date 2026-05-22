"use client";

import { Menu, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSidebar } from "@/components/layout/SidebarContext";

type PageHeaderProps = {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
};

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  const { toggle } = useSidebar();

  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label="Open menu"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 md:hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Menu className="h-4 w-4" strokeWidth={1.75} />
          </button>

          <div className="min-w-0">
            <h1 className="flex flex-wrap items-center gap-x-2 gap-y-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 lg:text-[1.65rem]">
              {title}
              <Sparkles className="h-5 w-5 shrink-0 text-violet-500" />
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          {action && <div className="hidden sm:block">{action}</div>}
        </div>
      </div>

      {action && (
        <div className="mt-4 sm:hidden [&>button]:flex [&>button]:w-full [&>button]:justify-center">
          {action}
        </div>
      )}
    </div>
  );
}
