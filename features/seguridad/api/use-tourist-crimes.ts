import * as z from 'zod'
import { TOURIST_CRIMES_MANIFEST } from '@/data/security'
import { createSocrataIndicator } from '@/lib/create-socrata-indicator'

// No `cantidad` field — each row is one incident, so count is always 1
const touristCrimesRowSchema = z
  .object({
    fecha: z.coerce.date(),
    departamento: z.string(),
    municipio: z.string(),
  })
  .transform((row) => ({
    date: row.fecha,
    department: row.departamento,
    municipality: row.municipio,
    count: 1 as number,
  }))

export type TouristCrimesRow = z.output<typeof touristCrimesRowSchema>

export const { useRaw: useTouristCrimes, useByYear: useTouristCrimesByYear } = createSocrataIndicator(
  TOURIST_CRIMES_MANIFEST,
  touristCrimesRowSchema
)
