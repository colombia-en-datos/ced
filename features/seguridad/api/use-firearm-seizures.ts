import { useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { EVENTS } from '@/data/events'
import { FIREARM_SEIZURES_MANIFEST } from '@/data/security'
import { useIndicatorByYear } from '@/hooks/use-indicator-by-year'
import { socrataApi } from '@/lib/api-client'

// fecha_hecho is stored as text in DD/MM/YYYY format, not calendar_date
const parseDDMMYYYY = (s: string) => {
  const [dd, mm, yyyy] = s.split('/')
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd))
}

const firearmSeizuresRowSchema = z
  .object({
    departamento: z.string(),
    municipio_hecho: z.string(),
    codigo_dane: z.string(),
    clase_bien: z.string(),
    fecha_hecho: z.string().transform(parseDDMMYYYY),
    // cantidad is text in the source dataset
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    department: row.departamento,
    municipality: row.municipio_hecho,
    daneCode: row.codigo_dane,
    weaponType: row.clase_bien,
    count: row.cantidad,
  }))

const firearmSeizuresResponseSchema = z.array(firearmSeizuresRowSchema)

export type FirearmSeizuresRow = z.output<typeof firearmSeizuresRowSchema>

export function useFirearmSeizures() {
  return useQuery({
    queryKey: ['firearmSeizures', 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi(
        FIREARM_SEIZURES_MANIFEST.resourceId,
        '$order=fecha_hecho ASC&$limit=550000',
        { signal }
      )

      return firearmSeizuresResponseSchema.parse(raw)
    },
    staleTime: FIREARM_SEIZURES_MANIFEST.cacheTTL * 1000,
  })
}

export function useFirearmSeizuresByYear() {
  return useIndicatorByYear(
    useFirearmSeizures(),
    FIREARM_SEIZURES_MANIFEST,
    EVENTS
  )
}
