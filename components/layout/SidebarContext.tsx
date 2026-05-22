"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const MOBILE_QUERY = "(max-width: 767px)";

type SidebarContextValue = {
  open: boolean;
  isMobile: boolean;
  toggle: () => void;
  close: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);

    function handleChange() {
      const mobile = mq.matches;
      setIsMobile(mobile);
      setOpen(mobile ? false : true);
    }

    handleChange();
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!isMobile || !open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobile, open]);

  const value = useMemo(
    () => ({
      open,
      isMobile,
      toggle: () => setOpen((prev) => !prev),
      close: () => setOpen(false),
    }),
    [open, isMobile]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}
