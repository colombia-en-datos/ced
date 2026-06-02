import { useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { EVENTS } from '@/data/events'
import { SEXUAL_CRIMES_MANIFEST } from '@/data/security'
import { useIndicatorByYear } from '@/hooks/use-indicator-by-year'
import { socrataApi } from '@/lib/api-client'

const sexualCrimesRowSchema = z
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

const sexualCrimesResponseSchema = z.array(sexualCrimesRowSchema)

export type SexualCrimesRow = z.output<typeof sexualCrimesRowSchema>

export function useSexualCrimes() {
  return useQuery({
    queryKey: ['sexualCrimes', 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(
        SEXUAL_CRIMES_MANIFEST.resourceId,
        '$order=fecha_hecho ASC&$limit=570000',
        { signal }
      )

      return sexualCrimesResponseSchema.parse(raw)
    },
    staleTime: SEXUAL_CRIMES_MANIFEST.cacheTTL * 1000,
  })
}

export function useSexualCrimesByYear() {
  return useIndicatorByYear(useSexualCrimes(), SEXUAL_CRIMES_MANIFEST, EVENTS)
}
