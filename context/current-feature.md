# current feature

<!-- feature name and description-->

**Database — Prisma + Neon PostgreSQL.** Stand up the data layer: Neon serverless Postgres, Prisma ORM, the initial schema drawn from the draft models in `@context/project-overview.md`, the Auth.js/NextAuth models, and a first migration. Spec: `@context/feature/database-spec.md`.

# status

<!-- not started| in progress| completed -->

in progress

# requirement

<!-- goals and requiremnets-->

- Neon PostgreSQL (serverless), with the development branch in `DATABASE_URL`
- Prisma ORM wired into the app, with a single shared client instance
- Initial schema from the draft models: `User`, `Item`, `ItemType`, `Collection`, `ItemCollection`, `Tag`, `ItemTag`, plus the `Plan`, `ItemContentType` and `SystemItemType` enums
- NextAuth models: `Account`, `Session`, `VerificationToken`
- Indexes and cascade deletes as the draft specifies
- A first migration, created with `prisma migrate dev` — never `db push`

# Notes

<!-- any extra notes -->

- References: `@context/feature/database-spec.md`, `@context/project-overview.md` (§16 draft models, §18 data-model decisions), `@context/coding-standards.md` (Database section).
- **Decision — Prisma 7.** 2026-09-08: the user chose Prisma 7 deliberately, and the note in `project-overview.md` §"Prisma version note" about Prisma 8 being the current major is to be disregarded for this project. This bullet is the record that §-note asks for ("if the project deliberately stays on Prisma 7, document that decision in the repository"). Pin the major version in `package.json` so a later install can't drift onto 8.
- `DATABASE_URL` is set in `.env` (git-ignored via `.gitignore:34` `.env*`) and points at the Neon **development** branch. The value lives only on the machine — never in the repo, and never in a committed example file.
- The supplied connection string is the **pooled** (`-pooler`) endpoint. Pooled connections go through PgBouncer, which Prisma Migrate cannot run DDL over; if `prisma migrate dev` fails, the fix is the unpooled/direct Neon endpoint in a `DIRECT_URL` alongside it. Needs the direct string from the Neon dashboard when we get there.
- Read the upgrade guide and quickstart the spec links before writing any code — Prisma 7 has breaking changes:
  - https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
  - https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres
- The §16 schema is explicitly a **rough draft**. Validate relationships, indexes, enums, constraints and naming against the chosen Prisma version and the Auth.js Prisma adapter before migrating. The schema is expected to evolve.
- **Unresolved design decision** carried over from §18: system item types can be seeded globally as immutable records, or copied into each user's account (`ItemType.userId` is nullable in the draft to allow both). Pick one before the first migration — it is awkward to change afterwards.
- Ownership: every user-created row is scoped to its owner, and `userId` always comes from the server-side session, never from the client.
- Always migrations, never `db push`. `DATABASE_URL` points at the Neon **development** branch; production is a separate branch, and deployments run `prisma migrate deploy`.
- Secrets go in `.env` (git-ignored) — no connection strings in the repo.
- Out of scope: switching the dashboard over to the database. `@src/lib/mock-data.ts` stays the UI's source until a later feature migrates the reads.

# History

<!-- keep this updated. Earliest to late -->

