import { FolderHeart, FolderOpen, Layers, Star, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { getCollectionStats } from "@/lib/db/collections";
import { getFavoriteItems, MOCK_ITEMS } from "@/lib/mock-data";

interface Stat {
  label: string;
  value: number;
  icon: LucideIcon;
  /** Icon colour; the tile behind it stays neutral. */
  iconClassName: string;
}

/**
 * Totals across the stash. Not in the reference screenshot — see the spec.
 *
 * The collection tiles read from the database; the item tiles still come from
 * `mock-data.ts` until a later feature migrates the item reads.
 */
export async function DashboardStats() {
  const collections = await getCollectionStats();

  const stats: Stat[] = [
    {
      label: "Items",
      value: MOCK_ITEMS.length,
      icon: Layers,
      iconClassName: "text-blue-500",
    },
    {
      label: "Collections",
      value: collections.total,
      icon: FolderOpen,
      iconClassName: "text-emerald-500",
    },
    {
      label: "Favorite Items",
      value: getFavoriteItems().length,
      icon: Star,
      iconClassName: "text-yellow-400",
    },
    {
      label: "Favorite Collections",
      value: collections.favorites,
      icon: FolderHeart,
      iconClassName: "text-pink-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, iconClassName }) => (
        <Card key={label} size="sm">
          <CardContent className="flex items-center gap-3">
            <span
              aria-hidden
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted"
            >
              <Icon className={cn("size-4", iconClassName)} />
            </span>
            <span className="min-w-0">
              <span className="block text-xl leading-none font-semibold tabular-nums">
                {value}
              </span>
              <span className="mt-1.5 block text-[0.75rem] leading-tight text-muted-foreground">
                {label}
              </span>
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
