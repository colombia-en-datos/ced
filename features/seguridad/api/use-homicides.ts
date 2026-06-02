import * as z from 'zod'
import { HOMICIDES_MANIFEST } from '@/data/security'
import { createSocrataIndicator } from '@/lib/create-socrata-indicator'

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

export type HomicideRow = z.output<typeof homicideRowSchema>

export const { useRaw: useHomicides, useByYear: useHomicidesByYear } = createSocrataIndicator(
  HOMICIDES_MANIFEST,
  homicideRowSchema
)
