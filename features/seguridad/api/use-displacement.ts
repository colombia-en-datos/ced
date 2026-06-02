import { useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { EVENTS } from '@/data/events'
import { DISPLACEMENT_MANIFEST } from '@/data/security'
import { useIndicatorByYear } from '@/hooks/use-indicator-by-year'
import { socrataApi } from '@/lib/api-client'

const displacementRowSchema = z
  .object({
    vigencia: z.coerce.number(),
    hecho: z.string(),
    sexo: z.string(),
    etnia: z.string(),
    discapacidad: z.string(),
    ciclo_vital: z.string(),
    per_ocu: z.coerce.number(),
    eventos: z.coerce.number(),
  })
  .transform((row) => ({
    date: new Date(row.vigencia, 0, 1),
    fact: row.hecho,
    sex: row.sexo,
    ethnicity: row.etnia,
    disability: row.discapacidad,
    ageRange: row.ciclo_vital,
    count: row.per_ocu,
    events: row.eventos,
  }))

const displacementResponseSchema = z.array(displacementRowSchema)

export type DisplacementRow = z.output<typeof displacementRowSchema>

export function useDisplacement() {
  return useQuery({
    queryKey: ['displacement', 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi(
        DISPLACEMENT_MANIFEST.resourceId,
        '$order=vigencia ASC&$limit=400000',
        { signal }
      )

      return displacementResponseSchema.parse(raw)
    },
    staleTime: DISPLACEMENT_MANIFEST.cacheTTL * 1000,
  })
}

export function useDisplacementByYear() {
  return useIndicatorByYear(useDisplacement(), DISPLACEMENT_MANIFEST, EVENTS)
}
