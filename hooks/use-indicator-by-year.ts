import type { UseQueryResult } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { Event } from '@/data/events'
import { POPULATION_BY_YEAR } from '@/data/population'
import type { IndicatorManifest } from '@/data/types'
import { useRateView } from '@/hooks/use-rate-view'
import { formatNumber } from '@/utils/format'

type CountRow = { date: Date; count: number }

const PER = 100_000

export type YearPoint = {
  year: number
  total: number
  rate: number
  isPartial: boolean
}

function aggregateByYear(rows: CountRow[], currentYear: number): YearPoint[] {
  const map = new Map<number, number>()

  for (const row of rows) {
    const year = row.date.getFullYear()
    map.set(year, (map.get(year) ?? 0) + row.count)
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, total]) => ({
      year,
      total,
      rate: POPULATION_BY_YEAR[year]
        ? (total / POPULATION_BY_YEAR[year]) * PER
        : 0,
      isPartial: year === currentYear,
    }))
}

function computeDelta(
  latest: YearPoint | null,
  previous: YearPoint | null,
  field: 'total' | 'rate'
): number | null {
  return latest && previous && previous[field] !== 0
    ? ((latest[field] - previous[field]) / previous[field]) * 100
    : null
}

export function useIndicatorByYear<T extends CountRow>(
  query: UseQueryResult<T[]>,
  manifest: IndicatorManifest,
  events?: Event[]
) {
  const currentYear = new Date().getFullYear()
  const showRate = useRateView((s) => s.showRate)

  const yearly = useMemo(
    () => (query.data ? aggregateByYear(query.data, currentYear) : undefined),
    [query.data, currentYear]
  )

  const completeYears = useMemo(
    () => yearly?.filter((d) => !d.isPartial) ?? [],
    [yearly]
  )

  const first = yearly?.[0] ?? null
  const latest = completeYears[completeYears.length - 1] ?? null
  const previous =
    completeYears.length >= 2 ? completeYears[completeYears.length - 2] : null

  const absoluteDelta = computeDelta(latest, previous, 'total')
  const rateDelta = computeDelta(latest, previous, 'rate')

  const delta = showRate ? rateDelta : absoluteDelta
  const displayUnit = showRate ? 'por 100k hab.' : manifest.unit
  const displayValue = latest
    ? showRate
      ? formatNumber(latest.rate, 1)
      : formatNumber(latest.total)
    : null
  const yKey = showRate ? 'rate' : 'total'

  return {
    ...query,
    label: manifest.label,
    description: manifest.description,
    source: manifest.source,
    sourceUrl: manifest.sourceUrl,
    unit: manifest.unit,
    positiveDirection: manifest.positiveDirection,
    events,
    data: yearly,
    completeYears,
    first,
    latest,
    previous,
    absoluteDelta,
    rateDelta,
    delta,
    displayUnit,
    displayValue,
    yKey,
  }
}
