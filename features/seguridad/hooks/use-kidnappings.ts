import { useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { KIDNAPPINGS_MANIFEST } from '@/data/security'
import { useIndicatorByYear } from '@/hooks/use-indicator-by-year'
import { socrataApi } from '@/lib/api-client'

const kidnappingRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    cod_depto: z.string(),
    departamento: z.string(),
    cod_muni: z.string(),
    municipio: z.string(),
    tipo_delito: z.string(),
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    deptCode: row.cod_depto,
    department: row.departamento,
    muniCode: row.cod_muni,
    municipality: row.municipio,
    crimeType: row.tipo_delito,
    count: row.cantidad,
  }))

const kidnappingsResponseSchema = z.array(kidnappingRowSchema)

export type KidnappingRow = z.output<typeof kidnappingRowSchema>

export function useKidnappings() {
  return useQuery({
    queryKey: ['kidnappings', 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi(
        KIDNAPPINGS_MANIFEST.resourceId,
        '$order=fecha_hecho ASC&$limit=50000',
        { signal }
      )

      return kidnappingsResponseSchema.parse(raw)
    },
    staleTime: KIDNAPPINGS_MANIFEST.cacheTTL * 1000,
  })
}

export function useKidnappingsByYear() {
  return useIndicatorByYear(useKidnappings(), 'Secuestros por año')
}
