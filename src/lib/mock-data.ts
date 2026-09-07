/**
 * Single source of truth for mock data until the database lands.
 *
 * Shapes mirror the draft Prisma models in `context/project-overview.md`, with
 * two deliberate simplifications for the UI phase:
 *  - tags are plain strings on the item instead of a Tag/ItemTag join
 *  - item ↔ collection is modelled as `collectionIds` on the item, so a
 *    collection never owns items exclusively (still many-to-many)
 *
 * Counts shown in the UI (sidebar badges, "12 items") are derived from
 * MOCK_ITEMS rather than hardcoded, so the data stays internally consistent.
 */

export type Plan = "FREE" | "PRO";

export type ItemContentType = "TEXT" | "FILE" | "URL";

export type SystemItemType =
  | "SNIPPET"
  | "PROMPT"
  | "COMMAND"
  | "NOTE"
  | "FILE"
  | "IMAGE"
  | "LINK";

export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  plan: Plan;
  createdAt: string;
}

export interface ItemType {
  id: string;
  systemKey: SystemItemType;
  /** Plural label used in the sidebar, e.g. "Snippets". */
  name: string;
  /** Lucide icon name. */
  icon: string;
  color: string;
  contentType: ItemContentType;
  isSystem: boolean;
  /** File and Image are Pro-gated in the product. */
  isPro: boolean;
  /** Route segment under /items. */
  slug: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  /** Accent colour for the card's left border. */
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  typeId: string;
  contentType: ItemContentType;
  /** Text/code/markdown body. Null for file, image and link items. */
  content: string | null;
  /** Set for link items. */
  url: string | null;
  /** Syntax-highlighting hint for text/code content. */
  language: string | null;
  /** R2 metadata, set for file and image items. */
  fileName: string | null;
  fileSize: number | null;
  mimeType: string | null;
  tags: string[];
  collectionIds: string[];
  isFavorite: boolean;
  isPinned: boolean;
  lastAccessedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/* User                                                                       */
/* -------------------------------------------------------------------------- */

export const MOCK_USER: User = {
  id: "user_1",
  name: "John Doe",
  email: "john@example.com",
  image: null,
  plan: "PRO",
  createdAt: "2024-01-02T09:00:00.000Z",
};

/* -------------------------------------------------------------------------- */
/* Item types                                                                 */
/* -------------------------------------------------------------------------- */

export const MOCK_ITEM_TYPES: ItemType[] = [
  {
    id: "type_snippet",
    systemKey: "SNIPPET",
    name: "Snippets",
    icon: "Code2",
    color: "#3b82f6",
    contentType: "TEXT",
    isSystem: true,
    isPro: false,
    slug: "snippets",
  },
  {
    id: "type_prompt",
    systemKey: "PROMPT",
    name: "Prompts",
    icon: "Sparkles",
    color: "#8b5cf6",
    contentType: "TEXT",
    isSystem: true,
    isPro: false,
    slug: "prompts",
  },
  {
    id: "type_command",
    systemKey: "COMMAND",
    name: "Commands",
    icon: "Terminal",
    color: "#f97316",
    contentType: "TEXT",
    isSystem: true,
    isPro: false,
    slug: "commands",
  },
  {
    id: "type_note",
    systemKey: "NOTE",
    name: "Notes",
    icon: "StickyNote",
    color: "#fde047",
    contentType: "TEXT",
    isSystem: true,
    isPro: false,
    slug: "notes",
  },
  {
    id: "type_file",
    systemKey: "FILE",
    name: "Files",
    icon: "File",
    color: "#6b7280",
    contentType: "FILE",
    isSystem: true,
    isPro: true,
    slug: "files",
  },
  {
    id: "type_image",
    systemKey: "IMAGE",
    name: "Images",
    icon: "Image",
    color: "#ec4899",
    contentType: "FILE",
    isSystem: true,
    isPro: true,
    slug: "images",
  },
  {
    id: "type_link",
    systemKey: "LINK",
    name: "Links",
    icon: "Link2",
    color: "#10b981",
    contentType: "URL",
    isSystem: true,
    isPro: false,
    slug: "links",
  },
];

/* -------------------------------------------------------------------------- */
/* Collections                                                                */
/* -------------------------------------------------------------------------- */

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: "col_react_patterns",
    name: "React Patterns",
    description: "Common React patterns and hooks",
    isFavorite: true,
    color: "#3b82f6",
    createdAt: "2024-01-03T10:00:00.000Z",
    updatedAt: "2024-01-15T14:20:00.000Z",
  },
  {
    id: "col_python_snippets",
    name: "Python Snippets",
    description: "Useful Python code snippets",
    isFavorite: false,
    color: "#3b82f6",
    createdAt: "2024-01-04T11:30:00.000Z",
    updatedAt: "2024-01-11T09:15:00.000Z",
  },
  {
    id: "col_context_files",
    name: "Context Files",
    description: "AI context files for projects",
    isFavorite: true,
    color: "#6b7280",
    createdAt: "2024-01-05T08:45:00.000Z",
    updatedAt: "2024-01-14T16:05:00.000Z",
  },
  {
    id: "col_interview_prep",
    name: "Interview Prep",
    description: "Technical interview preparation",
    isFavorite: false,
    color: "#fde047",
    createdAt: "2024-01-06T13:10:00.000Z",
    updatedAt: "2024-01-13T18:40:00.000Z",
  },
  {
    id: "col_git_commands",
    name: "Git Commands",
    description: "Frequently used git commands",
    isFavorite: true,
    color: "#f97316",
    createdAt: "2024-01-07T07:20:00.000Z",
    updatedAt: "2024-01-12T10:55:00.000Z",
  },
  {
    id: "col_ai_prompts",
    name: "AI Prompts",
    description: "Curated AI prompts for coding",
    isFavorite: false,
    color: "#8b5cf6",
    createdAt: "2024-01-08T15:00:00.000Z",
    updatedAt: "2024-01-15T12:30:00.000Z",
  },
];

