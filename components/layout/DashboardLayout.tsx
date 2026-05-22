"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/layout/SidebarContext";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <DashboardShell>{children}</DashboardShell>
      </SidebarProvider>
    </AuthGuard>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar();

  return (
    <div className="app-bg min-h-screen">
      <Sidebar />
      <div
        className={`min-h-screen transition-[padding] duration-300 ease-out ${
          open ? "md:pl-[240px]" : "md:pl-[72px]"
        }`}
      >
        <main className="px-5 py-6 lg:px-8 lg:py-7">{children}</main>
      </div>
    </div>
  );
}
