import Link from "next/link";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getCollectionAccentClass,
  ITEM_TYPE_COLOR_CLASSES,
  ITEM_TYPE_ICONS,
} from "@/lib/item-visuals";
import {
  getCollectionItemTypes,
  getItemsByCollection,
  type Collection,
} from "@/lib/mock-data";

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const itemCount = getItemsByCollection(collection.id).length;
  const itemTypes = getCollectionItemTypes(collection.id);

  return (
    <Link
      href={`/collections/${collection.id}`}
      className="rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <Card
        size="sm"
        className={cn(
          "h-full border-l-4 transition-colors hover:bg-muted/40",
          getCollectionAccentClass(collection.color),
        )}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-1.5">
            <span className="min-w-0 truncate">{collection.name}</span>
            {collection.isFavorite && (
              <Star
                aria-label="Favorite"
                className="size-3.5 shrink-0 fill-yellow-400 text-yellow-400"
              />
            )}
          </CardTitle>
          <CardDescription className="text-[0.75rem]">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <p className="line-clamp-2 text-[0.8rem] text-muted-foreground">
            {collection.description}
          </p>
          {itemTypes.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="sr-only">
                Contains: {itemTypes.map((type) => type.name).join(", ")}
              </span>
              {itemTypes.map((type) => {
                const Icon = ITEM_TYPE_ICONS[type.systemKey];
                return (
                  <Icon
                    key={type.id}
                    aria-hidden
                    className={cn(
                      "size-3.5",
                      ITEM_TYPE_COLOR_CLASSES[type.systemKey],
                    )}
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
