import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import * as z from 'zod'
import { EVENTS } from '@/data/events'
import type { IndicatorManifest } from '@/data/types'
import { useYearlyIndicator, type YearPoint } from '@/hooks/use-indicator-by-year'
import { worldBankApi } from '@/lib/api-client'

const wbRowSchema = z.object({
  date: z.coerce.number(),
  value: z.number().nullable(),
})

type WbRow = z.infer<typeof wbRowSchema>

function toYearPoints(rows: WbRow[], currentYear: number): YearPoint[] {
  return rows
    .filter((r) => r.value !== null)
    .map((r) => ({
      year: r.date,
      ts: new Date(r.date, 0, 1).getTime(),
      label: String(r.date),
      total: r.value as number,
      rate: 0,
      isPartial: r.date === currentYear,
    }))
    .sort((a, b) => a.year - b.year)
}

export function createWorldBankIndicator(manifest: IndicatorManifest) {
  function useRaw(options?: Pick<QueryObserverOptions, 'enabled'>) {
    return useQuery({
      queryKey: [manifest.queryKey, 'raw'],
      queryFn: async ({ signal }) => {
        const raw = await worldBankApi<WbRow>(manifest.resourceId, { signal })
        return z.array(wbRowSchema).parse(raw)
      },
      staleTime: manifest.cacheTTL * 1000,
      enabled: manifest.active !== false && Boolean(options?.enabled),
    })
  }

  function useByYear(options?: Pick<QueryObserverOptions, 'enabled'>) {
    const query = useRaw(options)
    const currentYear = new Date().getFullYear()

    const allYearly = useMemo(
      () => (query.data ? toYearPoints(query.data, currentYear) : undefined),
      [query.data, currentYear]
    )

    return useYearlyIndicator(
      allYearly,
      { isLoading: query.isPending, error: query.error, dataUpdatedAt: query.dataUpdatedAt },
      manifest,
      EVENTS
    )
  }

  return { useRaw, useByYear }
}
