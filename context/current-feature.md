# current feature

<!-- feature name and description-->

# status

<!-- not started| in progress| completed -->

completed

# requirement

<!-- goals and requiremnets-->

# Notes

<!-- any extra notes -->

# History

<!-- keep this updated. Earliest to late -->

- 2026-09-06 — Initial commit from Create Next App (`71172d0`).
- 2026-09-06 — `chore: initial Next.js setup and context files` (`c1ed529`): removed CNA boilerplate, reduced `globals.css` to the Tailwind v4 import, added `context/` docs. Pushed to `origin/main` (github.com/muscabxasan122-blip/devtash). **Completed.**
- 2026-09-07 — Branch `feature/mock-data`: added `src/lib/mock-data.ts` plus dashboard design screenshots (`55df222`, `6ee260c`). Build, lint and typecheck pass. Merged to `main` and pushed. **Completed.**
- 2026-09-07 — Added `context/feature/` with the three dashboard UI phase specs (`dashboard-phase-1-spec.md` … `-3-`). Their cross-references were rewritten from `@context/features/` to `@context/feature/`, and a `mock-data.js` → `mock-data.ts` typo in the phase 3 spec was fixed.
- 2026-09-07 — Branch `feature/dashboard-phase-1`: **Dashboard UI Phase 1 of 3 — shell and top bar.** Initialised shadcn/ui on the **Radix** base with the **Nova** preset (`components.json` style `radix-nova`, Lucide icons) and added `button` + `input`. Added the `/dashboard` route: `src/app/dashboard/layout.tsx`, `src/app/dashboard/page.tsx` and `src/components/dashboard/top-bar.tsx`. Dark mode is a hardcoded `dark` class plus `color-scheme: dark` on `<html>` — no toggle. The top bar spans the full width with the `DS` logo inside it, a centred search with a ⌘K hint, and `New Collection` + `New Item` outline buttons (display only; `New Collection` hides below `sm`). Sidebar and main are `h2` placeholders below the bar. Layout follows the reference screenshot the user supplied, which differs from `context/screenshots/dashboard-ui-main.png` (that one puts the logo in the sidebar column). Also repointed `--font-sans` / `--font-mono` in `globals.css` at the Geist variables — the shadcn preset emits a self-referential `--font-sans: var(--font-sans)` that resolves to nothing. Build, lint and a browser check at 1440px and 390px all pass. **Completed.**
- Next up: phase 2 (`@context/feature/dashboard-phase-2-spec.md`, collapsible sidebar), then phase 3 (`@context/feature/dashboard-phase-3-spec.md`, main area).
