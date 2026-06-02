import * as z from 'zod'
import { CRIMES_AGAINST_MINORS_MANIFEST } from '@/data/security'
import { createSocrataIndicator } from '@/lib/create-socrata-indicator'

// Each row is one victim — no `cantidad` column in this dataset
const crimesAgainstMinorsRowSchema = z
  .object({
    fecha: z.coerce.date(),
    departamento: z.string(),
    municipio: z.string(),
    delito: z.string(),
    genero: z.string(),
    zona: z.string(),
  })
  .transform((row) => ({
    date: row.fecha,
    department: row.departamento,
    municipality: row.municipio,
    crime: row.delito,
    gender: row.genero,
    zone: row.zona,
    count: 1 as number,
  }))

export type CrimesAgainstMinorsRow = z.output<typeof crimesAgainstMinorsRowSchema>

export const { useRaw: useCrimesAgainstMinors, useByYear: useCrimesAgainstMinorsByYear } =
  createSocrataIndicator(CRIMES_AGAINST_MINORS_MANIFEST, crimesAgainstMinorsRowSchema)
