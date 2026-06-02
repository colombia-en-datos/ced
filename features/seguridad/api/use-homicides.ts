import { useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { EVENTS } from '@/data/events'
import { HOMICIDES_MANIFEST } from '@/data/security'
import { useIndicatorByYear } from '@/hooks/use-indicator-by-year'
import { socrataApi } from '@/lib/api-client'

const homicideRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    cod_depto: z.string(),
    departamento: z.string(),
    cod_muni: z.string(),
    municipio: z.string(),
    zona: z.string(),
    sexo: z.string(),
    arma_medio: z.string(),
    _modalidad_presunta: z.string(),
    spoa_caracterizacion: z.string(),
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    deptCode: row.cod_depto,
    department: row.departamento,
    muniCode: row.cod_muni,
    municipality: row.municipio,
    zone: row.zona,
    sex: row.sexo,
    weapon: row.arma_medio,
    presumedModality: row._modalidad_presunta,
    characterization: row.spoa_caracterizacion,
    count: row.cantidad,
  }))

const homicidesResponseSchema = z.array(homicideRowSchema)

export type HomicideRow = z.output<typeof homicideRowSchema>

export function useHomicides() {
  return useQuery({
    queryKey: ['homicides', 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(
        HOMICIDES_MANIFEST.resourceId,
        '$order=fecha_hecho ASC&$limit=350000',
        { signal }
      )

      return homicidesResponseSchema.parse(raw)
    },
    staleTime: HOMICIDES_MANIFEST.cacheTTL * 1000,
  })
}

export function useHomicidesByYear() {
  return useIndicatorByYear(useHomicides(), HOMICIDES_MANIFEST, EVENTS)
}
