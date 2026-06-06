import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import * as z from 'zod'
import { DETAINED_ABROAD_MANIFEST } from '@/data/international-relations'
import { useYearlyIndicator } from '@/hooks/use-indicator-by-year'
import { socrataApi } from '@/lib/api-client'

const rowSchema = z.object({
  fecha: z.string(),
  total: z.coerce.number(),
})

const responseSchema = z.array(rowSchema)

function useRaw(options?: Pick<QueryObserverOptions, 'enabled'>) {
  return useQuery({
    queryKey: [DETAINED_ABROAD_MANIFEST.queryKey, 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(
        DETAINED_ABROAD_MANIFEST.resourceId,
        DETAINED_ABROAD_MANIFEST.query,
        { signal }
      )
      return responseSchema.parse(raw)
    },
    staleTime: DETAINED_ABROAD_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })
}

export function useDetainedAbroadByYear(options?: Pick<QueryObserverOptions, 'enabled'>) {
  const query = useRaw(options)
  const currentYear = new Date().getFullYear()

  const allYearly = useMemo(() => {
    if (!query.data) return undefined

    // Monthly census snapshots — pick the latest snapshot per year
    // Filter out data-quality spikes (>50K are erroneous bulk entries)
    const byYear = new Map<number, { date: string; total: number }>()
    for (const row of query.data) {
      if (row.total > 50000) continue
      const year = Number.parseInt(row.fecha.slice(0, 4), 10)
      const prev = byYear.get(year)
      if (!prev || row.fecha > prev.date) {
        byYear.set(year, { date: row.fecha, total: row.total })
      }
    }

    return [...byYear.entries()]
      .sort(([a], [b]) => a - b)
      .map(([year, vals]) => ({
        year,
        ts: new Date(year, 0, 1).getTime(),
        label: String(year),
        total: vals.total,
        rate: 0,
        isPartial: year === currentYear,
      }))
  }, [query.data, currentYear])

  return useYearlyIndicator(
    allYearly,
    { isLoading: query.isPending, error: query.error, dataUpdatedAt: query.dataUpdatedAt },
    DETAINED_ABROAD_MANIFEST
  )
}
