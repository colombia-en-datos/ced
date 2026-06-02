import * as z from 'zod'
import { FORCE_CASUALTIES_MANIFEST } from '@/data/security'
import { createSocrataIndicator } from '@/lib/create-socrata-indicator'

const forceCasualtiesRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    cod_depto: z.string(),
    departamento: z.string(),
    cod_muni: z.string(),
    municipio: z.string(),
    accion: z.string(),
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    deptCode: row.cod_depto,
    department: row.departamento,
    muniCode: row.cod_muni,
    municipality: row.municipio,
    action: row.accion,
    count: row.cantidad,
  }))

export type ForceCasualtiesRow = z.output<typeof forceCasualtiesRowSchema>

export const { useRaw: useForceCasualties, useByYear: useForceCasualtiesByYear } = createSocrataIndicator(
  FORCE_CASUALTIES_MANIFEST,
  forceCasualtiesRowSchema
)
