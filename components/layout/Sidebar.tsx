"use client";

import { ClipboardList, History } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserMenu } from "@/components/UserMenu";
import { AppLogo } from "@/components/layout/AppLogo";
import { useSidebar } from "@/components/layout/SidebarContext";

const navItems = [
  { href: "/", label: "Analyze Resume", icon: ClipboardList },
  { href: "/history", label: "History", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();
  const { open, isMobile, toggle, close } = useSidebar();

  const expanded = isMobile || open;

  return (
    <>
      {isMobile && open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-[2px] md:hidden"
          onClick={close}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200/80 bg-white transition-[transform,width] duration-300 ease-out dark:border-slate-800 dark:bg-slate-900 ${
          isMobile
            ? `w-[240px] ${open ? "translate-x-0" : "-translate-x-full"}`
            : open
              ? "w-[240px] translate-x-0"
              : "w-[72px] translate-x-0"
        }`}
      >
        <div className={`border-b border-slate-100 dark:border-slate-800 ${expanded ? "px-3 py-4" : "px-2 py-4"}`}>
          <AppLogo
            showText={expanded}
            compact={!expanded}
            onClick={toggle}
            className={expanded ? "" : "justify-center"}
          />
        </div>

        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    title={!expanded ? item.label : undefined}
                    onClick={() => {
                      if (isMobile) close();
                    }}
                    className={`flex items-center rounded-xl transition-all duration-150 ${
                      expanded ? "gap-3 px-3 py-2.5" : "justify-center p-2.5"
                    } ${
                      isActive
                        ? "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    }`}
                  >
                    <Icon
                      className={`h-[18px] w-[18px] shrink-0 ${
                        isActive ? "text-violet-600 dark:text-violet-400" : "text-slate-400 dark:text-slate-500"
                      }`}
                      strokeWidth={1.75}
                    />
                    {expanded && (
                      <span className="truncate text-sm font-medium">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto border-t border-slate-100 p-2 dark:border-slate-800">
          {expanded ? (
            <UserMenu variant="sidebar" />
          ) : (
            <div className="flex justify-center py-1">
              <UserMenu variant="compact" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
