import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import * as z from 'zod'
import { AIR_QUALITY_MANIFEST } from '@/data/environment'
import type { MultiSeriesResult } from '@/data/types'
import { socrataApi } from '@/lib/api-client'

const rowSchema = z.object({
  year: z.coerce.number(),
  msfl_code: z.string(),
  avg_conc: z.coerce.number(),
})

const responseSchema = z.array(rowSchema)

type PollutantTotals = {
  pm25: number
  pm10: number
  so2: number
}

const POLLUTANT_MAP: Record<string, keyof PollutantTotals> = {
  'PM2.5': 'pm25',
  PM10: 'pm10',
  SO2: 'so2',
}

function useAirQualityRaw(options?: Pick<QueryObserverOptions, 'enabled'>) {
  return useQuery({
    queryKey: [AIR_QUALITY_MANIFEST.queryKey, 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(AIR_QUALITY_MANIFEST.resourceId, AIR_QUALITY_MANIFEST.query, {
        signal,
      })
      return responseSchema.parse(raw)
    },
    staleTime: AIR_QUALITY_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })
}

export function useAirQualityByYear(options?: Pick<QueryObserverOptions, 'enabled'>): MultiSeriesResult {
  const query = useAirQualityRaw(options)
  const currentYear = new Date().getFullYear()

  const data = useMemo(() => {
    if (!query.data) return undefined

    const byYear = new Map<number, PollutantTotals>()
    for (const row of query.data) {
      const key = POLLUTANT_MAP[row.msfl_code]
      if (!key) continue
      const entry = byYear.get(row.year) ?? { pm25: 0, pm10: 0, so2: 0 }
      entry[key] = Math.round(row.avg_conc * 100) / 100
      byYear.set(row.year, entry)
    }

    return [...byYear.entries()]
      .sort(([a], [b]) => a - b)
      .map(([year, vals]) => ({
        ts: new Date(year, 0, 1).getTime(),
        label: String(year),
        isPartial: year === currentYear,
        ...vals,
      }))
  }, [query.data, currentYear])

  return {
    id: AIR_QUALITY_MANIFEST.id,
    label: AIR_QUALITY_MANIFEST.label,
    description: AIR_QUALITY_MANIFEST.description,
    question: AIR_QUALITY_MANIFEST.question,
    source: AIR_QUALITY_MANIFEST.source,
    sourceUrl: AIR_QUALITY_MANIFEST.sourceUrl,
    unit: AIR_QUALITY_MANIFEST.unit,
    positiveDirection: AIR_QUALITY_MANIFEST.positiveDirection,
    data,
    isLoading: query.isPending,
    error: query.error,
    dataUpdatedAt: query.dataUpdatedAt,
  }
}
