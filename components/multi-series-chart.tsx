'use client'

import { ChartEmpty } from '@/components/chart-empty'
import { ChartSkeleton } from '@/components/chart-skeleton'
import {
  IndicatorChartCard,
  IndicatorChartCardContent,
  IndicatorChartCardFooter,
  IndicatorChartCardHeader,
} from '@/components/indicator-chart-card'
import { IndicatorInfoTip } from '@/components/indicator-info-tip'
import { MultiLineChart, type SeriesConfig } from '@/components/multi-line-chart'
import type { Event } from '@/data/events'
import type { MultiSeriesResult } from '@/data/types'

export function MultiSeriesChart({
  result,
  series,
  eventsByYear,
}: {
  result: MultiSeriesResult
  series: SeriesConfig[]
  eventsByYear: Map<number, Event[]>
}) {
  if (result.isLoading) return <ChartSkeleton />
  if (result.error) return <p className="text-destructive text-sm">Error: {result.error.message}</p>
  if (!result.data) return <ChartEmpty indicator={result.label} />

  return (
    <IndicatorChartCard>
      <IndicatorChartCardHeader title={result.label} subtitle={result.question ?? result.description}>
        <IndicatorInfoTip description={result.description} />
      </IndicatorChartCardHeader>
      <IndicatorChartCardContent>
        <MultiLineChart data={result.data} series={series} unit={result.unit} eventsByYear={eventsByYear} />
      </IndicatorChartCardContent>
      <IndicatorChartCardFooter
        source={result.source}
        sourceUrl={result.sourceUrl}
        dataUpdatedAt={result.dataUpdatedAt}
      />
    </IndicatorChartCard>
  )
}
