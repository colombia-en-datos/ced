import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import * as z from 'zod'
import { EVENTS } from '@/data/events'
import type { IndicatorManifest } from '@/data/types'
import {
  useDailyIndicator,
  useMonthlyIndicator,
  useYearlyIndicator,
  type YearPoint,
} from '@/hooks/use-indicator-by-year'
import { banrepApi } from '@/lib/api-client'

const dataPointSchema = z.tuple([z.number(), z.number()])

const responseSchema = z.array(z.object({ data: z.array(dataPointSchema) })).transform((arr) => arr[0])

type DataPoints = z.infer<typeof responseSchema>['data']

const MONTH_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function toYearPoints(data: DataPoints, currentYear: number): YearPoint[] {
  return data.map(([ts, value]) => {
    const year = new Date(ts).getFullYear()
    return { year, ts, label: String(year), total: value, rate: 0, isPartial: year === currentYear }
  })
}

function toMonthPoints(data: DataPoints, currentYear: number, currentMonth: number): YearPoint[] {
  return data.map(([ts, value]) => {
    const d = new Date(ts)
    const year = d.getFullYear()
    const month = d.getMonth()
    const label = `${MONTH_SHORT[month]} ${year}`
    return {
      year,
      ts,
      label,
      total: value,
      rate: 0,
      isPartial: year === currentYear && month === currentMonth,
    }
  })
}

function toDayPoints(
  data: DataPoints,
  currentYear: number,
  currentMonth: number,
  currentDay: number
): YearPoint[] {
  return data.map(([ts, value]) => {
    const d = new Date(ts)
    const year = d.getFullYear()
    const month = d.getMonth()
    const day = d.getDate()
    const label = `${day} ${MONTH_SHORT[month]} ${year}`
    return {
      year,
      ts,
      label,
      total: value,
      rate: 0,
      isPartial: year === currentYear && month === currentMonth && day === currentDay,
    }
  })
}

export function createBanrepIndicator(manifest: IndicatorManifest) {
  function useRaw(options?: Pick<QueryObserverOptions, 'enabled'>) {
    return useQuery({
      queryKey: [manifest.queryKey, 'raw'],
      queryFn: async ({ signal }) => {
        const raw = await banrepApi.series(manifest.resourceId, { signal })
        const parsed = responseSchema.parse(raw)
        return parsed.data
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

  function useByMonth(options?: Pick<QueryObserverOptions, 'enabled'>) {
    const query = useRaw(options)
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()

    const allMonthly = useMemo(
      () => (query.data ? toMonthPoints(query.data, currentYear, currentMonth) : undefined),
      [query.data, currentYear, currentMonth]
    )

    return useMonthlyIndicator(
      allMonthly,
      { isLoading: query.isPending, error: query.error, dataUpdatedAt: query.dataUpdatedAt },
      manifest,
      EVENTS
    )
  }

  function useByDay(options?: Pick<QueryObserverOptions, 'enabled'>) {
    const query = useRaw(options)
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()
    const currentDay = now.getDate()

    const allDaily = useMemo(
      () => (query.data ? toDayPoints(query.data, currentYear, currentMonth, currentDay) : undefined),
      [query.data, currentYear, currentMonth, currentDay]
    )

    return useDailyIndicator(
      allDaily,
      { isLoading: query.isPending, error: query.error, dataUpdatedAt: query.dataUpdatedAt },
      manifest,
      EVENTS
    )
  }

  return { useRaw, useByYear, useByMonth, useByDay }
}
