import * as z from 'zod'
import { DISPLACEMENT_MANIFEST } from '@/data/security'
import { createSocrataIndicator } from '@/lib/create-socrata-indicator'

const displacementRowSchema = z
  .object({
    vigencia: z.coerce.number(),
    hecho: z.string(),
    sexo: z.string(),
    etnia: z.string(),
    discapacidad: z.string(),
    ciclo_vital: z.string(),
    per_ocu: z.coerce.number(),
    eventos: z.coerce.number(),
  })
  .transform((row) => ({
    date: new Date(row.vigencia, 0, 1),
    fact: row.hecho,
    sex: row.sexo,
    ethnicity: row.etnia,
    disability: row.discapacidad,
    ageRange: row.ciclo_vital,
    count: row.per_ocu,
    events: row.eventos,
  }))

export type DisplacementRow = z.output<typeof displacementRowSchema>

export const { useRaw: useDisplacement, useByYear: useDisplacementByYear } = createSocrataIndicator(
  DISPLACEMENT_MANIFEST,
  displacementRowSchema
)
