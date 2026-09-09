/**
 * Ad-hoc database connectivity check.
 *
 * Run with `npx tsx scripts/test-db.ts`. Verifies that DATABASE_URL points at
 * a reachable Postgres, that the migrated tables exist, and that the system
 * item types from prisma/seed.ts are present.
 *
 * Like prisma/seed.ts, this imports the generated client by relative path
 * rather than the `@/` alias, and pulls in dotenv itself — Prisma 7 no longer
 * loads .env, and neither does tsx.
 */

import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  // Log the host only — the connection string carries credentials.
  const { host, pathname } = new URL(connectionString);
  console.log(`Connecting to ${host}${pathname}`);

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  try {
    const [{ version }] = await prisma.$queryRaw<{ version: string }[]>`SELECT version()`;
    console.log(`Connected: ${version.split(",")[0]}`);

    const [users, items, itemTypes, collections, tags] = await Promise.all([
      prisma.user.count(),
      prisma.item.count(),
      prisma.itemType.count(),
      prisma.collection.count(),
      prisma.tag.count(),
    ]);

    console.log("\nRow counts:");
    console.log(`  users        ${users}`);
    console.log(`  items        ${items}`);
    console.log(`  item types   ${itemTypes}`);
    console.log(`  collections  ${collections}`);
    console.log(`  tags         ${tags}`);

    const systemTypes = await prisma.itemType.findMany({
      where: { isSystem: true },
      orderBy: { name: "asc" },
      select: { name: true, systemKey: true, icon: true, color: true },
    });

    console.log(`\nSystem item types (${systemTypes.length}/7):`);
    for (const type of systemTypes) {
      console.log(
        `  ${type.systemKey?.padEnd(8)} ${type.name.padEnd(9)} ${type.icon?.padEnd(11)} ${type.color}`,
      );
    }

    if (systemTypes.length !== 7) {
      console.warn("\nExpected 7 system item types — run `npx prisma db seed`.");
    }

    console.log("\nDatabase OK.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
