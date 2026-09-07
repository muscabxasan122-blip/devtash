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
