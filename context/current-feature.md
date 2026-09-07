# current feature

<!-- feature name and description-->

**Dashboard UI Phase 2 of 3 — sidebar.** Build the collapsible left sidebar for `/dashboard`: item type navigation, favourite and recent collections, a user avatar area, and a drawer toggle. Spec: `@context/feature/dashboard-phase-2-spec.md`.

# status

<!-- not started| in progress| completed -->

completed

# requirement

<!-- goals and requiremnets-->

- Collapsible sidebar
- Item types with links to `/items/TYPE` (e.g. `/items/snippets`)
- Favorite collections
- Most recent collections
- User avatar area at the bottom
- Drawer icon to open/close the sidebar
- Always a drawer on mobile view

# Notes

<!-- any extra notes -->

- Import data directly from `@src/lib/mock-data.ts` — no database yet.
- References: `@context/screenshots/dashboard-ui-main.png`, `@context/project-overview.md`, `@context/feature/dashboard-phase-1-spec.md`, `@context/feature/dashboard-phase-3-spec.md`.
- Phase 1 put the logo in the top bar rather than the sidebar column (differs from `dashboard-ui-main.png`); keep the sidebar consistent with that.
- `/items/TYPE` routes do not exist yet — links can point there regardless for now.

# History

<!-- keep this updated. Earliest to late -->

- 2026-09-06 — Initial commit from Create Next App (`71172d0`).
- 2026-09-06 — `chore: initial Next.js setup and context files` (`c1ed529`): removed CNA boilerplate, reduced `globals.css` to the Tailwind v4 import, added `context/` docs. Pushed to `origin/main` (github.com/muscabxasan122-blip/devtash). **Completed.**
- 2026-09-07 — Branch `feature/mock-data`: added `src/lib/mock-data.ts` plus dashboard design screenshots (`55df222`, `6ee260c`). Build, lint and typecheck pass. Merged to `main` and pushed. **Completed.**
- 2026-09-07 — Added `context/feature/` with the three dashboard UI phase specs (`dashboard-phase-1-spec.md` … `-3-`). Their cross-references were rewritten from `@context/features/` to `@context/feature/`, and a `mock-data.js` → `mock-data.ts` typo in the phase 3 spec was fixed.
- 2026-09-07 — Branch `feature/dashboard-phase-1`: **Dashboard UI Phase 1 of 3 — shell and top bar.** Initialised shadcn/ui on the **Radix** base with the **Nova** preset (`components.json` style `radix-nova`, Lucide icons) and added `button` + `input`. Added the `/dashboard` route: `src/app/dashboard/layout.tsx`, `src/app/dashboard/page.tsx` and `src/components/dashboard/top-bar.tsx`. Dark mode is a hardcoded `dark` class plus `color-scheme: dark` on `<html>` — no toggle. The top bar spans the full width with the `DS` logo inside it, a centred search with a ⌘K hint, and `New Collection` + `New Item` outline buttons (display only; `New Collection` hides below `sm`). Sidebar and main are `h2` placeholders below the bar. Layout follows the reference screenshot the user supplied, which differs from `context/screenshots/dashboard-ui-main.png` (that one puts the logo in the sidebar column). Also repointed `--font-sans` / `--font-mono` in `globals.css` at the Geist variables — the shadcn preset emits a self-referential `--font-sans: var(--font-sans)` that resolves to nothing. Build, lint and a browser check at 1440px and 390px all pass. **Completed.**
- 2026-09-07 — Branch `feature/dashboard-phase-2`: **Dashboard UI Phase 2 of 3 — sidebar.** Added `sidebar-context.tsx` (client provider holding `collapsed` for desktop and `mobileOpen` for the drawer; a single `toggleSidebar()` reads `matchMedia("(min-width: 768px)")` at click time so nothing viewport-dependent is rendered, and a `change` listener closes the drawer when the viewport grows past `md`), `sidebar-nav.tsx` (shared by both presentations: collapsible **Types** group linking to `/items/{slug}` with coloured icon and item count, **Collections** group split into `FAVORITES` and `RECENT`, and the user area pinned at the bottom), `app-sidebar.tsx` (`<aside>` animating `w-64` ↔ `w-14` above `md`, plus a left `Sheet` that is the only sidebar below `md`), and `sidebar-toggle.tsx` (the `PanelLeft` button, placed in the top bar next to the logo as in the screenshot). Added `src/lib/item-visuals.ts` mapping each `systemKey` to a Lucide component and a static Tailwind colour class — the mock data's `icon`/`color` strings can't be used directly and inline styles are off-limits. Added `getRecentCollections()` to `mock-data.ts`; installed shadcn `sheet` and `separator`. The dashboard layout became a real app shell (`h-svh overflow-hidden`, main scrolls internally) instead of phase 1's `min-h-svh` — phase 3 fills that scroll container. Two deliberate departures: the second collections group is labelled **RECENT** per the spec rather than the screenshot's *ALL COLLECTIONS*, with favourites filtered out so rows aren't duplicated; and collection rows link to `/collections/{id}`, which the spec didn't specify. Build and lint pass; driven in a browser at 1440px and 390px (rail collapse, group collapse, drawer open/close, Escape, link-click closes the drawer, resize-to-desktop dismisses it, no console errors). `/items/*` and `/collections/*` still 404 — those routes are a later feature. **Completed.**
- Next up: phase 3 (`@context/feature/dashboard-phase-3-spec.md`, main area).
