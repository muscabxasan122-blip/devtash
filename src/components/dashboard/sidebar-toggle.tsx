"use client";

import { PanelLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/dashboard/sidebar-context";

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar();

  // The label stays viewport-neutral: the same button collapses the rail on
  // desktop and opens the drawer on mobile.
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleSidebar}
      aria-controls="dashboard-sidebar"
      aria-label="Toggle sidebar"
    >
      <PanelLeft aria-hidden />
    </Button>
  );
}
