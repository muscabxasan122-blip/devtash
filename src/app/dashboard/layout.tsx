import { DashboardTopBar } from "@/components/dashboard/top-bar";

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <div className="flex min-h-svh flex-col">
      <DashboardTopBar />

      <div className="flex min-h-0 flex-1">
        {/* Placeholder sidebar — phase 2 replaces this with the collapsible nav. */}
        <aside className="hidden w-64 shrink-0 border-r border-border px-5 py-5 md:block">
          <h2 className="text-[15px] font-semibold">Sidebar</h2>
        </aside>

        <main className="min-w-0 flex-1 px-5 py-5">{children}</main>
      </div>
    </div>
  );
}
