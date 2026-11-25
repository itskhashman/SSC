# SSC Strategy Management

Strategy management tool for the Social Security Corporation. There is one
multi-year strategy (e.g. 2024–2026): Strategy → Objectives → Initiatives, with
weights, values per year and automatic scoring. There are **no perspectives
and no KPIs**; they were removed on purpose, so don't add them back. Three pages:
**Dashboard**, **Strategy management** and **Initiatives**, each with a year
filter. Next.js 15 App Router, statically exported to GitHub Pages under `/SSC`.
Bilingual (Arabic default, RTL / English), light and dark themes. Data lives in
the browser (`localStorage`); there is no backend yet. The app starts empty
and shows a "create strategy" card until a strategy exists. That card can also
load a small sample plan (`src/fixture/sampleData.ts`, 2024–2026).

## Git and commits

- **Never add Claude/AI attribution to commits or PRs.** No `Co-Authored-By`
  trailer and no "Generated with Claude Code" line.
- Pushing to `main` deploys to production (GitHub Pages).
- Only commit or push when asked.

## Data model (`src/domain/strategy.ts`)

- `Strategy { name, startYear, endYear }`. There is a single one, `null` until
  it is created. Saving a new range drops yearly values outside it.
- `Objective`: its weights add up to 100 across the whole strategy.
- `Initiative`: belongs to one objective. Its weights add up to 100 within that
  objective.
- `Initiative.yearly[year] = { weight, achievement }`:
  - `weight` is the share of the initiative planned for that year. The yearly
    weights add up to 100, and Yup enforces this.
  - `achievement` is the % of that year's share that was done.
  - Years with weight 0 are years the initiative doesn't run.
- The selected year lives in `uiStore.selectedYear`. Read it with
  `useSelectedYear()`, which clamps it into the strategy's range.
- Changing the shape of persisted data → bump `version` in `strategyStore` and
  extend `migrate`.
  - v4 removed perspectives and KPIs. `migrateV3` sets each objective's weight
    to objective weight × perspective weight ÷ 100.
  - v1 data and empty stores get the sample plan.

## Commands

```bash
npm run dev        # http://localhost:3000/SSC/  → redirects to /SSC/ar/dashboard/
npm run build      # static export to out/
npm run typecheck  # tsc --noEmit
npm run lint
```

- Node 26 (`.nvmrc`) and npm 12.0.2 — CI pins the same versions.
- `build` and `dev` share `.next/`; don't build while dev is running. If chunks
  break: stop dev, `rm -rf .next`, restart.

## Deployment

- `.github/workflows/deploy.yml` runs on push to `main`: `npm ci` → `npm run build`
  → uploads `out/` to GitHub Pages. Repo Settings → Pages → Source must be
  **GitHub Actions**. Otherwise the "Setup Pages" step fails with
  "Get Pages site failed… Not Found".
- `output: "export"`, `basePath: "/SSC"`, `trailingSlash: true`,
  `images.unoptimized`. No server: no middleware, API routes or runtime redirects.
- `basePath` in `next.config.ts` and `NEXT_PUBLIC_BASE_PATH` in `.env` must both
  equal the GitHub repo name. Rename the repo → change both.
- Root redirects are done with the App Router, not with files in `public/`:
  - `app/page.tsx` sends `/SSC/` to `/SSC/ar/dashboard/` (Arabic is the default).
  - `app/[locale]/page.tsx` sends `/SSC/<locale>/` to that locale's dashboard.
  - `app/layout.tsx` only passes `children` through. `<html>` and `<body>` are in
    `app/[locale]/layout.tsx`, because they need the locale for `lang` and `dir`.

## Tech choices (keep them)

- **UI:** shadcn/ui, `base-nova` style (Base UI primitives, not Radix). Compose
  with the `render` prop, not `asChild`. When a `Button` renders a `Link`, pass
  `nativeButton={false}`. Add components with `npx shadcn@latest add <name>`.
- **`cn`** comes from shadcn's `cn` package (re-exported by `@/lib/utils`). That
  is intentional.
- **Icons:** `lucide-react` only.
- **State:** Zustand (`src/store/`). Both stores use `persist` with
  `skipHydration: true`, and `StoreHydrator` rehydrates after mount so static
  HTML matches the first client render. Data-dependent views are wrapped in
  `HydrationGate`.
  - Read data through `useStrategyData()` / `useStrategyScores()`
    (`src/hooks/useStrategy.ts`). Never call `useStrategyStore(selectData)`
    without `useShallow`, because it loops.
- **Forms:** Formik + Yup. Every add/edit form is a `FormDialog`
  (`components/common/form/`) with fields from `FormFields.tsx`. Schemas live
  in `src/schemas/strategySchemas.ts`; messages come from the `validation`
  namespace.