/* -------------------------------------------------------------------------- */
/* Items                                                                      */
/* -------------------------------------------------------------------------- */

export const MOCK_ITEMS: Item[] = [
  {
    id: "item_use_auth_hook",
    title: "useAuth Hook",
    description: "Custom authentication hook for React applications",
    typeId: "type_snippet",
    contentType: "TEXT",
    content: `import { useContext } from 'react'
import { AuthContext } from './AuthContext'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}`,
    url: null,
    language: "typescript",
    fileName: null,
    fileSize: null,
    mimeType: null,
    tags: ["react", "auth", "hooks"],
    collectionIds: ["col_react_patterns"],
    isFavorite: true,
    isPinned: true,
    lastAccessedAt: "2024-01-15T17:42:00.000Z",
    createdAt: "2024-01-15T09:00:00.000Z",
    updatedAt: "2024-01-15T09:00:00.000Z",
  },
  {
    id: "item_api_error_handling",
    title: "API Error Handling Pattern",
    description: "Fetch wrapper with exponential backoff retry logic",
    typeId: "type_snippet",
    contentType: "TEXT",
    content: `export async function fetchWithRetry(
  url: string,
  init?: RequestInit,
  retries = 3,
) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, init)
      if (res.ok) return res
      if (res.status < 500) throw new Error(\`Request failed: \${res.status}\`)
    } catch (error) {
      if (attempt === retries - 1) throw error
    }
    await new Promise((r) => setTimeout(r, 2 ** attempt * 250))
  }
  throw new Error('Unreachable')
}`,
    url: null,
    language: "typescript",
    fileName: null,
    fileSize: null,
    mimeType: null,
    tags: ["api", "typescript", "error-handling"],
    collectionIds: ["col_react_patterns", "col_interview_prep"],
    isFavorite: false,
    isPinned: true,
    lastAccessedAt: "2024-01-12T11:05:00.000Z",
    createdAt: "2024-01-12T08:30:00.000Z",
    updatedAt: "2024-01-12T08:30:00.000Z",
  },
  {
    id: "item_debounce_hook",
    title: "useDebounce Hook",
    description: "Debounce a fast-changing value, useful for search inputs",
    typeId: "type_snippet",
    contentType: "TEXT",
    content: `import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}`,
    url: null,
    language: "typescript",
    fileName: null,
    fileSize: null,
    mimeType: null,
    tags: ["react", "hooks", "performance"],
    collectionIds: ["col_react_patterns"],
    isFavorite: true,
    isPinned: false,
    lastAccessedAt: "2024-01-14T13:20:00.000Z",
    createdAt: "2024-01-09T10:15:00.000Z",
    updatedAt: "2024-01-14T13:20:00.000Z",
  },
  {
    id: "item_python_chunk",
    title: "Chunk a list in Python",
    description: "Split any iterable into fixed-size batches",
    typeId: "type_snippet",
    contentType: "TEXT",
    content: `from itertools import islice


def chunked(iterable, size):
    it = iter(iterable)
    while batch := list(islice(it, size)):
        yield batch`,
    url: null,
    language: "python",
    fileName: null,
    fileSize: null,
    mimeType: null,
    tags: ["python", "utils"],
    collectionIds: ["col_python_snippets", "col_interview_prep"],
    isFavorite: false,
    isPinned: false,
    lastAccessedAt: "2024-01-11T09:15:00.000Z",
    createdAt: "2024-01-08T14:40:00.000Z",
    updatedAt: "2024-01-11T09:15:00.000Z",
  },
  {
    id: "item_code_review_prompt",
    title: "Code Review Prompt",
    description: "Ask an LLM for a focused, non-nitpicky review",
    typeId: "type_prompt",
    contentType: "TEXT",
    content: `Review the following diff for correctness bugs, security issues, and
missed reuse of existing helpers. Ignore formatting and style.

For each finding give: the file and line, what breaks, and a concrete fix.
If you find nothing, say so plainly rather than inventing minor issues.

Diff:
{{diff}}`,
    url: null,
    language: "markdown",
    fileName: null,
    fileSize: null,
    mimeType: null,
    tags: ["prompt-engineering", "code-review"],
    collectionIds: ["col_ai_prompts"],
    isFavorite: true,
    isPinned: false,
    lastAccessedAt: "2024-01-15T12:30:00.000Z",
    createdAt: "2024-01-10T16:00:00.000Z",
    updatedAt: "2024-01-15T12:30:00.000Z",
  },
  {
    id: "item_better_api_prompt",
    title: "Better API Design Prompt",
    description: "Turn a rough endpoint idea into a consistent REST design",
    typeId: "type_prompt",
    contentType: "TEXT",
    content: `You are designing a REST API. Given the resource description below,
propose routes, request/response shapes, status codes, and error payloads.

Keep routes plural and resource-oriented. Flag anything that should be a
separate resource instead of a query parameter.

Resource:
{{resource}}`,
    url: null,
    language: "markdown",
    fileName: null,
    fileSize: null,
    mimeType: null,
    tags: ["prompt-engineering", "api"],
    collectionIds: ["col_ai_prompts"],
    isFavorite: false,
    isPinned: false,
    lastAccessedAt: "2024-01-13T10:10:00.000Z",
    createdAt: "2024-01-07T11:25:00.000Z",
    updatedAt: "2024-01-13T10:10:00.000Z",
  },
  {
    id: "item_git_undo_commit",
    title: "Undo last commit, keep changes",
    description: "Soft reset that leaves the working tree untouched",
    typeId: "type_command",
    contentType: "TEXT",
    content: "git reset --soft HEAD~1",
    url: null,
    language: "bash",
    fileName: null,
    fileSize: null,
    mimeType: null,
    tags: ["git", "cli"],
    collectionIds: ["col_git_commands"],
    isFavorite: true,
    isPinned: false,
    lastAccessedAt: "2024-01-15T08:05:00.000Z",
    createdAt: "2024-01-05T09:50:00.000Z",
    updatedAt: "2024-01-05T09:50:00.000Z",
  },
  {
    id: "item_jwt_refresh_command",
    title: "JWT refresh token curl",
    description: "Exchange a refresh token for a new access token",
    typeId: "type_command",
    contentType: "TEXT",
    content: `curl -X POST https://api.example.com/auth/refresh \\
  -H "Content-Type: application/json" \\
  -d '{"refreshToken":"$REFRESH_TOKEN"}'`,
    url: null,
    language: "bash",
    fileName: null,
    fileSize: null,
    mimeType: null,
    tags: ["auth", "api", "cli"],
    collectionIds: ["col_git_commands", "col_interview_prep"],
    isFavorite: false,
    isPinned: false,
    lastAccessedAt: "2024-01-12T15:35:00.000Z",
    createdAt: "2024-01-06T12:00:00.000Z",
    updatedAt: "2024-01-12T15:35:00.000Z",
  },
  {
    id: "item_prisma_migrate",
    title: "Create a Prisma migration",
    description: "Never use db push for schema evolution",
    typeId: "type_command",
    contentType: "TEXT",
    content: "npx prisma migrate dev --name descriptive_change",
    url: null,
    language: "bash",
    fileName: null,
    fileSize: null,
    mimeType: null,
    tags: ["prisma", "postgresql", "cli"],
    collectionIds: [],
    isFavorite: false,
    isPinned: false,
    lastAccessedAt: "2024-01-14T17:45:00.000Z",
    createdAt: "2024-01-04T10:05:00.000Z",
    updatedAt: "2024-01-14T17:45:00.000Z",
  },
  {
    id: "item_auth_notes",
    title: "NextAuth v5 session notes",
    description: "Gotchas when moving from v4 to v5",
    typeId: "type_note",
    contentType: "TEXT",
    content: `## NextAuth v5

- \`auth()\` replaces \`getServerSession()\` in server components
- Config lives in a root \`auth.ts\` that exports \`handlers\`, \`auth\`, \`signIn\`, \`signOut\`
- The middleware matcher should exclude \`/api/auth\` and static assets
- Never trust a client-supplied \`userId\` — read it from \`auth()\` on the server`,
    url: null,
    language: "markdown",
    fileName: null,
    fileSize: null,
    mimeType: null,
    tags: ["nextjs", "authentication"],
    collectionIds: ["col_context_files"],
    isFavorite: false,
    isPinned: false,
    lastAccessedAt: "2024-01-14T16:05:00.000Z",
    createdAt: "2024-01-03T13:30:00.000Z",
    updatedAt: "2024-01-14T16:05:00.000Z",
  },
  {
    id: "item_system_design_notes",
    title: "System design checklist",
    description: "Questions to work through before whiteboarding",
    typeId: "type_note",
    contentType: "TEXT",
    content: `1. What are the read/write ratios?
2. What is the expected QPS at peak?
3. Which parts must be strongly consistent?
4. Where does the data live, and how is it indexed?
5. What breaks first under 10x load?`,
    url: null,
    language: "markdown",
    fileName: null,
    fileSize: null,
    mimeType: null,
    tags: ["interview", "architecture"],
    collectionIds: ["col_interview_prep"],
    isFavorite: false,
    isPinned: false,
    lastAccessedAt: "2024-01-13T18:40:00.000Z",
    createdAt: "2024-01-02T17:10:00.000Z",
    updatedAt: "2024-01-13T18:40:00.000Z",
  },
  {
    id: "item_r2_docs_link",
    title: "Cloudflare R2 S3 compatibility",
    description: "Which S3 API operations R2 supports",
    typeId: "type_link",
    contentType: "URL",
    content: null,
    url: "https://developers.cloudflare.com/r2/api/s3/api/",
    language: null,
    fileName: null,
    fileSize: null,
    mimeType: null,
    tags: ["cloudflare", "storage", "docs"],
    collectionIds: [],
    isFavorite: true,
    isPinned: false,
    lastAccessedAt: "2024-01-15T11:00:00.000Z",
    createdAt: "2024-01-09T15:20:00.000Z",
    updatedAt: "2024-01-09T15:20:00.000Z",
  },
  {
    id: "item_prisma_docs_link",
    title: "Prisma relations reference",
    description: "Many-to-many and explicit join models",
    typeId: "type_link",
    contentType: "URL",
    content: null,
    url: "https://www.prisma.io/docs/orm/prisma-schema/data-model/relations",
    language: null,
    fileName: null,
    fileSize: null,
    mimeType: null,
    tags: ["prisma", "postgresql", "docs"],
    collectionIds: ["col_context_files"],
    isFavorite: false,
    isPinned: false,
    lastAccessedAt: "2024-01-10T09:40:00.000Z",
    createdAt: "2024-01-06T18:15:00.000Z",
    updatedAt: "2024-01-10T09:40:00.000Z",
  },
  {
    id: "item_project_context_file",
    title: "project-overview.md",
    description: "Product and architecture context for AI tools",
    typeId: "type_file",
    contentType: "FILE",
    content: null,
    url: null,
    language: null,
    fileName: "project-overview.md",
    fileSize: 48213,
    mimeType: "text/markdown",
    tags: ["context", "docs"],
    collectionIds: ["col_context_files"],
    isFavorite: false,
    isPinned: false,
    lastAccessedAt: "2024-01-15T10:25:00.000Z",
    createdAt: "2024-01-05T08:45:00.000Z",
    updatedAt: "2024-01-15T10:25:00.000Z",
  },
  {
    id: "item_schema_diagram",
    title: "Data model diagram",
    description: "Entity relationships for items, collections and tags",
    typeId: "type_image",
    contentType: "FILE",
    content: null,
    url: null,
    language: null,
    fileName: "data-model.png",
    fileSize: 262144,
    mimeType: "image/png",
    tags: ["architecture", "docs"],
    collectionIds: ["col_context_files"],
    isFavorite: false,
    isPinned: false,
    lastAccessedAt: "2024-01-11T14:50:00.000Z",
    createdAt: "2024-01-07T16:35:00.000Z",
    updatedAt: "2024-01-11T14:50:00.000Z",
  },
];

