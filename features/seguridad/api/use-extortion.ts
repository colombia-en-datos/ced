import * as z from 'zod'
import { EXTORTION_MANIFEST } from '@/data/security'
import { createSocrataIndicator } from '@/lib/create-socrata-indicator'

const extortionRowSchema = z
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

export type ExtortionRow = z.output<typeof extortionRowSchema>

export const { useRaw: useExtortion, useByYear: useExtortionByYear } = createSocrataIndicator(
  EXTORTION_MANIFEST,
  extortionRowSchema
)
