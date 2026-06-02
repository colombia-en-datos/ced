import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { EVENTS } from '@/data/events'
import { CROP_ERADICATION_MANIFEST } from '@/data/security'
import { useIndicatorByYear } from '@/hooks/use-indicator-by-year'
import { socrataApi } from '@/lib/api-client'

const cropEradicationRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    cod_depto: z.string(),
    departamento: z.string(),
    cod_muni: z.string(),
    municipio: z.string(),
    // 6 rows from 2012 are missing `cantidad` — default to 0 to avoid NaN
    cantidad: z.preprocess((v) => (v == null ? 0 : v), z.coerce.number()),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    deptCode: row.cod_depto,
    department: row.departamento,
    muniCode: row.cod_muni,
    municipality: row.municipio,
    count: row.cantidad,
  }))

const cropEradicationResponseSchema = z.array(cropEradicationRowSchema)

export type CropEradicationRow = z.output<typeof cropEradicationRowSchema>

export function useCropEradication(
  options?: Pick<QueryObserverOptions, 'enabled'>
) {
  return useQuery({
    queryKey: ['cropEradication', 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(
        CROP_ERADICATION_MANIFEST.resourceId,
        '$order=fecha_hecho ASC&$limit=150000',
        { signal }
      )

      return cropEradicationResponseSchema.parse(raw)
    },
    staleTime: CROP_ERADICATION_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })
}

export function useCropEradicationByYear(
  options?: Pick<QueryObserverOptions, 'enabled'>
) {
  return useIndicatorByYear(
    useCropEradication(options),
    CROP_ERADICATION_MANIFEST,
    EVENTS
  )
}
