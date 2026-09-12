/**
 * Seeds the development database with sample data.
 *
 * Covers the demo user, the seven system item types, and the five collections
 * and eighteen items from context/feature/seed-spec.md.
 *
 * Three deliberate departures from that spec, agreed with the user and
 * recorded in context/current-feature.md:
 *  - no password. `User` has no `password` column, and the auth plan is
 *    NextAuth v5 with Email (magic-link) + GitHub, neither of which uses one.
 *  - the spec's `isPro: false` maps onto the schema's `plan: FREE`.
 *  - item type names stay plural and title-case ("Snippets", not "snippet"),
 *    with the icons `Code2` / `Link2`. These are the sidebar's labels and must
 *    match MOCK_ITEM_TYPES and src/lib/item-visuals.ts, which key off
 *    `systemKey` rather than the icon string.
 *
 * Idempotent throughout. Rows the schema gives a natural key are upserted on
 * it (`systemKey`, `email`, `userId`+`name` for tags); collections and items
 * have no such key, so they carry explicit readable ids instead of generated
 * cuids. Re-running converges rather than duplicating.
 */

import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import {
  PrismaClient,
  type ItemContentType,
  type SystemItemType,
} from "../src/generated/prisma/client";

const DEMO_USER = {
  id: "user_demo",
  email: "demo@devstash.io",
  name: "Demo User",
};

/* -------------------------------------------------------------------------- */
/* System item types                                                          */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Collections                                                                */
/* -------------------------------------------------------------------------- */

