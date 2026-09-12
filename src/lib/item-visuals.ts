/**
 * Icon and colour lookups for the system item types.
 *
 * `MOCK_ITEM_TYPES` stores an icon name and a hex colour, neither of which can
 * be used directly in JSX or Tailwind. These maps translate them into a Lucide
 * component and a static utility class (no inline styles), keyed by the type's
 * `systemKey` so the mapping stays exhaustive.
 */

import {
  Code2,
  File,
  Image as ImageIcon,
  Link2,
  Sparkles,
  StickyNote,
  Terminal,
  type LucideIcon,
} from "lucide-react";

import type { SystemItemType } from "@/lib/mock-data";

/**
 * Canonical display order for the system types. The icon row on a collection
 * card follows it, and it breaks ties when two types are equally common.
 */
export const SYSTEM_ITEM_TYPE_ORDER: SystemItemType[] = [
  "SNIPPET",
  "PROMPT",
  "COMMAND",
  "NOTE",
  "FILE",
  "IMAGE",
  "LINK",
];

export const ITEM_TYPE_ICONS: Record<SystemItemType, LucideIcon> = {
  SNIPPET: Code2,
  PROMPT: Sparkles,
  COMMAND: Terminal,
  NOTE: StickyNote,
  FILE: File,
  IMAGE: ImageIcon,
  LINK: Link2,
};

/** Mirrors the `color` field on each item type. */
export const ITEM_TYPE_COLOR_CLASSES: Record<SystemItemType, string> = {
  SNIPPET: "text-blue-500",
  PROMPT: "text-violet-500",
  COMMAND: "text-orange-500",
  NOTE: "text-yellow-300",
  FILE: "text-gray-500",
  IMAGE: "text-pink-500",
  LINK: "text-emerald-500",
};

/** Left accent border for item rows, mirroring `ITEM_TYPE_COLOR_CLASSES`. */
export const ITEM_TYPE_ACCENT_CLASSES: Record<SystemItemType, string> = {
  SNIPPET: "border-l-blue-500",
  PROMPT: "border-l-violet-500",
  COMMAND: "border-l-orange-500",
  NOTE: "border-l-yellow-300",
  FILE: "border-l-gray-500",
  IMAGE: "border-l-pink-500",
  LINK: "border-l-emerald-500",
};

/** Tinted background for the icon tile on item rows. */
export const ITEM_TYPE_TILE_CLASSES: Record<SystemItemType, string> = {
  SNIPPET: "bg-blue-500/10",
  PROMPT: "bg-violet-500/10",
  COMMAND: "bg-orange-500/10",
  NOTE: "bg-yellow-300/10",
  FILE: "bg-gray-500/10",
  IMAGE: "bg-pink-500/10",
  LINK: "bg-emerald-500/10",
};

/**
 * Left accent border for collection cards, keyed by the `color` hex stored on
 * a collection. Unknown colours fall back to the neutral border.
 */
const COLLECTION_ACCENT_BY_HEX: Record<string, string> = {
  "#3b82f6": "border-l-blue-500",
  "#8b5cf6": "border-l-violet-500",
  "#f97316": "border-l-orange-500",
  "#fde047": "border-l-yellow-300",
  "#6b7280": "border-l-gray-500",
  "#ec4899": "border-l-pink-500",
  "#10b981": "border-l-emerald-500",
};

export function getCollectionAccentClass(color: string): string {
  return COLLECTION_ACCENT_BY_HEX[color.toLowerCase()] ?? "border-l-border";
}
