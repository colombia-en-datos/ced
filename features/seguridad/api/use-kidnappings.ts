import * as z from 'zod'
import { KIDNAPPINGS_MANIFEST } from '@/data/security'
import { createSocrataIndicator } from '@/lib/create-socrata-indicator'

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

export type KidnappingRow = z.output<typeof kidnappingRowSchema>

export const { useRaw: useKidnappings, useByYear: useKidnappingsByYear } = createSocrataIndicator(
  KIDNAPPINGS_MANIFEST,
  kidnappingRowSchema
)
