import * as z from 'zod'
import {
  BIENESTARINA_MANIFEST,
  CASA_DIGNA_MANIFEST,
  EMPLEO_PARA_LA_PROSPERIDAD_MANIFEST,
  EMPRENDIMIENTO_COLECTIVO_MANIFEST,
  FAMILIAS_EN_ACCION_MANIFEST,
  FAMILIAS_EN_SU_TIERRA_MANIFEST,
  GINI_INDEX_MANIFEST,
  ICBF_PREVENCION_MANIFEST,
  INFRAESTRUCTURA_SOCIAL_MANIFEST,
  IRACA_MANIFEST,
  MI_NEGOCIO_MANIFEST,
  NET_MIGRATION_MANIFEST,
  PARD_NNA_MANIFEST,
  POVERTY_HEADCOUNT_MANIFEST,
  RESA_MANIFEST,
  SUBSIDIOS_VIVIENDA_MANIFEST,
} from '@/data/social'
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
// DPS social programs
// ---------------------------------------------------------------------------

export const { useByYear: useFamiliasEnAccionByYear } = createSocrataIndicator(
  FAMILIAS_EN_ACCION_MANIFEST,
  soqlAggSchema
)

export const { useByYear: useFamiliasEnSuTierraByYear } = createSocrataIndicator(
  FAMILIAS_EN_SU_TIERRA_MANIFEST,
  soqlAggSchema
)

export const { useByYear: useEmpleoParaLaProsperidadByYear } = createSocrataIndicator(
  EMPLEO_PARA_LA_PROSPERIDAD_MANIFEST,
  soqlAggSchema
)

export const { useByYear: useMiNegocioByYear } = createSocrataIndicator(MI_NEGOCIO_MANIFEST, soqlAggSchema)

export const { useByYear: useIracaByYear } = createSocrataIndicator(IRACA_MANIFEST, soqlAggSchema)

export const { useByYear: useResaByYear } = createSocrataIndicator(RESA_MANIFEST, soqlAggSchema)

export const { useByYear: useEmprendimientoColectivoByYear } = createSocrataIndicator(
  EMPRENDIMIENTO_COLECTIVO_MANIFEST,
  soqlAggSchema
)

export const { useByYear: useCasaDignaByYear } = createSocrataIndicator(CASA_DIGNA_MANIFEST, soqlAggSchema)

export const { useByYear: useSubsidiosViviendaByYear } = createSocrataIndicator(
  SUBSIDIOS_VIVIENDA_MANIFEST,
  soqlAggSchema
)

export const { useByYear: useInfraestructuraSocialByYear } = createSocrataIndicator(
  INFRAESTRUCTURA_SOCIAL_MANIFEST,
  soqlAggSchema
)

// ---------------------------------------------------------------------------
// ICBF — Children & early childhood
// ---------------------------------------------------------------------------

export const { useByYear: usePardNnaByYear } = createSocrataIndicator(PARD_NNA_MANIFEST, soqlAggSchema)

export const { useByYear: useIcbfPrevencionByYear } = createSocrataIndicator(
  ICBF_PREVENCION_MANIFEST,
  soqlAggSchema
)

export const { useByYear: useBienestarByYear } = createSocrataIndicator(BIENESTARINA_MANIFEST, soqlAggSchema)

// ---------------------------------------------------------------------------
// World Bank indicators
// ---------------------------------------------------------------------------

export const { useByYear: useGiniIndexByYear } = createWorldBankIndicator(GINI_INDEX_MANIFEST)

export const { useByYear: usePovertyHeadcountByYear } = createWorldBankIndicator(POVERTY_HEADCOUNT_MANIFEST)

export const { useByYear: useNetMigrationByYear } = createWorldBankIndicator(NET_MIGRATION_MANIFEST)
