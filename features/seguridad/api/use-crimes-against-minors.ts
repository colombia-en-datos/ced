import { useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { EVENTS } from '@/data/events'
import { CRIMES_AGAINST_MINORS_MANIFEST } from '@/data/security'
import { useIndicatorByYear } from '@/hooks/use-indicator-by-year'
import { socrataApi } from '@/lib/api-client'

// Each row is one victim — no `cantidad` column in this dataset
const crimesAgainstMinorsRowSchema = z
  .object({
    fecha: z.coerce.date(),
    departamento: z.string(),
    municipio: z.string(),
    delito: z.string(),
    genero: z.string(),
    zona: z.string(),
  })
  .transform((row) => ({
    date: row.fecha,
    department: row.departamento,
    municipality: row.municipio,
    crime: row.delito,
    gender: row.genero,
    zone: row.zona,
    count: 1 as number,
  }))

const crimesAgainstMinorsResponseSchema = z.array(crimesAgainstMinorsRowSchema)

export type CrimesAgainstMinorsRow = z.output<
  typeof crimesAgainstMinorsRowSchema
>

export function useCrimesAgainstMinors() {
  return useQuery({
    queryKey: ['crimesAgainstMinors', 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi(
        CRIMES_AGAINST_MINORS_MANIFEST.resourceId,
        '$order=fecha ASC&$limit=135000',
        { signal }
      )

      return crimesAgainstMinorsResponseSchema.parse(raw)
    },
    staleTime: CRIMES_AGAINST_MINORS_MANIFEST.cacheTTL * 1000,
  })
}

export function useCrimesAgainstMinorsByYear() {
  return useIndicatorByYear(
    useCrimesAgainstMinors(),
    CRIMES_AGAINST_MINORS_MANIFEST,
    EVENTS
  )
}
