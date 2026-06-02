import { useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { EVENTS } from '@/data/events'
import { OIL_PIPELINE_BOMBINGS_MANIFEST } from '@/data/security'
import { useIndicatorByYear } from '@/hooks/use-indicator-by-year'
import { socrataApi } from '@/lib/api-client'

const oilPipelineBombingsRowSchema = z
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

const oilPipelineBombingsResponseSchema = z.array(oilPipelineBombingsRowSchema)

export type OilPipelineBombingsRow = z.output<
  typeof oilPipelineBombingsRowSchema
>

export function useOilPipelineBombings() {
  return useQuery({
    queryKey: ['oilPipelineBombings', 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(
        OIL_PIPELINE_BOMBINGS_MANIFEST.resourceId,
        '$order=fecha_hecho ASC&$limit=1800',
        { signal }
      )

      return oilPipelineBombingsResponseSchema.parse(raw)
    },
    staleTime: OIL_PIPELINE_BOMBINGS_MANIFEST.cacheTTL * 1000,
  })
}

export function useOilPipelineBombingsByYear() {
  return useIndicatorByYear(
    useOilPipelineBombings(),
    OIL_PIPELINE_BOMBINGS_MANIFEST,
    EVENTS
  )
}
