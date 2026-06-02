import { useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { EVENTS } from '@/data/events'
import { EXTORTION_MANIFEST } from '@/data/security'
import { useIndicatorByYear } from '@/hooks/use-indicator-by-year'
import { socrataApi } from '@/lib/api-client'

const extortionRowSchema = z
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

const extortionResponseSchema = z.array(extortionRowSchema)

export type ExtortionRow = z.output<typeof extortionRowSchema>

export function useExtortion() {
  return useQuery({
    queryKey: ['extortion', 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi(
        EXTORTION_MANIFEST.resourceId,
        '$order=fecha_hecho ASC&$limit=150000',
        { signal }
      )

      return extortionResponseSchema.parse(raw)
    },
    staleTime: EXTORTION_MANIFEST.cacheTTL * 1000,
  })
}

export function useExtortionByYear() {
  return useIndicatorByYear(useExtortion(), EXTORTION_MANIFEST, EVENTS)
}
