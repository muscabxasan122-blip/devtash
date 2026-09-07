"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, Folder, Settings, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  ITEM_TYPE_COLOR_CLASSES,
  ITEM_TYPE_ICONS,
} from "@/lib/item-visuals";
import {
  getFavoriteCollections,
  getItemCountsByType,
  getItemsByCollection,
  getRecentCollections,
  MOCK_ITEM_TYPES,
  MOCK_USER,
} from "@/lib/mock-data";

const RECENT_COLLECTIONS_LIMIT = 5;

interface SidebarNavProps {
  /** Icon-rail mode. Never set inside the mobile drawer. */
  collapsed?: boolean;
  /** Called after a link is followed, so the mobile drawer can close itself. */
  onNavigate?: () => void;
}

interface SidebarSectionProps {
  title: string;
  collapsed: boolean;
  children: React.ReactNode;
}

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  collapsed: boolean;
  onNavigate?: () => void;
  trailing?: React.ReactNode;
}

/** A collapsible group of links, e.g. "Types". */
function SidebarSection({ title, collapsed, children }: SidebarSectionProps) {
  const [open, setOpen] = React.useState(true);
  // The rail has no room for the header, so its links are always shown.
  const contentVisible = collapsed || open;

  return (
    <div>
      {!collapsed && (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-[0.8rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {title}
          <ChevronDown
            aria-hidden
            className={cn(
              "size-3.5 transition-transform",
              !open && "-rotate-90",
            )}
          />
        </button>
      )}
      {contentVisible && <div className="mt-1 space-y-0.5">{children}</div>}
    </div>
  );
}

/** Small uppercase label separating groups of collections. */
function SidebarGroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-2 pt-3 pb-1 text-[0.65rem] font-medium tracking-wider text-muted-foreground uppercase">
      {children}
    </p>
  );
}

function SidebarLink({
  href,
  label,
  icon,
  collapsed,
  onNavigate,
  trailing,
}: SidebarLinkProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={cn(
        "flex h-8 items-center rounded-md text-[0.8rem] text-foreground transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        collapsed ? "justify-center px-0" : "gap-2.5 px-2",
      )}
    >
      {icon}
      {!collapsed && (
        <>
          <span className="min-w-0 flex-1 truncate">{label}</span>
          {trailing}
        </>
      )}
    </Link>
  );
}

export function SidebarNav({ collapsed = false, onNavigate }: SidebarNavProps) {
  const itemCounts = getItemCountsByType();
  const favoriteCollections = getFavoriteCollections();
  const favoriteIds = new Set(favoriteCollections.map((c) => c.id));
  // Favourites already have their own group, so keep the recents distinct.
  const recentCollections = getRecentCollections(
    RECENT_COLLECTIONS_LIMIT + favoriteIds.size,
  )
    .filter((collection) => !favoriteIds.has(collection.id))
    .slice(0, RECENT_COLLECTIONS_LIMIT);

  const initials = MOCK_USER.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <nav
        aria-label="Sidebar"
        className={cn(
          "min-h-0 flex-1 overflow-y-auto py-3",
          collapsed ? "px-2" : "px-3",
        )}
      >
        <SidebarSection title="Types" collapsed={collapsed}>
          {MOCK_ITEM_TYPES.map((type) => {
            const Icon = ITEM_TYPE_ICONS[type.systemKey];
            return (
              <SidebarLink
                key={type.id}
                href={`/items/${type.slug}`}
                label={type.name}
                collapsed={collapsed}
                onNavigate={onNavigate}
                icon={
                  <Icon
                    aria-hidden
                    className={cn(
                      "size-4 shrink-0",
                      ITEM_TYPE_COLOR_CLASSES[type.systemKey],
                    )}
                  />
                }
                trailing={
                  <span className="text-[0.75rem] text-muted-foreground tabular-nums">
                    {itemCounts[type.id]}
                  </span>
                }
              />
            );
          })}
        </SidebarSection>

        <Separator className="my-3" />

        <SidebarSection title="Collections" collapsed={collapsed}>
          {!collapsed && <SidebarGroupLabel>Favorites</SidebarGroupLabel>}
          {favoriteCollections.map((collection) => (
            <SidebarLink
              key={collection.id}
              href={`/collections/${collection.id}`}
              label={collection.name}
              collapsed={collapsed}
              onNavigate={onNavigate}
              icon={
                <Folder
                  aria-hidden
                  className="size-4 shrink-0 text-muted-foreground"
                />
              }
              trailing={
                <Star
                  aria-hidden
                  className="size-3.5 shrink-0 fill-yellow-400 text-yellow-400"
                />
              }
            />
          ))}

          {!collapsed && (
            <>
              <SidebarGroupLabel>Recent</SidebarGroupLabel>
              {recentCollections.map((collection) => (
                <SidebarLink
                  key={collection.id}
                  href={`/collections/${collection.id}`}
                  label={collection.name}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                  icon={
                    <Folder
                      aria-hidden
                      className="size-4 shrink-0 text-muted-foreground"
                    />
                  }
                  trailing={
                    <span className="text-[0.75rem] text-muted-foreground tabular-nums">
                      {getItemsByCollection(collection.id).length}
                    </span>
                  }
                />
              ))}
            </>
          )}
        </SidebarSection>
      </nav>

      <div
        className={cn(
          "flex shrink-0 items-center gap-2 border-t border-border py-3",
          collapsed ? "justify-center px-2" : "px-3",
        )}
      >
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-[0.7rem] font-semibold"
        >
          {initials}
        </span>
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[0.8rem] font-medium">
                {MOCK_USER.name}
              </span>
              <span className="block truncate text-[0.7rem] text-muted-foreground">
                {MOCK_USER.email}
              </span>
            </span>
            <Link
              href="/settings"
              onClick={onNavigate}
              aria-label="Settings"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <Settings aria-hidden className="size-4" />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
