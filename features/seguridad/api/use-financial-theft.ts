import { useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { EVENTS } from '@/data/events'
import { FINANCIAL_THEFT_MANIFEST } from '@/data/security'
import { useIndicatorByYear } from '@/hooks/use-indicator-by-year'
import { socrataApi } from '@/lib/api-client'

const financialTheftRowSchema = z
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

const financialTheftResponseSchema = z.array(financialTheftRowSchema)

export type FinancialTheftRow = z.output<typeof financialTheftRowSchema>

export function useFinancialTheft() {
  return useQuery({
    queryKey: ['financialTheft', 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi(
        FINANCIAL_THEFT_MANIFEST.resourceId,
        '$order=fecha_hecho ASC&$limit=3300',
        { signal }
      )

      return financialTheftResponseSchema.parse(raw)
    },
    staleTime: FINANCIAL_THEFT_MANIFEST.cacheTTL * 1000,
  })
}

export function useFinancialTheftByYear() {
  return useIndicatorByYear(
    useFinancialTheft(),
    FINANCIAL_THEFT_MANIFEST,
    EVENTS
  )
}
