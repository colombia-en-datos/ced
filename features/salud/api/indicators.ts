import * as z from 'zod'
import {
  ACUTE_MALNUTRITION_MANIFEST,
  DENGUE_MANIFEST,
  GESTATIONAL_SYPHILIS_MANIFEST,
  INDEPENDENT_PROFESSIONALS_MANIFEST,
  LIFE_EXPECTANCY_MANIFEST,
  LOW_BIRTH_WEIGHT_MANIFEST,
  MALARIA_VIVAX_MANIFEST,
  MATERNAL_MORTALITY_MANIFEST,
  MORTALITY_EDA_MANIFEST,
  MORTALITY_IRA_MANIFEST,
  PERINATAL_MORTALITY_MANIFEST,
  SEVERE_MATERNAL_MORBIDITY_MANIFEST,
  SUICIDE_ATTEMPT_MANIFEST,
  TUBERCULOSIS_MANIFEST,
  VIH_SIDA_MANIFEST,
} from '@/data/health'
import { createSocrataIndicator } from '@/lib/create-socrata-indicator'
import { createWorldBankIndicator } from '@/lib/create-world-bank-indicator'

// ---------------------------------------------------------------------------
// Shared schema: SIVIGILA SoQL aggregation returns { ano, total }
// ---------------------------------------------------------------------------

const sivigilaAggSchema = z
  .object({
    ano: z.coerce.number(),
    total: z.coerce.number(),
  })
  .transform((row) => ({
    date: new Date(row.ano, 0, 1),
    count: row.total,
  }))

// ---------------------------------------------------------------------------
// Communicable diseases
// ---------------------------------------------------------------------------

export const { useRaw: useDengueRaw, useByYear: useDengueByYear } = createSocrataIndicator(
  DENGUE_MANIFEST,
  sivigilaAggSchema
)

export const { useRaw: useTuberculosisRaw, useByYear: useTuberculosisByYear } = createSocrataIndicator(
  TUBERCULOSIS_MANIFEST,
  sivigilaAggSchema
)

export const { useRaw: useMalariaVivaxRaw, useByYear: useMalariaVivaxByYear } = createSocrataIndicator(
  MALARIA_VIVAX_MANIFEST,
  sivigilaAggSchema
)

export const { useRaw: useVihSidaRaw, useByYear: useVihSidaByYear } = createSocrataIndicator(
  VIH_SIDA_MANIFEST,
  sivigilaAggSchema
)

export const { useRaw: useGestationalSyphilisRaw, useByYear: useGestationalSyphilisByYear } =
  createSocrataIndicator(GESTATIONAL_SYPHILIS_MANIFEST, sivigilaAggSchema)

// ---------------------------------------------------------------------------
// Mortality
// ---------------------------------------------------------------------------

export const { useRaw: useMaternalMortalityRaw, useByYear: useMaternalMortalityByYear } =
  createSocrataIndicator(MATERNAL_MORTALITY_MANIFEST, sivigilaAggSchema)

export const { useRaw: usePerinatalMortalityRaw, useByYear: usePerinatalMortalityByYear } =
  createSocrataIndicator(PERINATAL_MORTALITY_MANIFEST, sivigilaAggSchema)

export const { useRaw: useMortalityEdaRaw, useByYear: useMortalityEdaByYear } = createSocrataIndicator(
  MORTALITY_EDA_MANIFEST,
  sivigilaAggSchema
)

export const { useRaw: useMortalityIraRaw, useByYear: useMortalityIraByYear } = createSocrataIndicator(
  MORTALITY_IRA_MANIFEST,
  sivigilaAggSchema
)

// ---------------------------------------------------------------------------
// Maternal & child health
// ---------------------------------------------------------------------------

export const { useRaw: useLowBirthWeightRaw, useByYear: useLowBirthWeightByYear } = createSocrataIndicator(
  LOW_BIRTH_WEIGHT_MANIFEST,
  sivigilaAggSchema
)

export const { useRaw: useSevereMaternalMorbidityRaw, useByYear: useSevereMaternalMorbidityByYear } =
  createSocrataIndicator(SEVERE_MATERNAL_MORBIDITY_MANIFEST, sivigilaAggSchema)

export const { useRaw: useAcuteMalnutritionRaw, useByYear: useAcuteMalnutritionByYear } =
  createSocrataIndicator(ACUTE_MALNUTRITION_MANIFEST, sivigilaAggSchema)

// ---------------------------------------------------------------------------
// Mental health
// ---------------------------------------------------------------------------

export const { useRaw: useSuicideAttemptRaw, useByYear: useSuicideAttemptByYear } = createSocrataIndicator(
  SUICIDE_ATTEMPT_MANIFEST,
  sivigilaAggSchema
)

// ---------------------------------------------------------------------------
// Health system — uses same { ano, total } shape via SoQL aliasing
// ---------------------------------------------------------------------------

export const { useRaw: useIndependentProfessionalsRaw, useByYear: useIndependentProfessionalsByYear } =
  createSocrataIndicator(INDEPENDENT_PROFESSIONALS_MANIFEST, sivigilaAggSchema)

// ---------------------------------------------------------------------------
// World Bank indicators
// ---------------------------------------------------------------------------

export const { useByYear: useLifeExpectancyByYear } = createWorldBankIndicator(LIFE_EXPECTANCY_MANIFEST)
