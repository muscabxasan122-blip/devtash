import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarToggle } from "@/components/dashboard/sidebar-toggle";

export function DashboardTopBar() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border px-4">
      <div className="flex shrink-0 items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-md border border-border bg-secondary text-[0.7rem] font-semibold">
          DS
        </span>
        <span className="text-[15px] font-semibold">DevStash</span>
      </div>

      <SidebarToggle />

      <div className="flex min-w-0 flex-1 justify-center">
        <div className="relative w-full max-w-md">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            placeholder="Search items..."
            aria-label="Search items"
            className="pr-12 pl-8 text-[0.8rem]"
          />
          <kbd className="pointer-events-none absolute top-1/2 right-2 hidden -translate-y-1/2 items-center rounded border border-border bg-muted px-1 py-0.5 font-sans text-[0.65rem] text-muted-foreground select-none sm:inline-flex">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button variant="outline" className="hidden sm:inline-flex">
          New Collection
        </Button>
        <Button variant="outline">New Item</Button>
      </div>
    </header>
  );
}