- 2026-09-06 — Initial commit from Create Next App (`71172d0`).
- 2026-09-06 — `chore: initial Next.js setup and context files` (`c1ed529`): removed CNA boilerplate, reduced `globals.css` to the Tailwind v4 import, added `context/` docs. Pushed to `origin/main` (github.com/muscabxasan122-blip/devtash). **Completed.**
- 2026-09-07 — Branch `feature/mock-data`: added `src/lib/mock-data.ts` plus dashboard design screenshots (`55df222`, `6ee260c`). Build, lint and typecheck pass. Merged to `main` and pushed. **Completed.**
- 2026-09-07 — Added `context/feature/` with the three dashboard UI phase specs (`dashboard-phase-1-spec.md` … `-3-`). Their cross-references were rewritten from `@context/features/` to `@context/feature/`, and a `mock-data.js` → `mock-data.ts` typo in the phase 3 spec was fixed.
- 2026-09-07 — Branch `feature/dashboard-phase-1`: **Dashboard UI Phase 1 of 3 — shell and top bar.** Initialised shadcn/ui on the **Radix** base with the **Nova** preset (`components.json` style `radix-nova`, Lucide icons) and added `button` + `input`. Added the `/dashboard` route: `src/app/dashboard/layout.tsx`, `src/app/dashboard/page.tsx` and `src/components/dashboard/top-bar.tsx`. Dark mode is a hardcoded `dark` class plus `color-scheme: dark` on `<html>` — no toggle. The top bar spans the full width with the `DS` logo inside it, a centred search with a ⌘K hint, and `New Collection` + `New Item` outline buttons (display only; `New Collection` hides below `sm`). Sidebar and main are `h2` placeholders below the bar. Layout follows the reference screenshot the user supplied, which differs from `context/screenshots/dashboard-ui-main.png` (that one puts the logo in the sidebar column). Also repointed `--font-sans` / `--font-mono` in `globals.css` at the Geist variables — the shadcn preset emits a self-referential `--font-sans: var(--font-sans)` that resolves to nothing. Build, lint and a browser check at 1440px and 390px all pass. **Completed.**
- 2026-09-07 — Branch `feature/dashboard-phase-2`: **Dashboard UI Phase 2 of 3 — sidebar.** Added `sidebar-context.tsx` (client provider holding `collapsed` for desktop and `mobileOpen` for the drawer; a single `toggleSidebar()` reads `matchMedia("(min-width: 768px)")` at click time so nothing viewport-dependent is rendered, and a `change` listener closes the drawer when the viewport grows past `md`), `sidebar-nav.tsx` (shared by both presentations: collapsible **Types** group linking to `/items/{slug}` with coloured icon and item count, **Collections** group split into `FAVORITES` and `RECENT`, and the user area pinned at the bottom), `app-sidebar.tsx` (`<aside>` animating `w-64` ↔ `w-14` above `md`, plus a left `Sheet` that is the only sidebar below `md`), and `sidebar-toggle.tsx` (the `PanelLeft` button, placed in the top bar next to the logo as in the screenshot). Added `src/lib/item-visuals.ts` mapping each `systemKey` to a Lucide component and a static Tailwind colour class — the mock data's `icon`/`color` strings can't be used directly and inline styles are off-limits. Added `getRecentCollections()` to `mock-data.ts`; installed shadcn `sheet` and `separator`. The dashboard layout became a real app shell (`h-svh overflow-hidden`, main scrolls internally) instead of phase 1's `min-h-svh` — phase 3 fills that scroll container. Two deliberate departures: the second collections group is labelled **RECENT** per the spec rather than the screenshot's *ALL COLLECTIONS*, with favourites filtered out so rows aren't duplicated; and collection rows link to `/collections/{id}`, which the spec didn't specify. Build and lint pass; driven in a browser at 1440px and 390px (rail collapse, group collapse, drawer open/close, Escape, link-click closes the drawer, resize-to-desktop dismisses it, no console errors). `/items/*` and `/collections/*` still 404 — those routes are a later feature. **Completed.**
- 2026-09-08 — Branch `feature/dashboard-phase-3`: **Dashboard UI Phase 3 of 3 — main area.** Filled the scroll container phase 2 left behind. Added `dashboard-stats.tsx` (four cards — Items, Collections, Favorite Items, Favorite Collections — `grid-cols-2` stacking to `lg:grid-cols-4`; not in the screenshot, so designed to match), `collection-card.tsx` (left accent border in the collection's colour, name + star, item count, description, and the row of item-type icons), `item-row.tsx` (shared by Pinned and Recent Items: tinted type-icon tile, title with pin/star, right-aligned date, description, tag badges; an `accent` prop adds the left border used on the pinned rows), and `section-heading.tsx`. Added `src/lib/format.ts` — `formatShortDate` pins `Intl.DateTimeFormat` to UTC so the server-rendered "Jan 15" can't disagree with the client's timezone. Extended `item-visuals.ts` with `ITEM_TYPE_ACCENT_CLASSES`, `ITEM_TYPE_TILE_CLASSES` and `getCollectionAccentClass()` (hex → static Tailwind class, since collection colours are stored as hex and inline styles are off-limits). Installed shadcn `card` and `badge`. Everything is a server component reading `mock-data.ts` helpers; no `use client` was needed. One deliberate departure: the collections section is headed **Recent Collections** per the spec rather than the screenshot's *Collections*, ordered by `updatedAt` and capped at 6, with a "View all" link to `/collections`. The screenshot's per-card `...` menu was skipped — there is no menu behaviour to attach to it yet. Build and lint pass; driven in a headless browser at 1440px, 820px and 390px (no horizontal overflow at any width, sidebar collapse 1184→1384px, top bar stays put while main scrolls, mobile drawer still opens over the new content, all 19 links resolve to `/collections`, `/collections/{id}` and `/items/{id}`, no console errors). `/items/*` and `/collections/*` still 404 — those routes are a later feature. **Completed.**
- 2026-09-08 — Added `context/feature/database-spec.md` and documented the next feature here: **Database — Prisma + Neon PostgreSQL.** Set `DATABASE_URL` in the git-ignored `.env` (Neon development branch) and settled the version question: **Prisma 7**, deliberately, ignoring the Prisma 8 note in `project-overview.md`. Schema and migration still to come. **In progress.**
- Next up after the database: the `/items/*` and `/collections/*` routes the dashboard links into.
