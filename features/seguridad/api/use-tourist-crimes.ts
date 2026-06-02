import { useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { EVENTS } from '@/data/events'
import { TOURIST_CRIMES_MANIFEST } from '@/data/security'
import { useIndicatorByYear } from '@/hooks/use-indicator-by-year'
import { socrataApi } from '@/lib/api-client'

// No `cantidad` field — each row is one incident, so count is always 1
const touristCrimesRowSchema = z
  .object({
    fecha: z.coerce.date(),
    departamento: z.string(),
    municipio: z.string(),
  })
  .transform((row) => ({
    date: row.fecha,
    department: row.departamento,
    municipality: row.municipio,
    count: 1,
  }))

const touristCrimesResponseSchema = z.array(touristCrimesRowSchema)

export type TouristCrimesRow = z.output<typeof touristCrimesRowSchema>

export function useTouristCrimes() {
  return useQuery({
    queryKey: ['touristCrimes', 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi(
        TOURIST_CRIMES_MANIFEST.resourceId,
        '$order=fecha ASC&$limit=500',
        { signal }
      )

      return touristCrimesResponseSchema.parse(raw)
    },
    staleTime: TOURIST_CRIMES_MANIFEST.cacheTTL * 1000,
  })
}

export function useTouristCrimesByYear() {
  return useIndicatorByYear(useTouristCrimes(), TOURIST_CRIMES_MANIFEST, EVENTS)
}
