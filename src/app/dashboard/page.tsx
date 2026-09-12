import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Pin } from "lucide-react";

import { CollectionCard } from "@/components/dashboard/collection-card";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { ItemRow } from "@/components/dashboard/item-row";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { getRecentCollections } from "@/lib/db/collections";
import { getPinnedItems, getRecentItems } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Dashboard | DevStash",
};

const RECENT_COLLECTIONS_LIMIT = 6;
const RECENT_ITEMS_LIMIT = 10;

export default async function DashboardPage() {
  const recentCollections = await getRecentCollections(RECENT_COLLECTIONS_LIMIT);
  const pinnedItems = getPinnedItems();
  const recentItems = getRecentItems(RECENT_ITEMS_LIMIT);

  return (
    <div className="flex flex-col gap-8 pb-4">
      <header>
        <h1 className="font-heading text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-[0.85rem] text-muted-foreground">
          Your developer knowledge hub
        </p>
      </header>

      <DashboardStats />

      <section>
        <SectionHeading
          title="Recent Collections"
          action={
            <Link
              href="/collections"
              className="rounded-md text-[0.8rem] text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              View all
            </Link>
          }
        />
        {recentCollections.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recentCollections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed p-6 text-center text-[0.8rem] text-muted-foreground">
            No collections yet. Create one to start grouping your items.
          </p>
        )}
      </section>

      <section>
        <SectionHeading
          title="Pinned"
          icon={
            <Pin aria-hidden className="size-4 shrink-0 text-muted-foreground" />
          }
        />
        {pinnedItems.length > 0 ? (
          <div className="flex flex-col gap-3">
            {pinnedItems.map((item) => (
              <ItemRow key={item.id} item={item} accent />
            ))}
          </div>
        ) : (
          <p className="text-[0.8rem] text-muted-foreground">
            Nothing pinned yet.
          </p>
        )}
      </section>

      <section>
        <SectionHeading
          title="Recent Items"
          icon={
            <Clock
              aria-hidden
              className="size-4 shrink-0 text-muted-foreground"
            />
          }
        />
        {recentItems.length > 0 ? (
          <div className="flex flex-col gap-3">
            {recentItems.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-[0.8rem] text-muted-foreground">
            No recent activity.
          </p>
        )}
      </section>
    </div>
  );
}
