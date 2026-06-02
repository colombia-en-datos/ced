import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { EVENTS } from '@/data/events'
import { COCAINE_SEIZURES_MANIFEST } from '@/data/security'
import { useIndicatorByYear } from '@/hooks/use-indicator-by-year'
import { socrataApi } from '@/lib/api-client'

const cocaineSeizuresRowSchema = z
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

const cocaineSeizuresResponseSchema = z.array(cocaineSeizuresRowSchema)

export type CocaineSeizuresRow = z.output<typeof cocaineSeizuresRowSchema>

export function useCocaineSeizures(
  options?: Pick<QueryObserverOptions, 'enabled'>
) {
  return useQuery({
    queryKey: ['cocaineSeizures', 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(
        COCAINE_SEIZURES_MANIFEST.resourceId,
        '$order=fecha_hecho ASC&$limit=200000',
        { signal }
      )

      return cocaineSeizuresResponseSchema.parse(raw)
    },
    staleTime: COCAINE_SEIZURES_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })
}

export function useCocaineSeizuresByYear(
  options?: Pick<QueryObserverOptions, 'enabled'>
) {
  return useIndicatorByYear(
    useCocaineSeizures(options),
    COCAINE_SEIZURES_MANIFEST,
    EVENTS
  )
}
