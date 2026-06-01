# Colombia en Datos (CED)

Civic transparency platform displaying official Colombian government statistics. Every number must have a visible source. No backend, no database — fully client-side static app.

See @README.md for full project overview.

## Commands

```bash
pnpm dev          # development server
pnpm build        # static export → out/
pnpm lint         # eslint
pnpm type-check   # tsc --noEmit
```

## Architecture

**Static Next.js export → Cloudflare Pages. Zero server.** All data is fetched client-side from public APIs and cached in localStorage via TanStack DB `QueryCollection` + `LocalStorageCollection`.

Data flow: `manifest entry → QueryCollection → useLiveQuery → component`

Never fetch directly in components. Never add a backend or database.

## Project structure

Follows Bulletproof React — feature-based, unidirectional:

```
src/
├── app/              # Next.js App Router (layout, pages, [sector]/page.tsx)
├── components/       # Shared UI (kpi-card, source-badge, policy-marker, ticker)
├── components/ui/    # shadcn/ui — do not edit manually
├── config/
│   └── manifest.ts   # SINGLE SOURCE OF TRUTH for all KPIs and data sources
├── features/         # One folder per sector (seguridad, economia, educacion…)
│   └── [sector]/
│       ├── components/
│       ├── hooks/
│       └── types/
├── hooks/            # use-kpi.ts, use-cache.ts, use-manifest.ts
├── lib/              # collections.ts, socrata.ts, worldbank.ts, csv.ts
├── types/            # manifest.ts, sector.ts
└── utils/            # format.ts (Colombian locale numbers), delta.ts
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

Cache keys: `ced_{manifestId}_{YYYY-MM-DD}`

## IMPORTANT rules

- **Every number needs a `<SourceBadge>`** — no exceptions. This is the core trust mechanism.
- **No 3D charts, no decorative gradients on data series.** All charts must be honest flat 2D Recharts.
- **Policy event markers (`<PolicyMarker>`) are mandatory** on hero charts — they are the primary UX differentiator.
- **This app is read-only.** Never implement `onInsert`/`onUpdate`/`onDelete` on any collection.
- **`pnpm type-check` must pass** before committing any change.

## Environment variables

```bash
NEXT_PUBLIC_SOCRATA_TOKEN=   # optional, raises rate limit to 10k/hr
NEXT_PUBLIC_PROXY_URL=       # Cloudflare Worker URL for CORS-blocked DANE endpoints
```

## When compacting

Always preserve: the manifest entry structure, the list of implemented sectors, and any failing test or type error currently being fixed.