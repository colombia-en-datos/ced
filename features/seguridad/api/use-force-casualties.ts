import { useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { EVENTS } from '@/data/events'
import { FORCE_CASUALTIES_MANIFEST } from '@/data/security'
import { useIndicatorByYear } from '@/hooks/use-indicator-by-year'
import { socrataApi } from '@/lib/api-client'

const forceCasualtiesRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    cod_depto: z.string(),
    departamento: z.string(),
    cod_muni: z.string(),
    municipio: z.string(),
    accion: z.string(),
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    deptCode: row.cod_depto,
    department: row.departamento,
    muniCode: row.cod_muni,
    municipality: row.municipio,
    action: row.accion,
    count: row.cantidad,
  }))

const forceCasualtiesResponseSchema = z.array(forceCasualtiesRowSchema)

export type ForceCasualtiesRow = z.output<typeof forceCasualtiesRowSchema>

export function useForceCasualties() {
  return useQuery({
    queryKey: ['forceCasualties', 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi(
        FORCE_CASUALTIES_MANIFEST.resourceId,
        '$order=fecha_hecho ASC&$limit=23000',
        { signal }
      )

      return forceCasualtiesResponseSchema.parse(raw)
    },
    staleTime: FORCE_CASUALTIES_MANIFEST.cacheTTL * 1000,
  })
}

export function useForceCasualtiesByYear() {
  return useIndicatorByYear(
    useForceCasualties(),
    FORCE_CASUALTIES_MANIFEST,
    EVENTS
  )
}
