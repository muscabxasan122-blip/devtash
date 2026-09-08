/**
 * Seeds the seven system item types.
 *
 * These are global rows: `userId` is null and `isSystem` is true, so every
 * user references the same records rather than owning a private copy (see
 * context/project-overview.md §18).
 *
 * `icon` and `color` are kept identical to MOCK_ITEM_TYPES in
 * src/lib/mock-data.ts — `icon` is a Lucide component name resolved through
 * src/lib/item-visuals.ts, and `color` is the hex the UI maps to a Tailwind
 * class. Changing one without the other will desync the dashboard.
 *
 * Idempotent: upserts on the unique `systemKey`, so re-running it updates the
 * existing rows instead of duplicating them.
 */

import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient, type SystemItemType } from "../src/generated/prisma/client";

interface SystemItemTypeSeed {
  systemKey: SystemItemType;
  /** Plural label shown in the sidebar. */
  name: string;
  /** Lucide icon name. */
  icon: string;
  color: string;
}

const SYSTEM_ITEM_TYPES: SystemItemTypeSeed[] = [
  { systemKey: "SNIPPET", name: "Snippets", icon: "Code2", color: "#3b82f6" },
  { systemKey: "PROMPT", name: "Prompts", icon: "Sparkles", color: "#8b5cf6" },
  { systemKey: "COMMAND", name: "Commands", icon: "Terminal", color: "#f97316" },
  { systemKey: "NOTE", name: "Notes", icon: "StickyNote", color: "#fde047" },
  { systemKey: "FILE", name: "Files", icon: "File", color: "#6b7280" },
  { systemKey: "IMAGE", name: "Images", icon: "Image", color: "#ec4899" },
  { systemKey: "LINK", name: "Links", icon: "Link2", color: "#10b981" },
];

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  try {
    for (const type of SYSTEM_ITEM_TYPES) {
      await prisma.itemType.upsert({
        where: { systemKey: type.systemKey },
        update: { name: type.name, icon: type.icon, color: type.color },
        create: { ...type, isSystem: true, userId: null },
      });
    }

    const seeded = await prisma.itemType.findMany({
      where: { isSystem: true },
      orderBy: { name: "asc" },
      select: { name: true, systemKey: true, color: true },
    });
    console.log(`Seeded ${seeded.length} system item types:`);
    for (const type of seeded) {
      console.log(`  ${type.systemKey?.padEnd(8)} ${type.name.padEnd(9)} ${type.color}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
