import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider } from "@/components/dashboard/sidebar-context";
import { DashboardTopBar } from "@/components/dashboard/top-bar";

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  // App shell: the top bar and sidebar stay put while the main area scrolls.
  return (
    <SidebarProvider>
      <div className="flex h-svh flex-col overflow-hidden">
        <DashboardTopBar />

        <div className="flex min-h-0 flex-1">
          <AppSidebar />

          <main className="min-w-0 flex-1 overflow-y-auto px-5 py-5">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
