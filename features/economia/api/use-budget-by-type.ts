import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import * as z from 'zod'
import { BUDGET_BY_TYPE_MANIFEST } from '@/data/economy'
import type { MultiSeriesResult } from '@/data/types'
import { socrataApi } from '@/lib/api-client'

const rowSchema = z.object({
  anio: z.coerce.number(),
  nombretipogasto: z.string(),
  nombremes: z.string(),
  total: z.coerce.number(),
})

const responseSchema = z.array(rowSchema)

type TypeTotals = {
  funcionamiento: number
  inversion: number
  deuda: number
}

const TYPE_MAP: Record<string, keyof TypeTotals> = {
  FUNCIONAMIENTO: 'funcionamiento',
  INVERSION: 'inversion',
  'SERVICIO DE LA DEUDA PÚBLICA': 'deuda',
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

function useBudgetByTypeRaw(options?: Pick<QueryObserverOptions, 'enabled'>) {
  return useQuery({
    queryKey: [BUDGET_BY_TYPE_MANIFEST.queryKey, 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(
        BUDGET_BY_TYPE_MANIFEST.resourceId,
        BUDGET_BY_TYPE_MANIFEST.query,
        { signal }
      )
      return responseSchema.parse(raw)
    },
    staleTime: BUDGET_BY_TYPE_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })
}

export function useBudgetByTypeByYear(options?: Pick<QueryObserverOptions, 'enabled'>): MultiSeriesResult {
  const query = useBudgetByTypeRaw(options)

  const data = useMemo(() => {
    if (!query.data) return undefined

    // For each (year, type), keep only the latest month (cumulative values)
    const latest = new Map<string, { month: number; total: number }>()
    for (const row of query.data) {
      const typeKey = TYPE_MAP[row.nombretipogasto]
      if (!typeKey) continue
      const monthIdx = MONTH_ORDER[row.nombremes] ?? 0
      const key = `${row.anio}_${typeKey}`
      const prev = latest.get(key)
      if (!prev || monthIdx > prev.month) {
        latest.set(key, { month: monthIdx, total: row.total })
      }
    }

    const latestMonthByYear = new Map<number, number>()
    for (const [key, { month }] of latest) {
      const year = Number(key.split('_')[0])
      latestMonthByYear.set(year, Math.max(latestMonthByYear.get(year) ?? 0, month))
    }

    const empty = (): TypeTotals => ({ funcionamiento: 0, inversion: 0, deuda: 0 })

    const byYear = new Map<number, TypeTotals>()
    for (const [key, { total }] of latest) {
      const [yearStr, typeKey] = key.split('_')
      const year = Number(yearStr)
      const entry = byYear.get(year) ?? empty()
      entry[typeKey as keyof TypeTotals] = total / SCALE
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
    id: BUDGET_BY_TYPE_MANIFEST.id,
    label: BUDGET_BY_TYPE_MANIFEST.label,
    description: BUDGET_BY_TYPE_MANIFEST.description,
    question: BUDGET_BY_TYPE_MANIFEST.question,
    source: BUDGET_BY_TYPE_MANIFEST.source,
    sourceUrl: BUDGET_BY_TYPE_MANIFEST.sourceUrl,
    unit: BUDGET_BY_TYPE_MANIFEST.unit,
    positiveDirection: BUDGET_BY_TYPE_MANIFEST.positiveDirection,
    data,
    isLoading: query.isPending,
    error: query.error,
    dataUpdatedAt: query.dataUpdatedAt,
  }
}
