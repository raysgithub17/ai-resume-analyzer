"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { UserAvatar } from "@/components/UserAvatar";

type UserMenuProps = {
  variant?: "sidebar" | "compact" | "default";
};

export function UserMenu({ variant = "default" }: UserMenuProps) {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const displayName = user.displayName ?? user.email ?? "User";

  return (
    <div className="relative w-full" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center transition ${
          variant === "sidebar"
            ? "w-full gap-2.5 rounded-xl px-2 py-2 hover:bg-slate-50 dark:hover:bg-slate-800"
            : variant === "compact"
              ? "justify-center rounded-full p-0.5 hover:bg-slate-50 dark:hover:bg-slate-800"
              : "gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-2.5 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
        }`}
      >
        <UserAvatar photoURL={user.photoURL} name={displayName} size="sm" />
        {variant !== "compact" && (
          <>
            <span
              className={`min-w-0 truncate text-left text-sm font-medium text-slate-700 dark:text-slate-200 ${
                variant === "sidebar" ? "flex-1" : "hidden max-w-[108px] md:block"
              }`}
            >
              {displayName}
            </span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-slate-400 transition dark:text-slate-500 ${open ? "rotate-180" : ""}`}
            />
          </>
        )}
      </button>

      {open && (
        <div
          className={`absolute z-20 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/40 ${
            variant === "compact" ? "bottom-full left-0 mb-2 w-52" : "bottom-full left-0 mb-2 w-full"
          }`}
        >
          <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-900">
            <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
              {user.displayName ?? "Signed in"}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <LogOut className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
