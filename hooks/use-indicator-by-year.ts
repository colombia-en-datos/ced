import type { UseQueryResult } from '@tanstack/react-query'
import { useMemo } from 'react'

type CountRow = { date: Date; count: number }

export type YearPoint = {
  year: number
  total: number
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
      isPartial: year === currentYear,
    }))
}

export function useIndicatorByYear<T extends CountRow>(
  query: UseQueryResult<T[]>,
  label: string
) {
  const currentYear = new Date().getFullYear()

  const yearly = useMemo(
    () => (query.data ? aggregateByYear(query.data, currentYear) : undefined),
    [query.data, currentYear]
  )

  const completeYears = useMemo(
    () => yearly?.filter((d) => !d.isPartial),
    [yearly]
  )

  const latest = completeYears?.[completeYears.length - 1] ?? null
  const previous =
    completeYears && completeYears.length >= 2
      ? completeYears[completeYears.length - 2]
      : null
  const delta =
    latest && previous
      ? ((latest.total - previous.total) / previous.total) * 100
      : null

  return {
    ...query,
    label,
    data: yearly,
    completeYears,
    latest,
    previous,
    delta,
  }
}