/* -------------------------------------------------------------------------- */
/* Derived helpers                                                            */
/* -------------------------------------------------------------------------- */

export function getItemType(typeId: string): ItemType | undefined {
  return MOCK_ITEM_TYPES.find((type) => type.id === typeId);
}

export function getCollection(collectionId: string): Collection | undefined {
  return MOCK_COLLECTIONS.find((collection) => collection.id === collectionId);
}

export function getItemsByType(typeId: string): Item[] {
  return MOCK_ITEMS.filter((item) => item.typeId === typeId);
}

export function getItemsByCollection(collectionId: string): Item[] {
  return MOCK_ITEMS.filter((item) => item.collectionIds.includes(collectionId));
}

export function getCollectionsForItem(item: Item): Collection[] {
  return item.collectionIds
    .map(getCollection)
    .filter((collection): collection is Collection => collection !== undefined);
}

/** Item types present in a collection — drives the icon row on collection cards. */
export function getCollectionItemTypes(collectionId: string): ItemType[] {
  const typeIds = new Set(
    getItemsByCollection(collectionId).map((item) => item.typeId),
  );
  return MOCK_ITEM_TYPES.filter((type) => typeIds.has(type.id));
}

/** Sidebar badge counts, keyed by item type id. */
export function getItemCountsByType(): Record<string, number> {
  return Object.fromEntries(
    MOCK_ITEM_TYPES.map((type) => [type.id, getItemsByType(type.id).length]),
  );
}

