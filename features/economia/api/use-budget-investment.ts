import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import * as z from 'zod'
import { BUDGET_INVESTMENT_MANIFEST } from '@/data/economy'
import type { MultiSeriesResult } from '@/data/types'
import { socrataApi } from '@/lib/api-client'

const rowSchema = z.object({
  anio: z.coerce.number(),
  sector: z.string(),
  nombremes: z.string(),
  total: z.coerce.number(),
})

const responseSchema = z.array(rowSchema)

type SectorTotals = {
  transporte: number
  inclusionSocial: number
  igualdadEquidad: number
  educacion: number
  trabajo: number
  minasEnergia: number
  vivienda: number
  agricultura: number
}

const SECTOR_MAP: Record<string, keyof SectorTotals> = {
  TRANSPORTE: 'transporte',
  'INCLUSION SOCIAL Y RECONCILIACION': 'inclusionSocial',
  'IGUALDAD Y EQUIDAD': 'igualdadEquidad',
  EDUCACION: 'educacion',
  TRABAJO: 'trabajo',
  'MINAS Y ENERGIA': 'minasEnergia',
  'VIVIENDA, CIUDAD Y TERRITORIO': 'vivienda',
  'AGRICULTURA Y DESARROLLO RURAL': 'agricultura',
}

const MONTH_ORDER: Record<string, number> = {
  Enero: 1,
  Febrero: 2,
  Marzo: 3,
  Abril: 4,
  Mayo: 5,
  Junio: 6,
  Julio: 7,
  Agosto: 8,
  Septiembre: 9,
  Octubre: 10,
  Noviembre: 11,
  Diciembre: 12,
}

const SCALE = 1e12

function useBudgetInvestmentRaw(options?: Pick<QueryObserverOptions, 'enabled'>) {
  return useQuery({
    queryKey: [BUDGET_INVESTMENT_MANIFEST.queryKey, 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(
        BUDGET_INVESTMENT_MANIFEST.resourceId,
        BUDGET_INVESTMENT_MANIFEST.query,
        { signal }
      )
      return responseSchema.parse(raw)
    },
    staleTime: BUDGET_INVESTMENT_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })
}

export function useBudgetInvestmentByYear(
  options?: Pick<QueryObserverOptions, 'enabled'>
): MultiSeriesResult {
  const query = useBudgetInvestmentRaw(options)

  const data = useMemo(() => {
    if (!query.data) return undefined

    // For each (year, sector), keep only the latest month (cumulative values)
    const latest = new Map<string, { month: number; total: number }>()
    for (const row of query.data) {
      const sectorKey = SECTOR_MAP[row.sector]
      if (!sectorKey) continue
      const monthIdx = MONTH_ORDER[row.nombremes] ?? 0
      const key = `${row.anio}_${sectorKey}`
      const prev = latest.get(key)
      if (!prev || monthIdx > prev.month) {
        latest.set(key, { month: monthIdx, total: row.total })
      }
    }

    // Find the latest month per year (to detect partial years)
    const latestMonthByYear = new Map<number, number>()
    for (const [key, { month }] of latest) {
      const year = Number(key.split('_')[0])
      latestMonthByYear.set(year, Math.max(latestMonthByYear.get(year) ?? 0, month))
    }

    const empty = (): SectorTotals => ({
      transporte: 0,
      inclusionSocial: 0,
      igualdadEquidad: 0,
      educacion: 0,
      trabajo: 0,
      minasEnergia: 0,
      vivienda: 0,
      agricultura: 0,
    })

    const byYear = new Map<number, SectorTotals>()
    for (const [key, { total }] of latest) {
      const [yearStr, sectorKey] = key.split('_')
      const year = Number(yearStr)
      const entry = byYear.get(year) ?? empty()
      entry[sectorKey as keyof SectorTotals] = total / SCALE
      byYear.set(year, entry)
    }

    return [...byYear.entries()]
      .sort(([a], [b]) => a - b)
      .map(([year, vals]) => ({
        ts: new Date(year, 0, 1).getTime(),
        label: String(year),
        isPartial: (latestMonthByYear.get(year) ?? 12) < 12,
        ...vals,
      }))
  }, [query.data])

  return {
    id: BUDGET_INVESTMENT_MANIFEST.id,
    label: BUDGET_INVESTMENT_MANIFEST.label,
    description: BUDGET_INVESTMENT_MANIFEST.description,
    question: BUDGET_INVESTMENT_MANIFEST.question,
    source: BUDGET_INVESTMENT_MANIFEST.source,
    sourceUrl: BUDGET_INVESTMENT_MANIFEST.sourceUrl,
    unit: BUDGET_INVESTMENT_MANIFEST.unit,
    positiveDirection: BUDGET_INVESTMENT_MANIFEST.positiveDirection,
    data,
    isLoading: query.isPending,
    error: query.error,
    dataUpdatedAt: query.dataUpdatedAt,
  }
}
