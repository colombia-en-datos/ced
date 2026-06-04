import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import * as z from 'zod'
import { REAL_MINIMUM_WAGE_MANIFEST } from '@/data/economy'
import { EVENTS } from '@/data/events'
import { useYearlyIndicator } from '@/hooks/use-indicator-by-year'
import { banrepApi } from '@/lib/api-client'

const seriesSchema = z
  .array(z.object({ data: z.array(z.tuple([z.number(), z.number()])) }))
  .transform((arr) => arr[0].data)

const WAGE_SERIES = '15416'
const IPC_SERIES = '15000'

function useRealMinimumWageRaw(options?: Pick<QueryObserverOptions, 'enabled'>) {
  const wageQuery = useQuery({
    queryKey: ['minimumWage', 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await banrepApi.series(WAGE_SERIES, { signal })
      return seriesSchema.parse(raw)
    },
    staleTime: REAL_MINIMUM_WAGE_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })

  const ipcQuery = useQuery({
    queryKey: ['ipc', 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await banrepApi.series(IPC_SERIES, { signal })
      return seriesSchema.parse(raw)
    },
    staleTime: REAL_MINIMUM_WAGE_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })

  return { wageQuery, ipcQuery }
}

/** Average IPC across all months for each year. */
function buildAverageIpcByYear(ipcData: [number, number][]): Map<number, number> {
  const sums = new Map<number, { total: number; count: number }>()
  for (const [ts, value] of ipcData) {
    const year = new Date(ts).getFullYear()
    const entry = sums.get(year) ?? { total: 0, count: 0 }
    entry.total += value
    entry.count += 1
    sums.set(year, entry)
  }
  const result = new Map<number, number>()
  for (const [year, { total, count }] of sums) {
    result.set(year, total / count)
  }
  return result
}

export function useRealMinimumWageByYear(options?: Pick<QueryObserverOptions, 'enabled'>) {
  const { wageQuery, ipcQuery } = useRealMinimumWageRaw(options)
  const currentYear = new Date().getFullYear()

  const allYearly = useMemo(() => {
    if (!wageQuery.data || !ipcQuery.data) return undefined

    const ipcByYear = buildAverageIpcByYear(ipcQuery.data)

    // Compute real wage for each year: nominal / IPC * 100
    const realWages: { year: number; ts: number; realWage: number }[] = []
    for (const [ts, nominalWage] of wageQuery.data) {
      const year = new Date(ts).getFullYear()
      const ipc = ipcByYear.get(year) ?? ipcByYear.get(year - 1)
      if (ipc == null || ipc === 0) continue
      realWages.push({ year, ts, realWage: (nominalWage / ipc) * 100 })
    }

    // Rebase to index: oldest year = 100
    realWages.sort((a, b) => a.year - b.year)
    const baseValue = realWages[0]?.realWage
    if (!baseValue) return undefined

    return realWages.map(({ year, ts, realWage }) => ({
      year,
      ts,
      label: String(year),
      total: (realWage / baseValue) * 100,
      rate: 0,
      isPartial: year === currentYear,
    }))
  }, [wageQuery.data, ipcQuery.data, currentYear])

  return useYearlyIndicator(
    allYearly,
    {
      isLoading: wageQuery.isPending || ipcQuery.isPending,
      error: wageQuery.error ?? ipcQuery.error,
      dataUpdatedAt: Math.max(wageQuery.dataUpdatedAt, ipcQuery.dataUpdatedAt),
    },
    REAL_MINIMUM_WAGE_MANIFEST,
    EVENTS
  )
}
