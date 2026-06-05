import type { UseQueryResult } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { Event } from '@/data/events'
import { POPULATION_BY_YEAR } from '@/data/population'
import type { IndicatorManifest } from '@/data/types'
import { useAnalysisWindow } from '@/hooks/use-analysis-window'
import { useRateView } from '@/hooks/use-rate-view'
import { useSocrataUpdatedAt } from '@/hooks/use-socrata-updated-at'
import { formatNumber } from '@/utils/format'

type CountRow = { date: Date; count: number }

const PER = 100_000

export type YearPoint = {
  year: number
  /** Epoch ms — used for precise event marker positioning */
  ts: number
  /** Display label for the chart x-axis and trend summary */
  label: string
  total: number
  rate: number
  isPartial: boolean
}

export function aggregateByYear(rows: CountRow[], currentYear: number): YearPoint[] {
  const map = new Map<number, number>()

  for (const row of rows) {
    const year = row.date.getFullYear()
    map.set(year, (map.get(year) ?? 0) + row.count)
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, total]) => ({
      year,
      ts: new Date(year, 0, 1).getTime(),
      label: String(year),
      total,
      rate: POPULATION_BY_YEAR[year] ? (total / POPULATION_BY_YEAR[year]) * PER : 0,
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

export type Periodicity = 'annual' | 'quarterly' | 'monthly' | 'daily'

export type DerivedSource = { label: string; url: string }

export type IndicatorResult = {
  active: boolean
  periodicity: Periodicity
  id: string
  label: string
  description: string
  question?: string
  source: string
  sourceUrl: string
  unit: string
  positiveDirection: 'up' | 'down'
  formula?: string
  derivedSources?: DerivedSource[]
  events: Event[] | undefined
  data: YearPoint[] | undefined
  completeYears: YearPoint[]
  first: YearPoint | null
  latest: YearPoint | null
  previous: YearPoint | null
  absoluteDelta: number | null
  rateDelta: number | null
  delta: number | null
  displayUnit: string
  displayValue: string | null
  yKey: string
  isLoading: boolean
  error: Error | null
  dataUpdatedAt: number
}

/** Composable core — takes pre-built yearly data and adds windowing, deltas, display logic. */
export function useYearlyIndicator(
  allYearly: YearPoint[] | undefined,
  meta: { isLoading: boolean; error: Error | null; dataUpdatedAt: number },
  manifest: IndicatorManifest,
  events?: Event[]
): IndicatorResult {
  const showRate = useRateView((s) => s.showRate)
  const windowFrom = useAnalysisWindow((s) => s.from)
  const windowTo = useAnalysisWindow((s) => s.to)

  const yearly = useMemo(
    () => allYearly?.filter((d) => d.year >= windowFrom && d.year <= windowTo),
    [allYearly, windowFrom, windowTo]
  )

  const completeYears = useMemo(() => yearly?.filter((d) => !d.isPartial) ?? [], [yearly])

  const first = yearly?.[0] ?? null
  const latest = completeYears[completeYears.length - 1] ?? null
  const previous = completeYears.length >= 2 ? completeYears[completeYears.length - 2] : null

  const absoluteDelta = computeDelta(latest, previous, 'total')
  const rateDelta = computeDelta(latest, previous, 'rate')

  const delta = showRate ? rateDelta : absoluteDelta
  const displayUnit = showRate ? 'por 100k hab.' : manifest.unit
  const displayValue = latest
    ? showRate
      ? formatNumber(latest.rate, 4)
      : formatNumber(latest.total, 4)
    : null
  const yKey = showRate ? 'rate' : 'total'

  return {
    active: manifest.active !== false,
    periodicity: 'annual',
    isLoading: meta.isLoading,
    error: meta.error,
    dataUpdatedAt: meta.dataUpdatedAt,
    id: manifest.id,
    label: manifest.label,
    description: manifest.description,
    question: manifest.question,
    source: manifest.source,
    sourceUrl: manifest.sourceUrl,
    unit: manifest.unit,
    positiveDirection: manifest.positiveDirection,
    formula: manifest.formula,
    derivedSources: manifest.derivedSources,
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

/** Composable core for monthly/daily series — no rate toggle, compares consecutive points. */
export function useMonthlyIndicator(
  allPoints: YearPoint[] | undefined,
  meta: { isLoading: boolean; error: Error | null; dataUpdatedAt: number },
  manifest: IndicatorManifest,
  events?: Event[]
): IndicatorResult {
  const windowFrom = useAnalysisWindow((s) => s.from)
  const windowTo = useAnalysisWindow((s) => s.to)

  const filtered = useMemo(
    () => allPoints?.filter((d) => d.year >= windowFrom && d.year <= windowTo),
    [allPoints, windowFrom, windowTo]
  )

  const complete = useMemo(() => filtered?.filter((d) => !d.isPartial) ?? [], [filtered])

  const first = filtered?.[0] ?? null
  const latest = complete[complete.length - 1] ?? null
  const previous = complete.length >= 2 ? complete[complete.length - 2] : null

  const absoluteDelta = computeDelta(latest, previous, 'total')

  return {
    active: manifest.active !== false,
    periodicity: 'monthly',
    isLoading: meta.isLoading,
    error: meta.error,
    dataUpdatedAt: meta.dataUpdatedAt,
    id: manifest.id,
    label: manifest.label,
    description: manifest.description,
    question: manifest.question,
    source: manifest.source,
    sourceUrl: manifest.sourceUrl,
    unit: manifest.unit,
    positiveDirection: manifest.positiveDirection,
    formula: manifest.formula,
    derivedSources: manifest.derivedSources,
    events,
    data: filtered,
    completeYears: complete,
    first,
    latest,
    previous,
    absoluteDelta,
    rateDelta: null,
    delta: absoluteDelta,
    displayUnit: manifest.unit,
    displayValue: latest ? formatNumber(latest.total, 1) : null,
    yKey: 'total',
  }
}

/** Composable core for daily series — no rate toggle, compares consecutive points. */
export function useDailyIndicator(
  allPoints: YearPoint[] | undefined,
  meta: { isLoading: boolean; error: Error | null; dataUpdatedAt: number },
  manifest: IndicatorManifest,
  events?: Event[]
): IndicatorResult {
  const windowFrom = useAnalysisWindow((s) => s.from)
  const windowTo = useAnalysisWindow((s) => s.to)

  const filtered = useMemo(
    () => allPoints?.filter((d) => d.year >= windowFrom && d.year <= windowTo),
    [allPoints, windowFrom, windowTo]
  )

  const complete = useMemo(() => filtered?.filter((d) => !d.isPartial) ?? [], [filtered])

  const first = filtered?.[0] ?? null
  const latest = complete[complete.length - 1] ?? null
  const previous = complete.length >= 2 ? complete[complete.length - 2] : null

  const absoluteDelta = computeDelta(latest, previous, 'total')

  return {
    active: manifest.active !== false,
    periodicity: 'daily',
    isLoading: meta.isLoading,
    error: meta.error,
    dataUpdatedAt: meta.dataUpdatedAt,
    id: manifest.id,
    label: manifest.label,
    description: manifest.description,
    question: manifest.question,
    source: manifest.source,
    sourceUrl: manifest.sourceUrl,
    unit: manifest.unit,
    positiveDirection: manifest.positiveDirection,
    formula: manifest.formula,
    derivedSources: manifest.derivedSources,
    events,
    data: filtered,
    completeYears: complete,
    first,
    latest,
    previous,
    absoluteDelta,
    rateDelta: null,
    delta: absoluteDelta,
    displayUnit: manifest.unit,
    displayValue: latest ? formatNumber(latest.total, 1) : null,
    yKey: 'total',
  }
}

/** Socrata convenience wrapper — aggregates rows by year and fetches source updated-at. */
export function useIndicatorByYear<T extends CountRow>(
  query: UseQueryResult<T[]>,
  manifest: IndicatorManifest,
  events?: Event[]
): IndicatorResult {
  const currentYear = new Date().getFullYear()
  const sourceUpdatedAt = useSocrataUpdatedAt(manifest.resourceId, manifest.cacheTTL, {
    enabled: query.data !== undefined,
  })

  const allYearly = useMemo(
    () => (query.data ? aggregateByYear(query.data, currentYear) : undefined),
    [query.data, currentYear]
  )

  return useYearlyIndicator(
    allYearly,
    {
      isLoading: query.isPending,
      error: query.error,
      dataUpdatedAt: sourceUpdatedAt ?? query.dataUpdatedAt,
    },
    manifest,
    events
  )
}
