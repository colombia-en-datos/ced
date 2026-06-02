import { useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { EVENTS } from '@/data/events'
import { TRAFFIC_INJURIES_MANIFEST } from '@/data/security'
import { useIndicatorByYear } from '@/hooks/use-indicator-by-year'
import { socrataApi } from '@/lib/api-client'

const trafficInjuriesRowSchema = z
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

const trafficInjuriesResponseSchema = z.array(trafficInjuriesRowSchema)

export type TrafficInjuriesRow = z.output<typeof trafficInjuriesRowSchema>

export function useTrafficInjuries() {
  return useQuery({
    queryKey: ['trafficInjuries', 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi(
        TRAFFIC_INJURIES_MANIFEST.resourceId,
        '$order=fecha_hecho ASC&$limit=810000',
        { signal }
      )

      return trafficInjuriesResponseSchema.parse(raw)
    },
    staleTime: TRAFFIC_INJURIES_MANIFEST.cacheTTL * 1000,
  })
}

export function useTrafficInjuriesByYear() {
  return useIndicatorByYear(
    useTrafficInjuries(),
    TRAFFIC_INJURIES_MANIFEST,
    EVENTS
  )
}
