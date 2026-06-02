import { useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { EVENTS } from '@/data/events'
import { PERSONAL_THEFT_MANIFEST } from '@/data/security'
import { useIndicatorByYear } from '@/hooks/use-indicator-by-year'
import { socrataApi } from '@/lib/api-client'

const personalTheftRowSchema = z
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

const personalTheftResponseSchema = z.array(personalTheftRowSchema)

export type PersonalTheftRow = z.output<typeof personalTheftRowSchema>

export function usePersonalTheft() {
  return useQuery({
    queryKey: ['personalTheft', 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(
        PERSONAL_THEFT_MANIFEST.resourceId,
        '$order=fecha_hecho ASC&$limit=650000',
        { signal }
      )

      return personalTheftResponseSchema.parse(raw)
    },
    staleTime: PERSONAL_THEFT_MANIFEST.cacheTTL * 1000,
  })
}

export function usePersonalTheftByYear() {
  return useIndicatorByYear(usePersonalTheft(), PERSONAL_THEFT_MANIFEST, EVENTS)
}
