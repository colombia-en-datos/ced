'use client'

import type { ReactNode } from 'react'
import { memo } from 'react'
import { ChartEmpty } from '@/components/chart-empty'
import { ChartSkeleton } from '@/components/chart-skeleton'
import {
  IndicatorChartCard,
  IndicatorChartCardContent,
  IndicatorChartCardFooter,
  IndicatorChartCardHeader,
} from '@/components/indicator-chart-card'
import { IndicatorRangeSummary, IndicatorTrendSummary } from '@/components/indicator-trend-summary'
import { TimeLineChart } from '@/components/time-line-chart'
import type { Event } from '@/data/events'
import { formatNumber } from '@/utils/format'

export type TimePoint = {
  /** Epoch ms — used for precise chart positioning */
  ts: number
  /** Display label for x-axis: "2024", "Ene 24", "15 Jun" */
  label: string
  total: number
  rate: number
  isPartial: boolean
}

type IndicatorTimeChartProps = {
  id?: string
  title: string
  headerInfo?: ReactNode
  subtitle: string
  source: string
  sourceUrl: string
  positiveDirection?: 'up' | 'down'
  eventsByYear?: Map<number, Event[]>
  data: TimePoint[] | undefined
  first: TimePoint | null
  latest: TimePoint | null
  previous: TimePoint | null
  delta: number | null
  displayUnit: string
  displayValue: string | null
  yKey: string
  isLoading: boolean
  error: Error | null
  dataUpdatedAt?: number
}

export const IndicatorTimeChart = memo(function IndicatorTimeChart({
  id,
  title,
  headerInfo,
  subtitle,
  source,
  sourceUrl,
  positiveDirection,
  eventsByYear,
  data,
  first,
  latest,
  previous,
  delta,
  displayUnit,
  displayValue,
  yKey,
  isLoading,
  error,
  dataUpdatedAt,
}: IndicatorTimeChartProps) {
  if (isLoading) return <ChartSkeleton />
  if (error) return <p className="text-destructive text-sm">Error: {error.message}</p>
  if (!data || !latest) return <ChartEmpty indicator={title} />

  return (
    <IndicatorChartCard id={id}>
      <IndicatorChartCardHeader title={title} subtitle={subtitle}>
        {headerInfo}
      </IndicatorChartCardHeader>

      <IndicatorChartCardContent>
        <TimeLineChart
          data={data}
          yKey={yKey}
          yLabel={title}
          unit={displayUnit}
          eventsByYear={eventsByYear}
          decimals={4}
          positiveDirection={positiveDirection}
        />
        {delta !== null && previous && displayValue && positiveDirection != null && (
          <div className="mt-3 flex flex-col gap-1">
            <IndicatorTrendSummary
              periodLabel={latest.label}
              value={displayValue}
              unit={displayUnit}
              delta={delta}
              positiveDirection={positiveDirection}
              previousValue={formatNumber(previous[yKey as keyof TimePoint] as number, 4)}
              previousLabel={previous.label}
            />
            {first && first.ts !== previous.ts && (() => {
              const firstVal = first[yKey as keyof TimePoint] as number
              const latestVal = latest[yKey as keyof TimePoint] as number
              const rangeDelta = firstVal !== 0 ? ((latestVal - firstVal) / firstVal) * 100 : null
              return rangeDelta !== null ? (
                <IndicatorRangeSummary
                  periodLabel={`${first.label}\u2013${latest.label}`}
                  delta={rangeDelta}
                  positiveDirection={positiveDirection}
                  fromValue={formatNumber(firstVal, 4)}
                />
              ) : null
            })()}
          </div>
        )}
      </IndicatorChartCardContent>

      <IndicatorChartCardFooter source={source} sourceUrl={sourceUrl} dataUpdatedAt={dataUpdatedAt} />
    </IndicatorChartCard>
  )
})
