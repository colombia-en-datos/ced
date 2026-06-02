---
description: Add a new Socrata indicator from a datos.gov.co URL
---

## Input

The user provides:
- A datos.gov.co dataset URL (e.g. `https://www.datos.gov.co/Seguridad-y-Defensa/HOMICIDIO/m8fd-ahd9/about_data`)
- The sector this indicator belongs to (e.g. `seguridad`, `economia`)
- The `positiveDirection` (`up` for enforcement/positive actions, `down` for crimes/negative events)

## Steps

### 1. Extract the resource ID from the URL

The resource ID is the `xxxx-xxxx` segment (e.g. `m8fd-ahd9`).

### 2. Fetch metadata from the Socrata views API

Fetch `https://www.datos.gov.co/api/views/{resourceId}.json` and extract:

| Metadata field | Maps to |
|---|---|
| `name` | manifest `label` (translate to Spanish title case if needed) |
| `description` | manifest `description` (trim to a concise sentence) |
| `attribution` | manifest `source` (e.g. "MinDefensa") |
| `columns[].fieldName` | Zod schema fields |
| `columns[].cachedContents.count` | total rows — use to set `limit` with ~30% headroom |
| `columns[].cachedContents.null` | if `> "0"` on `cantidad`, need `z.preprocess` for missing values |

### 3. Add enum value to the sector's data file

- File: `data/{sector}.ts` (e.g. `data/security.ts`)
- Add an entry to the sector's indicators enum in **alphabetical order**

### 4. Add manifest constant to the same data file

Create `{NAME}_MANIFEST` using `indicatorManifest.parse({...})`:

```typescript
export const {NAME}_MANIFEST = indicatorManifest.parse({
  id: `${Sector.X}_${SectorIndicators.Y}`,
  sector: Sector.X,
  label: '...',             // from metadata `name`
  description: '...',       // from metadata `description`
  source: '...',            // from metadata `attribution`, shortened
  sourceUrl: '...',         // the about_data URL the user provided
  resourceId: '...',        // from the URL
  queryKey: '...',          // camelCase identifier (e.g. 'homicides')
  orderField: '...',        // Socrata column to sort by (usually 'fecha_hecho')
  limit: ...,               // row count from metadata + ~30% headroom
  unit: '...',              // from metadata description or `unidad` column values
  cacheTTL: ...,            // 86400 for security, 604800 for economic/education, 2592000 for World Bank
  positiveDirection: '...', // from user input
})
```

### 5. Create the data hook

File: `features/{sector}/api/use-{kebab-name}.ts`

The hook must:
- Define a Zod row schema matching the column `fieldName`s from the metadata
- If `cantidad` (or the value field) has nulls per the metadata: use `z.preprocess((v) => (v == null ? 0 : v), z.coerce.number())` and add a comment explaining why
- `.transform()` all fields to camelCase (e.g. `fecha_hecho` -> `date`, `cantidad` -> `count`)
- Export the row type: `export type {Name}Row = z.output<typeof schema>`
- Use `createSocrataIndicator` to generate both hooks:

```typescript
export const { useRaw: use{Name}, useByYear: use{Name}ByYear } =
  createSocrataIndicator({NAME}_MANIFEST, rowSchema)
```

The row schema output MUST satisfy `{ date: Date; count: number }` (plus any extra fields).

### 6. Wire into the sector's annual indicators hook

File: `features/{sector}/hooks/use-annual-{sector}-indicators.ts`

- Import `use{Name}ByYear`
- Call the hook inside the main function
- Add the result to the returned `byId` record

## Reference files

- Sector enum: `config/sectors.tsx`
- Manifest type: `data/types.ts`
- Sector data files: `data/{sector}.ts`
- Factory: `lib/create-socrata-indicator.ts`
- Shared hook: `hooks/use-indicator-by-year.ts`
- Events: `data/events.ts`
- API client: `lib/api-client.ts`
- Example hook: `features/seguridad/api/use-extortion.ts`
