# current feature

<!-- feature name and description-->

**Mock data source of truth** — A single `src/lib/mock-data.ts` module holding the user, item types, collections and items that drive the dashboard UI, so the UI can be built before Prisma/Neon is wired up.

# status

<!-- not started| in progress| completed -->

completed

# requirement

- One file, `src/lib/mock-data.ts`, as the only place mock data lives
- Exported TypeScript interfaces mirroring the draft Prisma models: `User`, `ItemType`, `Collection`, `Item`
- All 7 system item types (snippet, prompt, command, note, file, image, link) with icon, colour and content type from the project overview
- 6 collections matching the dashboard screenshot (React Patterns, Python Snippets, Context Files, Interview Prep, Git Commands, AI Prompts)
- Items spanning every type, with tags, many-to-many collection membership, favourite/pin flags and `lastAccessedAt`
- Derived helpers for the UI: counts by type, items by collection, pinned/favourite/recent, keyword search
- No `any`; strict mode clean; `npm run build` passes

# Notes

- Item ↔ collection is modelled as `collectionIds: string[]` on the item, keeping the many-to-many relationship without a join table. Collections never own items exclusively.
- Tags are plain strings on the item rather than a `Tag`/`ItemTag` pair — the join model comes with the real schema.
- Sidebar badge counts and "N items" on collection cards are **derived** from `MOCK_ITEMS` via helpers, not hardcoded, so the numbers stay consistent with the data. They are therefore smaller than the counts drawn in the screenshot (24 snippets, 18 prompts, ...).
- Dates are ISO strings so the data stays serialisable across the server/client boundary.
- `MOCK_USER.plan` is `PRO` so the Pro-gated File/Image types are visible while building the UI.

# History

<!-- keep this updated. Earliest to late -->

- 2026-09-06 — Initial commit from Create Next App (`71172d0`).
- 2026-09-06 — `chore: initial Next.js setup and context files` (`c1ed529`): removed CNA boilerplate, reduced `globals.css` to the Tailwind v4 import, added `context/` docs. Pushed to `origin/main` (github.com/muscabxasan122-blip/devtash). **Completed.**
- 2026-09-07 — Branch `feature/mock-data`: added `src/lib/mock-data.ts` plus dashboard design screenshots. Build, lint and typecheck pass. Merged to `main`. **Completed.**
