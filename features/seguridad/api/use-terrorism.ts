import { useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { EVENTS } from '@/data/events'
import { TERRORISM_MANIFEST } from '@/data/security'
import { useIndicatorByYear } from '@/hooks/use-indicator-by-year'
import { socrataApi } from '@/lib/api-client'

const terrorismRowSchema = z
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

const terrorismResponseSchema = z.array(terrorismRowSchema)

export type TerrorismRow = z.output<typeof terrorismRowSchema>

export function useTerrorism() {
  return useQuery({
    queryKey: ['terrorism', 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(
        TERRORISM_MANIFEST.resourceId,
        '$order=fecha_hecho ASC&$limit=150000',
        { signal }
      )

      return terrorismResponseSchema.parse(raw)
    },
    staleTime: TERRORISM_MANIFEST.cacheTTL * 1000,
  })
}

export function useTerrorismByYear() {
  return useIndicatorByYear(useTerrorism(), TERRORISM_MANIFEST, EVENTS)
}
