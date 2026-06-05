import * as z from 'zod'
import {
  ENVIRONMENTAL_CRIMES_MANIFEST,
  FOREST_AREA_MANIFEST,
  GHG_EMISSIONS_MANIFEST,
  MAX_TEMPERATURE_MANIFEST,
  PM25_POLLUTION_MANIFEST,
  PROTECTED_AREAS_MANIFEST,
} from '@/data/environment'
import { createSocrataIndicator } from '@/lib/create-socrata-indicator'
import { createWorldBankIndicator } from '@/lib/create-world-bank-indicator'

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
// Socrata indicators
// ---------------------------------------------------------------------------

export const { useRaw: useGhgEmissionsRaw, useByYear: useGhgEmissionsByYear } = createSocrataIndicator(
  GHG_EMISSIONS_MANIFEST,
  soqlAggSchema
)

export const { useRaw: useEnvironmentalCrimesRaw, useByYear: useEnvironmentalCrimesByYear } =
  createSocrataIndicator(ENVIRONMENTAL_CRIMES_MANIFEST, soqlAggSchema)

export const { useRaw: useMaxTemperatureRaw, useByYear: useMaxTemperatureByYear } = createSocrataIndicator(
  MAX_TEMPERATURE_MANIFEST,
  soqlAggSchema
)

// ---------------------------------------------------------------------------
// World Bank indicators
// ---------------------------------------------------------------------------

export const { useByYear: useForestAreaByYear } = createWorldBankIndicator(FOREST_AREA_MANIFEST)

export const { useByYear: usePm25PollutionByYear } = createWorldBankIndicator(PM25_POLLUTION_MANIFEST)

export const { useByYear: useProtectedAreasByYear } = createWorldBankIndicator(PROTECTED_AREAS_MANIFEST)
