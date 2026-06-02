import { useMemo } from 'react'
import { type KidnappingRow, useKidnappings } from './use-kidnappings'

export type KidnappingYearPoint = {
  year: number
  total: number
  isPartial: boolean
}

function aggregateByYear(
  rows: KidnappingRow[],
  currentYear: number
): KidnappingYearPoint[] {
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

export function useKidnappingsByYear() {
  const query = useKidnappings()
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
    data: yearly,
    completeYears,
    latest,
    previous,
    delta,
  }
}
