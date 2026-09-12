/**
 * Collection reads for the dashboard.
 *
 * Server-only: these run inside server components and talk to Postgres
 * through the shared Prisma client. Each exported function calls
 * `connection()` first, which stops prerendering — without it Next would
 * execute these queries at build time and bake the results into a static
 * /dashboard.
 *
 * Shape is deliberate: the grid's data comes back in one Prisma call with the
 * item count and the item types already folded in, so a card never queries for
 * itself. Six cards cost the same number of round trips as one.
 */

import { connection } from "next/server";

import type { SystemItemType } from "@/generated/prisma/enums";
import { SYSTEM_ITEM_TYPE_ORDER } from "@/lib/item-visuals";
import { prisma } from "@/lib/prisma";

/**
 * Temporary. NextAuth v5 isn't wired up yet, so there is no session to scope
 * these queries to and every read falls back to the seeded demo user. When
 * auth lands, this is the one place that changes.
 */
const DEMO_USER_EMAIL = "demo@devstash.io";

async function getCurrentUserId(): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true },
  });

  return user?.id ?? null;
}

/** An item type present in a collection, as shown in a card's icon row. */
export interface CollectionItemType {
  systemKey: SystemItemType;
  /** Plural label, e.g. "Snippets". */
  name: string;
}

export interface CollectionSummary {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  /** Distinct system types in the collection, in canonical display order. */
  types: CollectionItemType[];
  /** Most-used type, which drives the card's accent border. Null when empty. */
  accentType: SystemItemType | null;
}

export interface CollectionStats {
  total: number;
  favorites: number;
}

/** Collections for the dashboard grid, most recently updated first. */
export async function getRecentCollections(
  limit: number,
): Promise<CollectionSummary[]> {
  await connection();

  const userId = await getCurrentUserId();
  if (!userId) {
    return [];
  }

  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      description: true,
      isFavorite: true,
      items: {
        select: {
          item: {
            select: {
              itemType: { select: { systemKey: true, name: true } },
            },
          },
        },
      },
    },
  });

  return collections.map(({ items, ...collection }) => {
    const types = summariseTypes(items.map(({ item }) => item.itemType));

    return {
      ...collection,
      itemCount: items.length,
      // The icon row keeps the canonical order; only the accent cares which
      // type is the most used.
      types: [...types]
        .sort(
          (a, b) =>
            SYSTEM_ITEM_TYPE_ORDER.indexOf(a.systemKey) -
            SYSTEM_ITEM_TYPE_ORDER.indexOf(b.systemKey),
        )
        .map(({ systemKey, name }) => ({ systemKey, name })),
      accentType: types[0]?.systemKey ?? null,
    };
  });
}

/** Totals for the Collections and Favorite Collections stat tiles. */
export async function getCollectionStats(): Promise<CollectionStats> {
  await connection();

  const userId = await getCurrentUserId();
  if (!userId) {
    return { total: 0, favorites: 0 };
  }

  const [total, favorites] = await Promise.all([
    prisma.collection.count({ where: { userId } }),
    prisma.collection.count({ where: { userId, isFavorite: true } }),
  ]);

  return { total, favorites };
}

interface TypeTally extends CollectionItemType {
  count: number;
}

/**
 * Tallies a collection's item types, most-used first, ties broken by
 * `SYSTEM_ITEM_TYPE_ORDER` so a card's accent can't flip between renders.
 *
 * A user's own custom types have a null `systemKey` and no icon or colour of
 * their own, so they are skipped here and counted only towards `itemCount`.
 */
function summariseTypes(
  itemTypes: { systemKey: SystemItemType | null; name: string }[],
): TypeTally[] {
  const tallies = new Map<SystemItemType, TypeTally>();

  for (const { systemKey, name } of itemTypes) {
    if (!systemKey) continue;

    const tally = tallies.get(systemKey);
    if (tally) {
      tally.count += 1;
    } else {
      tallies.set(systemKey, { systemKey, name, count: 1 });
    }
  }

  return [...tallies.values()].sort(
    (a, b) =>
      b.count - a.count ||
      SYSTEM_ITEM_TYPE_ORDER.indexOf(a.systemKey) -
        SYSTEM_ITEM_TYPE_ORDER.indexOf(b.systemKey),
  );
}
