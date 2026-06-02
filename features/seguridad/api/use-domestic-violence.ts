import * as z from 'zod'
import { DOMESTIC_VIOLENCE_MANIFEST } from '@/data/security'
import { createSocrataIndicator } from '@/lib/create-socrata-indicator'

const domesticViolenceRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    cod_depto: z.string(),
    departamento: z.string(),
    cod_muni: z.string(),
    municipio: z.string(),
    zona: z.string(),
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    deptCode: row.cod_depto,
    department: row.departamento,
    muniCode: row.cod_muni,
    municipality: row.municipio,
    zone: row.zona,
    count: row.cantidad,
  }))

export type DomesticViolenceRow = z.output<typeof domesticViolenceRowSchema>

export const { useRaw: useDomesticViolence, useByYear: useDomesticViolenceByYear } = createSocrataIndicator(
  DOMESTIC_VIOLENCE_MANIFEST,
  domesticViolenceRowSchema
)
