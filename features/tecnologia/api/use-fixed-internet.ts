import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import * as z from 'zod'
import { FIXED_INTERNET_MANIFEST } from '@/data/technology'
import type { MultiSeriesResult } from '@/data/types'
import { socrataApi } from '@/lib/api-client'

const rowSchema = z.object({
  anno: z.coerce.number(),
  trimestre: z.coerce.number(),
  tecnologia: z.string(),
  total: z.coerce.number(),
})

const responseSchema = z.array(rowSchema)

type TechTotals = {
  fibra: number
  hfc: number
  cable: number
  xdsl: number
  otros: number
}

// Map raw technology names to 5 display groups
function techGroup(name: string): keyof TechTotals {
  const upper = name.toUpperCase()
  if (
    upper.includes('FTTH') ||
    upper.includes('FTTB') ||
    upper.includes('FTTC') ||
    upper.includes('FTTN') ||
    upper.includes('FTTP') ||
    upper.includes('FTTA') ||
    upper.includes('FIBER') ||
    upper.includes('FIBRA')
  )
    return 'fibra'
  if (upper.includes('HFC') || upper.includes('HYBRID FIBER COAXIAL')) return 'hfc'
  if (upper === 'CABLE') return 'cable'
  if (upper.includes('XDSL') || upper.includes('DSL')) return 'xdsl'
  return 'otros'
}

function useRaw(options?: Pick<QueryObserverOptions, 'enabled'>) {
  return useQuery({
    queryKey: [FIXED_INTERNET_MANIFEST.queryKey, 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(
        FIXED_INTERNET_MANIFEST.resourceId,
        FIXED_INTERNET_MANIFEST.query,
        { signal }
      )
      return responseSchema.parse(raw)
    },
    staleTime: FIXED_INTERNET_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })
}

export function useFixedInternetByYear(options?: Pick<QueryObserverOptions, 'enabled'>): MultiSeriesResult {
  const query = useRaw(options)
  const currentYear = new Date().getFullYear()

  const data = useMemo(() => {
    if (!query.data) return undefined

    // Aggregate by (year, quarter) → tech group, then keep latest quarter per year
    const byYearQuarter = new Map<string, TechTotals>()
    for (const row of query.data) {
      const key = `${row.anno}_${row.trimestre}`
      const entry = byYearQuarter.get(key) ?? { fibra: 0, hfc: 0, cable: 0, xdsl: 0, otros: 0 }
      const group = techGroup(row.tecnologia)
      entry[group] += row.total
      byYearQuarter.set(key, entry)
    }

    // For each year, pick the quarter with the highest number
    const byYear = new Map<number, { quarter: number; totals: TechTotals }>()
    for (const [key, totals] of byYearQuarter) {
      const [yearStr, qStr] = key.split('_')
      const year = Number(yearStr)
      const quarter = Number(qStr)
      const prev = byYear.get(year)
      if (!prev || quarter > prev.quarter) {
        byYear.set(year, { quarter, totals })
      }
    }

    return [...byYear.entries()]
      .sort(([a], [b]) => a - b)
      .map(([year, { quarter, totals }]) => ({
        ts: new Date(year, 0, 1).getTime(),
        label: String(year),
        isPartial: year === currentYear || quarter < 4,
        ...totals,
      }))
  }, [query.data, currentYear])

  return {
    id: FIXED_INTERNET_MANIFEST.id,
    label: FIXED_INTERNET_MANIFEST.label,
    description: FIXED_INTERNET_MANIFEST.description,
    question: FIXED_INTERNET_MANIFEST.question,
    source: FIXED_INTERNET_MANIFEST.source,
    sourceUrl: FIXED_INTERNET_MANIFEST.sourceUrl,
    unit: FIXED_INTERNET_MANIFEST.unit,
    positiveDirection: FIXED_INTERNET_MANIFEST.positiveDirection,
    data,
    isLoading: query.isPending,
    error: query.error,
    dataUpdatedAt: query.dataUpdatedAt,
  }
}
