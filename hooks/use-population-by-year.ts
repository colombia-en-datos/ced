import { useMemo } from 'react'
import { POPULATION_BY_YEAR } from '@/data/population'
import type { YearPoint } from '@/hooks/use-indicator-by-year'
import { formatNumber } from '@/utils/format'

const SOURCE = 'DANE'
const SOURCE_URL =
  'https://www.dane.gov.co/index.php/estadisticas-por-tema/demografia-y-poblacion/proyecciones-de-poblacion'

export function usePopulationByYear() {
  const currentYear = new Date().getFullYear()

  const data = useMemo<YearPoint[]>(() => {
    return Object.entries(POPULATION_BY_YEAR)
      .filter(([year]) => Number(year) <= currentYear)
      .map(([year, total]) => ({
        year: Number(year),
        total,
        rate: 0,
        isPartial: Number(year) === currentYear,
      }))
      .sort((a, b) => a.year - b.year)
  }, [currentYear])

  const completeYears = useMemo(() => data.filter((d) => !d.isPartial), [data])

  const first = data[0] ?? null
  const latest = completeYears[completeYears.length - 1] ?? null
  const previous = completeYears.length >= 2 ? completeYears[completeYears.length - 2] : null
  const delta = latest && previous ? ((latest.total - previous.total) / previous.total) * 100 : null

  return {
    label: 'Población nacional',
    source: SOURCE,
    sourceUrl: SOURCE_URL,
    unit: 'habitantes',
    displayUnit: 'habitantes',
    displayValue: latest ? formatNumber(latest.total) : null,
    yKey: 'total',
    data,
    completeYears,
    first,
    latest,
    previous,
    absoluteDelta: delta,
    rateDelta: null,
    delta,
    isLoading: false,
    error: null,
  }
}
