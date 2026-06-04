'use client'

import { IconInfoCircle } from '@tabler/icons-react'
import { memo } from 'react'
import { ChartEmpty } from '@/components/chart-empty'
import { ChartSkeleton } from '@/components/chart-skeleton'
import {
  IndicatorChartCard,
  IndicatorChartCardContent,
  IndicatorChartCardFooter,
  IndicatorChartCardHeader,
} from '@/components/indicator-chart-card'
import { IndicatorTrendSummary } from '@/components/indicator-trend-summary'
import { InfoTip } from '@/components/info-tip'
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
  description?: string
  subtitle: string
  source: string
  sourceUrl: string
  positiveDirection?: 'up' | 'down'
  eventsByYear?: Map<number, Event[]>
  data: TimePoint[] | undefined
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
  description,
  subtitle,
  source,
  sourceUrl,
  positiveDirection,
  eventsByYear,
  data,
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
        {description ? (
          <InfoTip content={description}>
            <IconInfoCircle className="size-4 text-muted-foreground" />
          </InfoTip>
        ) : null}
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
          <IndicatorTrendSummary
            periodLabel={latest.label}
            value={displayValue}
            unit={displayUnit}
            delta={delta}
            positiveDirection={positiveDirection}
            previousValue={formatNumber(previous[yKey as keyof TimePoint] as number, 4)}
            previousLabel={previous.label}
          />
        )}
      </IndicatorChartCardContent>

      <IndicatorChartCardFooter source={source} sourceUrl={sourceUrl} dataUpdatedAt={dataUpdatedAt} />
    </IndicatorChartCard>
  )
})
