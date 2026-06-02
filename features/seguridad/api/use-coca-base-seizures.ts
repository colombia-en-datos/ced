import { useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { EVENTS } from '@/data/events'
import { COCA_BASE_SEIZURES_MANIFEST } from '@/data/security'
import { useIndicatorByYear } from '@/hooks/use-indicator-by-year'
import { socrataApi } from '@/lib/api-client'

const cocaBaseSeizuresRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    cod_depto: z.string(),
    departamento: z.string(),
    cod_muni: z.string(),
    municipio: z.string(),
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    deptCode: row.cod_depto,
    department: row.departamento,
    muniCode: row.cod_muni,
    municipality: row.municipio,
    count: row.cantidad,
  }))

const cocaBaseSeizuresResponseSchema = z.array(cocaBaseSeizuresRowSchema)

export type CocaBaseSeizuresRow = z.output<typeof cocaBaseSeizuresRowSchema>

export function useCocaBaseSeizures() {
  return useQuery({
    queryKey: ['cocaBaseSeizures', 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi(
        COCA_BASE_SEIZURES_MANIFEST.resourceId,
        '$order=fecha_hecho ASC&$limit=230000',
        { signal }
      )

      return cocaBaseSeizuresResponseSchema.parse(raw)
    },
    staleTime: COCA_BASE_SEIZURES_MANIFEST.cacheTTL * 1000,
  })
}

export function useCocaBaseSeizuresByYear() {
  return useIndicatorByYear(
    useCocaBaseSeizures(),
    COCA_BASE_SEIZURES_MANIFEST,
    EVENTS
  )
}
