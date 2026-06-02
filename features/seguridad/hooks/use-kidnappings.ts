import { useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { Sector } from '@/config/sectors'
import { socrataApi } from '@/lib/api-client'

export const KIDNAPPINGS_MANIFEST = {
  id: `${Sector.Seguridad}_kidnappings`,
  sector: Sector.Seguridad,
  label: 'Secuestros por año',
  description:
    'Casos de secuestro (simple y extorsivo) registrados por Ministerio de Defensa Nacional',
  source: 'MinDefensa',
  sourceUrl:
    'https://www.datos.gov.co/Seguridad-y-Defensa/SECUESTRO/d7zw-hpf4/about_data',
  resourceId: 'd7zw-hpf4',
  unit: 'casos',
  cacheTTL: 86400,
  positiveDirection: 'down' as const,
  policyEvents: [
    { year: 2016, label: 'Acuerdo de paz FARC' },
    { year: 2022, label: 'Inicio Paz Total' },
  ],
} as const

const kidnappingRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    cod_depto: z.string(),
    departamento: z.string(),
    cod_muni: z.string(),
    municipio: z.string(),
    tipo_delito: z.string(),
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    deptCode: row.cod_depto,
    department: row.departamento,
    muniCode: row.cod_muni,
    municipality: row.municipio,
    crimeType: row.tipo_delito,
    count: row.cantidad,
  }))

const kidnappingsResponseSchema = z.array(kidnappingRowSchema)

export type KidnappingRow = z.output<typeof kidnappingRowSchema>

export function useKidnappings() {
  return useQuery({
    queryKey: ['kidnappings', 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi(
        KIDNAPPINGS_MANIFEST.resourceId,
        '$order=fecha_hecho ASC&$limit=50000',
        { signal }
      )

      return kidnappingsResponseSchema.parse(raw)
    },
    staleTime: KIDNAPPINGS_MANIFEST.cacheTTL * 1000,
  })
}
