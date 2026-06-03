---
description: Add a new BanRep indicator from a suameca.banrep.gov.co series ID
---

## Input

The user provides:
- A BanRep series ID (e.g. `15271`) or graficador URL (e.g. `https://suameca.banrep.gov.co/graficador-interactivo/grafica/15271`)
- The `positiveDirection` (`up` for growth indicators, `down` for debt/inflation)

## Steps

### 1. Extract the series ID

If the user gave a URL, extract the numeric ID from the path (e.g. `15271`).

### 2. Fetch metadata from the BanRep graficador API

Fetch `https://suameca.banrep.gov.co/graficador-series/rest/graficadorService/consultaSerieParaGraficar?idSerie={seriesId}` and extract:

| Response field | Maps to |
|---|---|
| `nombre` | manifest `label` (clean up, translate if needed) |
| `notas` | manifest `description` (trim to a concise sentence) |
| `unidad` | manifest `unit` (e.g. `"%"`, `"Millones de dolares"`) |
| `datos` | array of `[timestamp_ms, value]` pairs — the actual time series |
| `periodicidad` or infer from data gaps | periodicity (monthly, quarterly, annual) |

### 3. Add enum value to `data/economy.ts`

- Add an entry to `EconomyIndicators` in **alphabetical order**
- Add the indicator to the appropriate `ECONOMY_CATEGORIES` entry

### 4. Add manifest constant to `data/economy.ts`

Create `{NAME}_MANIFEST` using `indicatorManifest.parse({...})`:

```typescript
export const {NAME}_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Economia}_${EconomyIndicators.Y}`,
  sector: Sector.Economia,
  label: '...',             // from metadata `nombre`, cleaned up
  description: '...',       // from metadata `notas`, trimmed
  source: 'Banco de la Republica',
  sourceUrl: 'https://suameca.banrep.gov.co/graficador-interactivo/grafica/{seriesId}',
  resourceId: '{seriesId}', // the numeric series ID as a string
  queryKey: '...',          // camelCase identifier (e.g. 'gdpGrowth')
  unit: '...',              // from metadata `unidad`
  cacheTTL: 604800,         // 7 days for economic indicators
  positiveDirection: '...', // from user input
})
```

Note: `orderField` and `limit` are omitted — they are optional and only used by Socrata indicators.

### 5. Create the data hook

File: `features/economia/api/use-{kebab-name}.ts`

The hook must:
- Define a Zod schema for the BanRep API response (array of `[timestamp_ms, value]` tuples inside a wrapper object)
- Transform each `[timestamp_ms, value]` pair into `{ date: Date, count: number }` to match the shared `CountRow` interface
- Export the row type
- Use `createBanrepIndicator` to generate both hooks:

```typescript
import { {NAME}_MANIFEST } from '@/data/economy'
import { createBanrepIndicator } from '@/lib/create-banrep-indicator'

export const { useRaw: use{Name}, useByYear: use{Name}ByYear } =
  createBanrepIndicator({NAME}_MANIFEST)
```

The `createBanrepIndicator` factory handles:
- Fetching from `https://suameca.banrep.gov.co/graficador-series/rest/graficadorService/consultaSerieParaGraficar?idSerie={resourceId}`
- Parsing `[timestamp_ms, value]` pairs via Zod
- Transforming to `{ date: Date, count: number }` rows
- Returning `{ useRaw, useByYear }` hooks (same interface as `createSocrataIndicator`)

### 6. Wire into the sector's annual indicators hook

File: `features/economia/hooks/use-annual-economy-indicators.ts`

- Import `use{Name}ByYear`
- Call the hook inside the main function
- Add the result to the returned `byId` record

## Infrastructure (one-time setup)

These files need to exist before adding the first BanRep indicator. If they don't exist yet, create them:

### `lib/api-client.ts` — add BanRep client

Add a `banrepApi` export alongside the existing `socrataApi`:

```typescript
/** Banco de la Republica graficador-series API client. */
export const banrepApi = {
  /** Fetch a time series by its numeric series ID. */
  series<T = unknown>(seriesId: string, options?: ApiOptions): Promise<T> {
    return apiRequest<T>(
      `https://suameca.banrep.gov.co/graficador-series/rest/graficadorService/consultaSerieParaGraficar`,
      { ...options, params: { idSerie: seriesId } }
    )
  },
}
```

### `lib/create-banrep-indicator.ts` — factory

Similar to `create-socrata-indicator.ts` but:
- Calls `banrepApi.series(manifest.resourceId)` instead of `socrataApi.resource()`
- Parses the response `datos` field as `z.array(z.tuple([z.number(), z.number()]))`
- Maps each `[ts, value]` to `{ date: new Date(ts), count: value }`
- Feeds through `useIndicatorByYear` the same way Socrata indicators do

### `data/types.ts` — make Socrata-specific fields optional

`orderField` and `limit` must be `.optional()` since BanRep indicators don't use them.

## Reference files

- Sector enum: `config/sectors.tsx`
- Manifest type: `data/types.ts`
- Economy data: `data/economy.ts`
- BanRep factory: `lib/create-banrep-indicator.ts`
- Socrata factory (reference): `lib/create-socrata-indicator.ts`
- Shared hook: `hooks/use-indicator-by-year.ts`
- Events: `data/events.ts`
- API client: `lib/api-client.ts`
- Example Socrata indicators: `features/seguridad/api/indicators.ts`

## Known series IDs

| Indicator | Series ID | Periodicity |
|---|---|---|
| PIB real (quarterly growth) | 15271 | Quarterly |
| PIB real (annual growth) | 15294 | Annual |
| Inflacion total (monthly) | 15270 | Monthly |
| Inflacion anual | 15387 | Annual |
| Remesas (monthly) | 15363 | Monthly |
| Remesas (annual) | 15365 | Annual |
| Deuda externa (% PIB) | 15329 | Monthly |
| Deuda externa (USD) | 15330 | Monthly |
| Cuenta corriente (% PIB) | 15311 | Annual |
| PIB nominal (quarterly) | 15304 | Quarterly |
