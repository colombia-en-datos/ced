import * as z from 'zod'
import {
  CONSULAR_ASSISTANCE_MANIFEST,
  DIASPORA_MANIFEST,
  RETURN_MIGRATION_MANIFEST,
  TREATIES_MANIFEST,
  VISAS_ISSUED_MANIFEST,
} from '@/data/international-relations'
import { createSocrataIndicator } from '@/lib/create-socrata-indicator'

// ---------------------------------------------------------------------------
// Shared schema: SoQL aggregation returns { ano, total }
// ---------------------------------------------------------------------------

const soqlAggSchema = z
  .object({
    ano: z.coerce.number(),
    total: z.coerce.number(),
  })
  .transform((row) => ({
    date: new Date(row.ano, 0, 1),
    count: row.total,
  }))

// ---------------------------------------------------------------------------
// Standard indicators (line chart + KPI)
// ---------------------------------------------------------------------------

export const { useByYear: useVisasIssuedByYear } = createSocrataIndicator(
  VISAS_ISSUED_MANIFEST,
  soqlAggSchema
)

export const { useByYear: useDiasporaByYear } = createSocrataIndicator(DIASPORA_MANIFEST, soqlAggSchema)

export const { useByYear: useReturnMigrationByYear } = createSocrataIndicator(
  RETURN_MIGRATION_MANIFEST,
  soqlAggSchema
)

export const { useByYear: useTreatiesByYear } = createSocrataIndicator(TREATIES_MANIFEST, soqlAggSchema)

export const { useByYear: useConsularAssistanceByYear } = createSocrataIndicator(
  CONSULAR_ASSISTANCE_MANIFEST,
  soqlAggSchema
)
