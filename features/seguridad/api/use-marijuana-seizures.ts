import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { EVENTS } from '@/data/events'
import { MARIJUANA_SEIZURES_MANIFEST } from '@/data/security'
import { useIndicatorByYear } from '@/hooks/use-indicator-by-year'
import { socrataApi } from '@/lib/api-client'

const marijuanaSeizuresRowSchema = z
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

const marijuanaSeizuresResponseSchema = z.array(marijuanaSeizuresRowSchema)

export type MarijuanaSeizuresRow = z.output<typeof marijuanaSeizuresRowSchema>

export function useMarijuanaSeizures(
  options?: Pick<QueryObserverOptions, 'enabled'>
) {
  return useQuery({
    queryKey: ['marijuanaSeizures', 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(
        MARIJUANA_SEIZURES_MANIFEST.resourceId,
        '$order=fecha_hecho ASC&$limit=640000',
        { signal }
      )

      return marijuanaSeizuresResponseSchema.parse(raw)
    },
    staleTime: MARIJUANA_SEIZURES_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })
}

export function useMarijuanaSeizuresByYear(
  options?: Pick<QueryObserverOptions, 'enabled'>
) {
  return useIndicatorByYear(
    useMarijuanaSeizures(options),
    MARIJUANA_SEIZURES_MANIFEST,
    EVENTS
  )
}
