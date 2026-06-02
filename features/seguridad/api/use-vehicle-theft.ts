import { useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { EVENTS } from '@/data/events'
import { VEHICLE_THEFT_MANIFEST } from '@/data/security'
import { useIndicatorByYear } from '@/hooks/use-indicator-by-year'
import { socrataApi } from '@/lib/api-client'

const vehicleTheftRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    cod_depto: z.string(),
    departamento: z.string(),
    cod_muni: z.string(),
    municipio: z.string(),
    tipo_delito: z.string(),
    zona: z.string(),
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    deptCode: row.cod_depto,
    department: row.departamento,
    muniCode: row.cod_muni,
    municipality: row.municipio,
    crimeType: row.tipo_delito,
    zone: row.zona,
    count: row.cantidad,
  }))

const vehicleTheftResponseSchema = z.array(vehicleTheftRowSchema)

export type VehicleTheftRow = z.output<typeof vehicleTheftRowSchema>

export function useVehicleTheft() {
  return useQuery({
    queryKey: ['vehicleTheft', 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(
        VEHICLE_THEFT_MANIFEST.resourceId,
        '$order=fecha_hecho ASC&$limit=400000',
        { signal }
      )

      return vehicleTheftResponseSchema.parse(raw)
    },
    staleTime: VEHICLE_THEFT_MANIFEST.cacheTTL * 1000,
  })
}

export function useVehicleTheftByYear() {
  return useIndicatorByYear(useVehicleTheft(), VEHICLE_THEFT_MANIFEST, EVENTS)
}
