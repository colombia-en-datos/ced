import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { EVENTS } from '@/data/events'
import { ILLEGAL_MINING_CAPTURES_MANIFEST } from '@/data/security'
import { useIndicatorByYear } from '@/hooks/use-indicator-by-year'
import { socrataApi } from '@/lib/api-client'

const illegalMiningCapturesRowSchema = z
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

const illegalMiningCapturesResponseSchema = z.array(
  illegalMiningCapturesRowSchema
)

export type IllegalMiningCapturesRow = z.output<
  typeof illegalMiningCapturesRowSchema
>

export function useIllegalMiningCaptures(
  options?: Pick<QueryObserverOptions, 'enabled'>
) {
  return useQuery({
    queryKey: ['illegalMiningCaptures', 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(
        ILLEGAL_MINING_CAPTURES_MANIFEST.resourceId,
        '$order=fecha_hecho ASC&$limit=8000',
        { signal }
      )

      return illegalMiningCapturesResponseSchema.parse(raw)
    },
    staleTime: ILLEGAL_MINING_CAPTURES_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })
}

export function useIllegalMiningCapturesByYear(
  options?: Pick<QueryObserverOptions, 'enabled'>
) {
  return useIndicatorByYear(
    useIllegalMiningCaptures(options),
    ILLEGAL_MINING_CAPTURES_MANIFEST,
    EVENTS
  )
}
