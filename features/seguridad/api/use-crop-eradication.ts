import * as z from 'zod'
import { CROP_ERADICATION_MANIFEST } from '@/data/security'
import { createSocrataIndicator } from '@/lib/create-socrata-indicator'

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

export type CropEradicationRow = z.output<typeof cropEradicationRowSchema>

export const { useRaw: useCropEradication, useByYear: useCropEradicationByYear } = createSocrataIndicator(
  CROP_ERADICATION_MANIFEST,
  cropEradicationRowSchema
)