- **i18n:** next-intl, copied from the Osus project. `src/i18n/{routing,request,navigation}.ts`,
  `messages/{ar,en}.json`. Use `Link`/`useRouter`/`usePathname` from
  `@/i18n/navigation`, not `next/link`. Every page calls `setRequestLocale`.
  - User-entered text is stored in both languages as `LocalizedText`
    (`{ ar, en }`). Show it with `useLocalize()`.
  - Use logical Tailwind classes (`ms-`, `pe-`, `start-`, `text-start`) so RTL works.

## Scoring (single source of truth)

- **Tunable numbers:** `src/config/scoring.ts`.
  - Achievement cap.
  - Status thresholds: ≥80% on track, ≥50% at risk.
  - `initiativeScore`: `cumulative` (default) or `annual`.
  - Weight total and the longest allowed strategy, in years.
- **Formulas:** `src/rules/scoring.ts`. These are pure functions, and each takes
  a `year` and an optional config. Every score is a ratio from 0 to 1, or `null`
  when there's no data.
- **Roll-up:**
  - An objective's score is the weighted average of its initiatives' scores
    (using the initiative weights).
  - The overall score is the weighted average of the objective scores (using the
    objective weights).
- **Initiative score:**
  - `annual`: the selected year's achievement.
  - `cumulative`: Σ(year weight × achievement) ÷ Σ(year weight), over the years
    up to the selected one. Years with no achievement entered are skipped.
  - Example with a 30/30/40 split, 100% achieved in year 1 and 80% in year 2:
    achieved 54% of the whole initiative against 60% planned, so the score is 90%.
- **How scores combine:**
  - Each level is a weighted average of its children.
  - Children without a score are skipped and the remaining weights are
    re-normalised.
  - If all weights are 0, the children count equally.
- **Sibling weight helpers:** `src/rules/weights.ts`. Forms block a weight above
  what's still available, and `WeightSummary` warns when siblings ≠ 100%.
- **Changing a business rule:** edit the config first, and change formulas only
  when the rule can't be expressed as config.

## Animation

- CSS only, using `tw-animate-css` classes. No animation library.
- Shared helpers are in `src/lib/motion.ts`:
  - `ENTER_UP` for cards and sections
  - `ENTER_ROW` for table rows
  - `staggerDelay(index)` for items that appear one after another
- `Reveal` wraps a section with an `index` for its order on the page.
- `app/[locale]/template.tsx` fades the page in on every navigation.
- `ScoreBar` grows from 0, `useCountUp` animates the overall score, and
  `GoldCard interactive` lifts on hover.
- `globals.css` turns every animation off under `prefers-reduced-motion`.
  Keep durations at 150–700 ms.

## Theme

- Colours are taken from the SSC website and live as tokens in `src/app/globals.css`:
  - olive green `--primary` / `--sidebar`
  - gold `--gold*` (`.gold-bar` utility for card tops)
  - cream `--background`
  - `--status-*` for score bands
- There is a `.dark` variant of every token.
- Don't hard-code hex values in components. Use the tokens (`bg-primary`,
  `text-gold`, `bg-status-at-risk/15`, …).
- Font: IBM Plex Sans Arabic via `next/font` (`--font-plex-arabic`).
- Logo: `src/assets/ssc-logo.png` (header) and `src/assets/ssc-emblem.png` (sidebar).

## Structure (`src/`)

| Folder | Holds |
|---|---|
| `app/[locale]/` | Routes. The layout sets `lang`/`dir`, providers and `AppShell`. Pages are thin and render a view. |
| `components/layout/` | `AppShell`, `AppSidebar` (always visible, collapses to icons), `UtilityBar`, `SiteHeader` |
| `components/dashboard/` | Dashboard view and widgets (charts use shadcn `chart` + Recharts) |
| `components/strategy/` | Management view, objectives panel, initiatives table, `InlineAchievementInput`, `forms/` dialogs (strategy, objective, initiative) |
| `components/initiatives/` | Initiatives page (all initiatives, objective filter) |
| `components/common/` | Shared pieces (GoldCard, PageTitle, StatusBadge, ScoreBar, ConfirmDialog, form/) |
| `components/ui/` | shadcn components. Edit sparingly. |
| `config/` | Scoring configuration |
| `domain/` | Types only |
| `rules/` | Pure logic (scoring, weights, years, locale) |
| `schemas/` | Yup schemas |
| `store/` | Zustand stores (`strategyStore` data, `uiStore` selection / year / font size) |
| `fixture/` | Sample plan, loaded only from the empty-state button |