interface CollectionSeed {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

const COLLECTIONS: CollectionSeed[] = [
  {
    id: "col_react_patterns",
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    isFavorite: true,
    createdAt: "2026-08-14T09:00:00.000Z",
    updatedAt: "2026-09-05T15:20:00.000Z",
  },
  {
    id: "col_ai_workflows",
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    isFavorite: true,
    createdAt: "2026-08-17T11:30:00.000Z",
    updatedAt: "2026-09-07T10:45:00.000Z",
  },
  {
    id: "col_devops",
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    isFavorite: false,
    createdAt: "2026-08-21T08:15:00.000Z",
    updatedAt: "2026-09-02T17:05:00.000Z",
  },
  {
    id: "col_terminal_commands",
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    isFavorite: true,
    createdAt: "2026-08-25T13:40:00.000Z",
    updatedAt: "2026-09-06T12:10:00.000Z",
  },
  {
    id: "col_design_resources",
    name: "Design Resources",
    description: "UI/UX resources and references",
    isFavorite: false,
    createdAt: "2026-08-29T16:00:00.000Z",
    updatedAt: "2026-09-04T09:35:00.000Z",
  },
];

/* -------------------------------------------------------------------------- */
/* Items                                                                      */
/* -------------------------------------------------------------------------- */

interface ItemSeed {
  id: string;
  title: string;
  description: string;
  type: SystemItemType;
  contentType: ItemContentType;
  content?: string;
  url?: string;
  language?: string;
  tags: string[];
  collectionId: string;
  isFavorite?: boolean;
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
  lastAccessedAt?: string;
}

const ITEMS: ItemSeed[] = [
  /* --- React Patterns: 3 TypeScript snippets --------------------------- */
  {
    id: "item_use_debounce",
    title: "useDebounce",
    description: "Delay a fast-changing value — the search input's best friend",
    type: "SNIPPET",
    contentType: "TEXT",
    language: "typescript",
    content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}`,
    tags: ["react", "hooks", "typescript"],
    collectionId: "col_react_patterns",
    isFavorite: true,
    isPinned: true,
    createdAt: "2026-08-14T09:20:00.000Z",
    updatedAt: "2026-09-05T15:20:00.000Z",
    lastAccessedAt: "2026-09-08T18:42:00.000Z",
  },
  {
    id: "item_theme_provider",
    title: "ThemeProvider Context",
    description: "Context provider with a typed hook that refuses to be used outside it",
    type: "SNIPPET",
    contentType: "TEXT",
    language: "typescript",
    content: `"use client";

import { createContext, useContext, useMemo, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const value = useMemo(
    () => ({
      theme,
      toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}`,
    tags: ["react", "context", "typescript"],
    collectionId: "col_react_patterns",
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-08-18T14:05:00.000Z",
    updatedAt: "2026-08-30T11:15:00.000Z",
    lastAccessedAt: "2026-09-03T08:30:00.000Z",
  },
  {
    id: "item_cn_utility",
    title: "cn() class merger",
    description: "Merge conditional classes without Tailwind conflicts",
    type: "SNIPPET",
    contentType: "TEXT",
    language: "typescript",
    content: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Later Tailwind classes win, so "p-2" then "p-4" resolves to "p-4". */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`,
    tags: ["typescript", "tailwind", "utils"],
    collectionId: "col_react_patterns",
    isFavorite: true,
    isPinned: false,
    createdAt: "2026-08-22T10:50:00.000Z",
    updatedAt: "2026-09-01T13:25:00.000Z",
    lastAccessedAt: "2026-09-07T16:12:00.000Z",
  },

  /* --- AI Workflows: 3 prompts ----------------------------------------- */
  {
    id: "item_prompt_code_review",
    title: "Code Review Prompt",
    description: "Structured review pass — correctness first, style last",
    type: "PROMPT",
    contentType: "TEXT",
    content: `Review the diff below as a senior engineer on this codebase.

Work in this order and stop at the first section with nothing to say:
1. Correctness — logic errors, unhandled edge cases, race conditions.
2. Security — missing auth checks, unvalidated input, leaked secrets.
3. Performance — N+1 queries, needless re-renders, unbounded loops.
4. Consistency — does this match the patterns already in the codebase?

For each finding give the file and line, why it is wrong, and the smallest
fix that resolves it. Do not comment on formatting; the linter owns that.`,
    tags: ["ai", "code-review", "prompt"],
    collectionId: "col_ai_workflows",
    isFavorite: true,
    isPinned: true,
    createdAt: "2026-08-17T11:45:00.000Z",
    updatedAt: "2026-09-07T10:45:00.000Z",
    lastAccessedAt: "2026-09-09T07:55:00.000Z",
  },
  {
    id: "item_prompt_docs",
    title: "Documentation Generator",
    description: "Turn a module into docs that explain why, not what",
    type: "PROMPT",
    contentType: "TEXT",
    content: `Write documentation for the module below.

Include: a one-paragraph summary of what problem it solves, the public API
with parameter and return types, at least one runnable example, and any
gotchas a caller would otherwise discover at runtime.

Explain why the module is shaped the way it is, not just what each function
does — a reader can get "what" from the signatures. Skip private helpers.`,
    tags: ["ai", "documentation", "prompt"],
    collectionId: "col_ai_workflows",
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-08-24T09:10:00.000Z",
    updatedAt: "2026-09-02T14:30:00.000Z",
    lastAccessedAt: "2026-09-06T11:20:00.000Z",
  },
  {
    id: "item_prompt_refactor",
    title: "Refactoring Assistant",
    description: "Behaviour-preserving cleanup with the reasoning shown",
    type: "PROMPT",
    contentType: "TEXT",
    content: `Refactor the code below without changing its observable behaviour.

Constraints:
- Keep the public API identical unless I say otherwise.
- One concern per step, smallest change that works.
- Do not add dependencies.
- Preserve existing naming and file conventions.

Before each change, state in one line what smell it addresses. After the
refactor, list anything you deliberately left alone and why.`,
    tags: ["ai", "refactoring", "prompt"],
    collectionId: "col_ai_workflows",
    isFavorite: true,
    isPinned: false,
    createdAt: "2026-08-28T15:25:00.000Z",
    updatedAt: "2026-09-05T09:40:00.000Z",
    lastAccessedAt: "2026-09-08T13:05:00.000Z",
  },

  /* --- DevOps: 1 snippet, 1 command, 2 links --------------------------- */
  {
    id: "item_dockerfile_nextjs",
    title: "Next.js Multi-Stage Dockerfile",
    description: "Standalone output build — small image, non-root user",
    type: "SNIPPET",
    contentType: "TEXT",
    language: "dockerfile",
    content: `FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 1001 nodejs && adduser -u 1001 -G nodejs -S nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]`,
    tags: ["docker", "nextjs", "deployment"],
    collectionId: "col_devops",
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-08-21T08:30:00.000Z",
    updatedAt: "2026-09-02T17:05:00.000Z",
    lastAccessedAt: "2026-09-04T10:15:00.000Z",
  },
  {
    id: "item_cmd_deploy",
    title: "Deploy to Production",
    description: "Migrate, build, then release — bail out if any step fails",
    type: "COMMAND",
    contentType: "TEXT",
    language: "bash",
    content: `set -euo pipefail

npx prisma migrate deploy
npm run build
npm run start`,
    tags: ["deployment", "prisma", "ci"],
    collectionId: "col_devops",
    isFavorite: true,
    isPinned: false,
    createdAt: "2026-08-23T12:00:00.000Z",
    updatedAt: "2026-08-31T16:20:00.000Z",
    lastAccessedAt: "2026-09-05T14:00:00.000Z",
  },
  {
    id: "item_link_docker_docs",
    title: "Docker Documentation",
    description: "Reference for Dockerfile syntax, Compose and best practices",
    type: "LINK",
    contentType: "URL",
    url: "https://docs.docker.com/",
    tags: ["docker", "documentation"],
    collectionId: "col_devops",
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-08-26T09:45:00.000Z",
    updatedAt: "2026-08-26T09:45:00.000Z",
    lastAccessedAt: "2026-09-01T08:20:00.000Z",
  },
  {
    id: "item_link_github_actions",
    title: "GitHub Actions Documentation",
    description: "Workflow syntax, triggers and the runner environment",
    type: "LINK",
    contentType: "URL",
    url: "https://docs.github.com/en/actions",
    tags: ["ci", "github", "documentation"],
    collectionId: "col_devops",
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-08-27T11:10:00.000Z",
    updatedAt: "2026-08-27T11:10:00.000Z",
    lastAccessedAt: "2026-09-03T15:40:00.000Z",
  },

  /* --- Terminal Commands: 4 commands ----------------------------------- */
  {
    id: "item_cmd_git_undo",
    title: "Undo the Last Commit",
    description: "Keep the changes staged — soft reset, nothing is lost",
    type: "COMMAND",
    contentType: "TEXT",
    language: "bash",
    content: `# Undo the commit, keep the changes staged
git reset --soft HEAD~1

# Amend the message instead
git commit --amend -m "fix: correct the message"

# Discard local changes to one file
git restore path/to/file.ts`,
    tags: ["git", "cli"],
    collectionId: "col_terminal_commands",
    isFavorite: true,
    isPinned: true,
    createdAt: "2026-08-25T13:55:00.000Z",
    updatedAt: "2026-09-06T12:10:00.000Z",
    lastAccessedAt: "2026-09-09T09:05:00.000Z",
  },
  {
    id: "item_cmd_docker_cleanup",
    title: "Reclaim Docker Disk Space",
    description: "Remove stopped containers, dangling images and unused volumes",
    type: "COMMAND",
    contentType: "TEXT",
    language: "bash",
    content: `# What is actually using the space
docker system df

# Remove stopped containers, unused networks and dangling images
docker system prune

# Include unused volumes — this deletes data, check first
docker system prune --volumes`,
    tags: ["docker", "cli", "cleanup"],
    collectionId: "col_terminal_commands",
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-08-26T15:30:00.000Z",
    updatedAt: "2026-09-01T10:00:00.000Z",
    lastAccessedAt: "2026-09-07T12:45:00.000Z",
  },
  {
    id: "item_cmd_kill_port",
    title: "Kill Whatever Owns Port 3000",
    description: "For when the dev server swears the port is still in use",
    type: "COMMAND",
    contentType: "TEXT",
    language: "bash",
    content: `# See what is listening
lsof -i :3000

# Kill it
lsof -ti :3000 | xargs kill -9

# Linux alternative
fuser -k 3000/tcp`,
    tags: ["cli", "processes", "debugging"],
    collectionId: "col_terminal_commands",
    isFavorite: true,
    isPinned: false,
    createdAt: "2026-08-28T08:20:00.000Z",
    updatedAt: "2026-09-04T17:30:00.000Z",
    lastAccessedAt: "2026-09-08T20:10:00.000Z",
  },
  {
    id: "item_cmd_npm_audit",
    title: "Audit and Update Dependencies",
    description: "Find what is outdated or vulnerable before it finds you",
    type: "COMMAND",
    contentType: "TEXT",
    language: "bash",
    content: `# What is behind
npm outdated

# Known vulnerabilities
npm audit

# Apply non-breaking fixes only
npm audit fix

# Clean reinstall from the lockfile
rm -rf node_modules && npm ci`,
    tags: ["npm", "cli", "dependencies"],
    collectionId: "col_terminal_commands",
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-08-30T14:15:00.000Z",
    updatedAt: "2026-09-02T09:50:00.000Z",
    lastAccessedAt: "2026-09-06T18:25:00.000Z",
  },

  /* --- Design Resources: 4 links --------------------------------------- */
  {
    id: "item_link_tailwind",
    title: "Tailwind CSS Documentation",
    description: "Utility reference and the theme configuration guide",
    type: "LINK",
    contentType: "URL",
    url: "https://tailwindcss.com/docs",
    tags: ["css", "tailwind", "reference"],
    collectionId: "col_design_resources",
    isFavorite: true,
    isPinned: false,
    createdAt: "2026-08-29T16:15:00.000Z",
    updatedAt: "2026-09-04T09:35:00.000Z",
    lastAccessedAt: "2026-09-09T08:40:00.000Z",
  },
  {
    id: "item_link_shadcn",
    title: "shadcn/ui",
    description: "Copy-in components built on Radix — the base this project uses",
    type: "LINK",
    contentType: "URL",
    url: "https://ui.shadcn.com",
    tags: ["components", "react", "ui"],
    collectionId: "col_design_resources",
    isFavorite: true,
    isPinned: false,
    createdAt: "2026-08-31T10:05:00.000Z",
    updatedAt: "2026-08-31T10:05:00.000Z",
    lastAccessedAt: "2026-09-08T11:30:00.000Z",
  },
  {
    id: "item_link_primer",
    title: "GitHub Primer Design System",
    description: "A real design system to steal structure and naming from",
    type: "LINK",
    contentType: "URL",
    url: "https://primer.style",
    tags: ["design-system", "reference", "ui"],
    collectionId: "col_design_resources",
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-09-01T13:20:00.000Z",
    updatedAt: "2026-09-01T13:20:00.000Z",
    lastAccessedAt: "2026-09-05T16:50:00.000Z",
  },
  {
    id: "item_link_lucide",
    title: "Lucide Icons",
    description: "Searchable icon set — the one wired into item-visuals.ts",
    type: "LINK",
    contentType: "URL",
    url: "https://lucide.dev",
    tags: ["icons", "ui", "reference"],
    collectionId: "col_design_resources",
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-09-02T11:40:00.000Z",
    updatedAt: "2026-09-02T11:40:00.000Z",
    lastAccessedAt: "2026-09-07T09:15:00.000Z",
  },
];

/* -------------------------------------------------------------------------- */
/* Seed                                                                       */
/* -------------------------------------------------------------------------- */

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  try {
    // 1. Demo user. Keyed on email so a re-run reuses the same row even if the
    //    id were ever regenerated.
    const user = await prisma.user.upsert({
      where: { email: DEMO_USER.email },
      update: { name: DEMO_USER.name, emailVerified: new Date() },
      create: { ...DEMO_USER, emailVerified: new Date(), plan: "FREE" },
    });

    // 2. System item types: global rows shared by every user.
    for (const type of SYSTEM_ITEM_TYPES) {
      await prisma.itemType.upsert({
        where: { systemKey: type.systemKey },
        update: { name: type.name, icon: type.icon, color: type.color },
        create: { ...type, isSystem: true, userId: null },
      });
    }

    const systemTypes = await prisma.itemType.findMany({
      where: { isSystem: true },
      select: { id: true, systemKey: true },
    });
    const typeIdByKey = new Map(
      systemTypes.map((type) => [type.systemKey as SystemItemType, type.id]),
    );

    // 3. Collections.
    for (const collection of COLLECTIONS) {
      const { id, createdAt, updatedAt, ...rest } = collection;
      await prisma.collection.upsert({
        where: { id },
        update: { ...rest, updatedAt: new Date(updatedAt) },
        create: {
          id,
          ...rest,
          userId: user.id,
          createdAt: new Date(createdAt),
          updatedAt: new Date(updatedAt),
        },
      });
    }

    // 4. Tags, deduplicated across every item.
    const tagNames = [...new Set(ITEMS.flatMap((item) => item.tags))].sort();
    const tagIdByName = new Map<string, string>();
    for (const name of tagNames) {
      const tag = await prisma.tag.upsert({
        where: { userId_name: { userId: user.id, name } },
        update: {},
        create: { userId: user.id, name },
      });
      tagIdByName.set(name, tag.id);
    }

    // 5. Items, plus their collection and tag join rows.
    for (const item of ITEMS) {
      const itemTypeId = typeIdByKey.get(item.type);
      if (!itemTypeId) {
        throw new Error(`No seeded item type for ${item.type}`);
      }

      const fields = {
        title: item.title,
        description: item.description,
        contentType: item.contentType,
        content: item.content ?? null,
        url: item.url ?? null,
        language: item.language ?? null,
        isFavorite: item.isFavorite ?? false,
        isPinned: item.isPinned ?? false,
        lastAccessedAt: item.lastAccessedAt ? new Date(item.lastAccessedAt) : null,
        itemTypeId,
        updatedAt: new Date(item.updatedAt),
      };

      await prisma.item.upsert({
        where: { id: item.id },
        update: fields,
        create: {
          id: item.id,
          userId: user.id,
          createdAt: new Date(item.createdAt),
          ...fields,
        },
      });

      await prisma.itemCollection.upsert({
        where: {
          itemId_collectionId: { itemId: item.id, collectionId: item.collectionId },
        },
        update: {},
        create: { itemId: item.id, collectionId: item.collectionId },
      });

      for (const name of item.tags) {
        const tagId = tagIdByName.get(name);
        if (!tagId) continue;
        await prisma.itemTag.upsert({
          where: { itemId_tagId: { itemId: item.id, tagId } },
          update: {},
          create: { itemId: item.id, tagId },
        });
      }
    }

    // 6. Report.
    const [types, collections, items, tags] = await Promise.all([
      prisma.itemType.count({ where: { isSystem: true } }),
      prisma.collection.count({ where: { userId: user.id } }),
      prisma.item.count({ where: { userId: user.id } }),
      prisma.tag.count({ where: { userId: user.id } }),
    ]);

    console.log(`Seeded ${user.email}`);
    console.log(`  system item types  ${types}`);
    console.log(`  collections        ${collections}`);
    console.log(`  items              ${items}`);
    console.log(`  tags               ${tags}`);

    const perCollection = await prisma.collection.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
      select: { name: true, _count: { select: { items: true } } },
    });
    console.log("\nItems per collection:");
    for (const collection of perCollection) {
      console.log(`  ${collection.name.padEnd(18)} ${collection._count.items}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
