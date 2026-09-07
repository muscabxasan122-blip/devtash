"use client";

import * as React from "react";

/** Below this width the sidebar is only ever shown as a drawer. */
const DESKTOP_QUERY = "(min-width: 768px)";

interface SidebarContextValue {
  /** Desktop only: the sidebar is reduced to an icon rail. */
  collapsed: boolean;
  /** Mobile only: the drawer is open. */
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  /** Collapses on desktop, opens the drawer on mobile. */
  toggleSidebar: () => void;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar(): SidebarContextValue {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Reading the media query on click rather than tracking it in state keeps the
  // server and client markup identical on first render.
  const toggleSidebar = React.useCallback(() => {
    if (window.matchMedia(DESKTOP_QUERY).matches) {
      setCollapsed((value) => !value);
    } else {
      setMobileOpen((value) => !value);
    }
  }, []);

  // The drawer is portalled outside the mobile-only container, so growing past
  // the breakpoint while it is open has to close it explicitly.
  React.useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileOpen(false);
    };

    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  const value = React.useMemo(
    () => ({ collapsed, mobileOpen, setMobileOpen, toggleSidebar }),
    [collapsed, mobileOpen, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}
