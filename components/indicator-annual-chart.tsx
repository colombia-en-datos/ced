'use client'

import { ChartEmpty } from '@/components/chart-empty'
import { ChartSkeleton } from '@/components/chart-skeleton'
import { IndicatorChartCard } from '@/components/indicator-chart-card'
import { TimeLineChart } from '@/components/time-line-chart'
import { Events } from '@/data/events'
import type { IndicatorManifest } from '@/data/types'

type YearPoint = {
  year: number
  total: number
  isPartial: boolean
}

type IndicatorAnnualChartProps = {
  manifest: IndicatorManifest
  label: string
  data: YearPoint[] | undefined
  latest: YearPoint | null
  previous: YearPoint | null
  delta: number | null
  isLoading: boolean
  error: Error | null
}

export function IndicatorAnnualChart({
  manifest,
  label,
  data,
  latest,
  previous,
  delta,
  isLoading,
  error,
}: IndicatorAnnualChartProps) {
  if (isLoading) return <ChartSkeleton />
  if (error)
    return <p className="text-destructive text-sm">Error: {error.message}</p>
  if (!data?.length || !latest) return <ChartEmpty indicator={manifest.label} />

  return (
    <IndicatorChartCard
      title={label}
      subtitle={`Total nacional reportado, ${data[0].year}\u2013${latest.year}`}
      source={manifest.source}
      sourceUrl={manifest.sourceUrl}
    >
      <TimeLineChart
        data={data}
        xKey="year"
        yKey="total"
        yLabel={manifest.label}
        policyEvents={Events}
      />
      {delta !== null && previous && (
        <p className="mt-2 text-sm text-muted-foreground">
          {latest.year}: {latest.total.toLocaleString('es-CO')} {manifest.unit}{' '}
          ({delta > 0 ? '+' : ''}
          {delta.toFixed(1)}% vs {previous.year})
        </p>
      )}
    </IndicatorChartCard>
  )
}
