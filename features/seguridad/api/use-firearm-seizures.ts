import * as z from 'zod'
import { FIREARM_SEIZURES_MANIFEST } from '@/data/security'
import { createSocrataIndicator } from '@/lib/create-socrata-indicator'

// fecha_hecho is stored as text in DD/MM/YYYY format, not calendar_date
const parseDDMMYYYY = (s: string) => {
  const [dd, mm, yyyy] = s.split('/')
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd))
}

const firearmSeizuresRowSchema = z
  .object({
    departamento: z.string(),
    municipio_hecho: z.string(),
    codigo_dane: z.string(),
    clase_bien: z.string(),
    fecha_hecho: z.string().transform(parseDDMMYYYY),
    // cantidad is text in the source dataset
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    department: row.departamento,
    municipality: row.municipio_hecho,
    daneCode: row.codigo_dane,
    weaponType: row.clase_bien,
    count: row.cantidad,
  }))

export type FirearmSeizuresRow = z.output<typeof firearmSeizuresRowSchema>

export const { useRaw: useFirearmSeizures, useByYear: useFirearmSeizuresByYear } = createSocrataIndicator(
  FIREARM_SEIZURES_MANIFEST,
  firearmSeizuresRowSchema
)
