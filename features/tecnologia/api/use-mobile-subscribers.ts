import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import * as z from 'zod'
import { MOBILE_SUBSCRIBERS_MANIFEST } from '@/data/technology'
import type { MultiSeriesResult } from '@/data/types'
import { socrataApi } from '@/lib/api-client'

const rowSchema = z.object({
  a_o: z.coerce.number(),
  trimestre: z.coerce.number(),
  prepago: z.coerce.number(),
  pospago: z.coerce.number(),
})

const responseSchema = z.array(rowSchema)

function useRaw(options?: Pick<QueryObserverOptions, 'enabled'>) {
  return useQuery({
    queryKey: [MOBILE_SUBSCRIBERS_MANIFEST.queryKey, 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(
        MOBILE_SUBSCRIBERS_MANIFEST.resourceId,
        MOBILE_SUBSCRIBERS_MANIFEST.query,
        { signal }
      )
      return responseSchema.parse(raw)
    },
    staleTime: MOBILE_SUBSCRIBERS_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })
}

export function useMobileSubscribersByYear(
  options?: Pick<QueryObserverOptions, 'enabled'>
): MultiSeriesResult {
  const query = useRaw(options)
  const currentYear = new Date().getFullYear()

  const data = useMemo(() => {
    if (!query.data) return undefined

    // For each year, take the latest available quarter
    const byYear = new Map<number, { quarter: number; prepago: number; pospago: number }>()
    for (const row of query.data) {
      const prev = byYear.get(row.a_o)
      if (!prev || row.trimestre > prev.quarter) {
        byYear.set(row.a_o, { quarter: row.trimestre, prepago: row.prepago, pospago: row.pospago })
      }
    }

    return [...byYear.entries()]
      .sort(([a], [b]) => a - b)
      .map(([year, vals]) => ({
        ts: new Date(year, 0, 1).getTime(),
        label: String(year),
        isPartial: year === currentYear || vals.quarter < 4,
        prepago: vals.prepago,
        pospago: vals.pospago,
      }))
  }, [query.data, currentYear])

  return {
    id: MOBILE_SUBSCRIBERS_MANIFEST.id,
    label: MOBILE_SUBSCRIBERS_MANIFEST.label,
    description: MOBILE_SUBSCRIBERS_MANIFEST.description,
    question: MOBILE_SUBSCRIBERS_MANIFEST.question,
    source: MOBILE_SUBSCRIBERS_MANIFEST.source,
    sourceUrl: MOBILE_SUBSCRIBERS_MANIFEST.sourceUrl,
    unit: MOBILE_SUBSCRIBERS_MANIFEST.unit,
    positiveDirection: MOBILE_SUBSCRIBERS_MANIFEST.positiveDirection,
    data,
    isLoading: query.isPending,
    error: query.error,
    dataUpdatedAt: query.dataUpdatedAt,
  }
}
