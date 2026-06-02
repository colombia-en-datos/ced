import { useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { EVENTS } from '@/data/events'
import { DOMESTIC_VIOLENCE_MANIFEST } from '@/data/security'
import { useIndicatorByYear } from '@/hooks/use-indicator-by-year'
import { socrataApi } from '@/lib/api-client'

const domesticViolenceRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    cod_depto: z.string(),
    departamento: z.string(),
    cod_muni: z.string(),
    municipio: z.string(),
    zona: z.string(),
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    deptCode: row.cod_depto,
    department: row.departamento,
    muniCode: row.cod_muni,
    municipality: row.municipio,
    zone: row.zona,
    count: row.cantidad,
  }))

const domesticViolenceResponseSchema = z.array(domesticViolenceRowSchema)

export type DomesticViolenceRow = z.output<typeof domesticViolenceRowSchema>

export function useDomesticViolence() {
  return useQuery({
    queryKey: ['domesticViolence', 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi(
        DOMESTIC_VIOLENCE_MANIFEST.resourceId,
        '$order=fecha_hecho ASC&$limit=850000',
        { signal }
      )

      return domesticViolenceResponseSchema.parse(raw)
    },
    staleTime: DOMESTIC_VIOLENCE_MANIFEST.cacheTTL * 1000,
  })
}

export function useDomesticViolenceByYear() {
  return useIndicatorByYear(
    useDomesticViolence(),
    DOMESTIC_VIOLENCE_MANIFEST,
    EVENTS
  )
}
