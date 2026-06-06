import * as z from 'zod'
import {
  CYBER_INCIDENTS_MANIFEST,
  HIGHTECH_EXPORTS_MANIFEST,
  ICT_SERVICE_EXPORTS_MANIFEST,
  INTERNET_USERS_MANIFEST,
  RD_FUNDING_MANIFEST,
  RD_SPENDING_MANIFEST,
  SCIENTIFIC_ARTICLES_MANIFEST,
} from '@/data/technology'
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

// R&D funding values are in COP — scale to millions
const rdFundingSchema = z
  .object({
    ano: z.coerce.number(),
    total: z.coerce.number(),
  })
  .transform((row) => ({
    date: new Date(row.ano, 0, 1),
    count: row.total / 1e6,
  }))

// ---------------------------------------------------------------------------
// Socrata indicators
// ---------------------------------------------------------------------------

export const { useRaw: useCyberIncidentsRaw, useByYear: useCyberIncidentsByYear } = createSocrataIndicator(
  CYBER_INCIDENTS_MANIFEST,
  soqlAggSchema
)

export const { useRaw: useRdFundingRaw, useByYear: useRdFundingByYear } = createSocrataIndicator(
  RD_FUNDING_MANIFEST,
  rdFundingSchema
)

// ---------------------------------------------------------------------------
// World Bank indicators
// ---------------------------------------------------------------------------

export const { useByYear: useInternetUsersByYear } = createWorldBankIndicator(INTERNET_USERS_MANIFEST)
export const { useByYear: useRdSpendingByYear } = createWorldBankIndicator(RD_SPENDING_MANIFEST)
export const { useByYear: useScientificArticlesByYear } = createWorldBankIndicator(
  SCIENTIFIC_ARTICLES_MANIFEST
)
export const { useByYear: useHighTechExportsByYear } = createWorldBankIndicator(HIGHTECH_EXPORTS_MANIFEST)
export const { useByYear: useIctServiceExportsByYear } = createWorldBankIndicator(
  ICT_SERVICE_EXPORTS_MANIFEST
)
