import Link from "next/link";
import { Pin, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatShortDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ITEM_TYPE_ACCENT_CLASSES,
  ITEM_TYPE_COLOR_CLASSES,
  ITEM_TYPE_ICONS,
  ITEM_TYPE_TILE_CLASSES,
} from "@/lib/item-visuals";
import { getItemType, type Item } from "@/lib/mock-data";

interface ItemRowProps {
  item: Item;
  /** Left border in the item type's colour, as on the pinned rows. */
  accent?: boolean;
}

export function ItemRow({ item, accent = false }: ItemRowProps) {
  const type = getItemType(item.typeId);
  // Every mock item resolves to a type; this keeps the lookup honest.
  if (!type) return null;

  const Icon = ITEM_TYPE_ICONS[type.systemKey];
  const timestamp = item.lastAccessedAt ?? item.updatedAt;

  return (
    <Link
      href={`/items/${item.id}`}
      className="rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <Card
        size="sm"
        className={cn(
          "transition-colors hover:bg-muted/40",
          accent && cn("border-l-4", ITEM_TYPE_ACCENT_CLASSES[type.systemKey]),
        )}
      >
        <CardContent className="flex items-start gap-3">
          <span
            aria-hidden
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg",
              ITEM_TYPE_TILE_CLASSES[type.systemKey],
            )}
          >
            <Icon
              className={cn("size-4", ITEM_TYPE_COLOR_CLASSES[type.systemKey])}
            />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-1.5">
                <span className="truncate text-[0.85rem] font-medium">
                  {item.title}
                </span>
                {item.isPinned && (
                  <Pin
                    aria-label="Pinned"
                    className="size-3.5 shrink-0 text-muted-foreground"
                  />
                )}
                {item.isFavorite && (
                  <Star
                    aria-label="Favorite"
                    className="size-3.5 shrink-0 fill-yellow-400 text-yellow-400"
                  />
                )}
              </div>
              <time
                dateTime={timestamp}
                className="shrink-0 text-[0.7rem] text-muted-foreground tabular-nums"
              >
                {formatShortDate(timestamp)}
              </time>
            </div>

            <p className="mt-1 line-clamp-2 text-[0.8rem] text-muted-foreground">
              {item.description}
            </p>

            {item.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[0.7rem]">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
