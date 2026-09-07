"use client";

import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSidebar } from "@/components/dashboard/sidebar-context";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";

export function AppSidebar() {
  const { collapsed, mobileOpen, setMobileOpen } = useSidebar();

  return (
    <>
      <aside
        id="dashboard-sidebar"
        className={cn(
          "hidden shrink-0 border-r border-border transition-[width] duration-200 md:block",
          collapsed ? "w-14" : "w-64",
        )}
      >
        <SidebarNav collapsed={collapsed} />
      </aside>

      {/* Below md the sidebar is only ever a drawer. */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 gap-0 p-0 md:hidden">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Item types and collections
          </SheetDescription>
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