export function getPinnedItems(): Item[] {
  return MOCK_ITEMS.filter((item) => item.isPinned);
}

export function getFavoriteItems(): Item[] {
  return MOCK_ITEMS.filter((item) => item.isFavorite);
}

export function getFavoriteCollections(): Collection[] {
  return MOCK_COLLECTIONS.filter((collection) => collection.isFavorite);
}

/** Collections ordered by most recently updated. */
export function getRecentCollections(limit = 5): Collection[] {
  return [...MOCK_COLLECTIONS]
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, limit);
}

export function getRecentItems(limit = 5): Item[] {
  return MOCK_ITEMS.filter((item) => item.lastAccessedAt !== null)
    .sort((a, b) => (a.lastAccessedAt! < b.lastAccessedAt! ? 1 : -1))
    .slice(0, limit);
}

/** Keyword search across title, description, content, url and tags. */
export function searchItems(query: string): Item[] {
  const term = query.trim().toLowerCase();
  if (!term) return MOCK_ITEMS;

  return MOCK_ITEMS.filter((item) =>
    [
      item.title,
      item.description,
      item.content ?? "",
      item.url ?? "",
      item.language ?? "",
      ...item.tags,
    ]
      .join(" ")
      .toLowerCase()
      .includes(term),
  );
}
