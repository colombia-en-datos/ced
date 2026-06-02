# Colombia en Datos (CED)

Civic transparency platform displaying official Colombian government statistics. Every number must have a visible source. No backend, no database — fully client-side static app.

See @README.md for full project overview.

## Commands

```bash
pnpm dev          # development server
pnpm build        # static export → out/
pnpm lint         # biome check --write
pnpm typecheck    # tsc --noEmit
```

## Architecture

**Static Next.js export → Cloudflare Pages. Zero server.** All data is fetched client-side from public APIs and cached in IndexedDB via TanStack Query `experimental_createQueryPersister`.

Data flow: `Socrata/API → Zod schema → useQuery hook → derived hooks → component`

Never fetch directly in components. Never add a backend or database.

## Project structure

Follows Bulletproof React — feature-based, unidirectional:

```
app/                # Next.js App Router (layout, pages, [sector]/page.tsx)
components/         # Shared UI (kpi-card, source-badge, sector-header, theme-toggle)
components/ui/      # shadcn/ui — do not edit manually
config/             # env.ts, sectors.ts
features/           # One folder per sector (seguridad, economia, educacion…)
  └── [sector]/
      ├── components/
      └── hooks/
hooks/              # Shared hooks
lib/                # api-client.ts, idb-storage.ts, react-query.ts
utils/              # format.ts (Colombian locale numbers)
```

**Import rule:** features import from shared (`components/hooks/lib/types/utils`) only. Features never import from each other. App composes features.

## File naming

- Components: `kebab-case.tsx`
- Hooks: `use-kebab-case.ts`
- Utilities/types: `kebab-case.ts`
- Folders: `kebab-case`

## Data manifest

Every KPI is declared in `src/config/manifest.ts` as a `ManifestEntry`. This drives source citations, cache TTL, chart annotations, and API queries. Never hardcode source names, endpoints, or TTLs outside this file.

```typescript
type ManifestEntry = {
  id: string                   // "seguridad_secuestros"
  sector: Sector
  label: string
  source: string               // "Policía Nacional"
  sourceUrl: string            // link to dataset landing page
  endpoint: string             // full API URL
  query?: string               // SoQL params for Socrata
  fields: { year: string; value: string }
  unit: string
  cacheTTL: number             // seconds
  positiveDirection: "up" | "down"
  policyEvents?: { year: number; label: string }[]
}
```

## API sources

- **datos.gov.co** — Socrata REST. Base: `https://www.datos.gov.co/resource/{id}.json`. Token in `NEXT_PUBLIC_SOCRATA_TOKEN`.
- **World Bank** — `https://api.worldbank.org/v2/country/CO/indicator/{indicator}?format=json`. Response data is at index `[1]`.
- **DANE** — CSV downloads, parsed with PapaParse. May need CORS proxy.
- **CORS proxy** — Cloudflare Worker for DANE endpoints. URL in `NEXT_PUBLIC_PROXY_URL`.

## Cache TTLs

| Data type | TTL |
|---|---|
| Security / crime | 86400s (1 day) |
| Economic / education | 604800s (7 days) |
| World Bank annual | 2592000s (30 days) |

Cache is persisted in IndexedDB. Cache busting is tied to `package.json` version via the persister's `buster` option — bump version on breaking schema changes.

## Coding conventions

- **English variable names** — all identifiers in English, even for Spanish domain concepts (`department` not `departamento`, `count` not `cantidad`). UI strings stay in Spanish.
- **camelCase outside API boundaries** — external APIs return snake_case. Transform at the boundary (Zod `.transform()`) and use camelCase everywhere else.
- **Proper React components** — no plain functions returning JSX arrays. Always use components with fragments.
- **Extract components** — when logic is specific to a concern (theme toggle, source badge), extract into its own component file.
- **Env vars via `@/config/env.ts`** — never use inline `process.env` in components. All env access goes through the typed `env` object or `isDev` export.
- **Validate API boundaries with Zod** — every external API response must be parsed through a Zod schema. Catches upstream breaking changes with clear errors instead of silent `NaN`s.
- **Hooks over component logic** — extract data logic into hooks to keep components as pure UI. Each hook should be small and single-purpose (one raw data hook, separate derived hooks for different views of the same data).

## IMPORTANT rules

- **Every number needs a `<SourceBadge>`** — no exceptions. This is the core trust mechanism.
- **No 3D charts, no decorative gradients on data series.** All charts must be honest flat 2D Recharts.
- **Policy event markers are mandatory** on hero charts — they are the primary UX differentiator.
- **This app is read-only.** Never add write operations.
- **`pnpm typecheck` must pass** before committing any change.

## Environment variables

```bash
NEXT_PUBLIC_SOCRATA_TOKEN=   # optional, raises rate limit to 10k/hr
NEXT_PUBLIC_PROXY_URL=       # Cloudflare Worker URL for CORS-blocked DANE endpoints
```

## When compacting

Always preserve: the manifest entry structure, the list of implemented sectors, and any failing test or type error currently being fixed.