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
import { InfoTip } from '@/components/info-tip'
import { TimeLineChart } from '@/components/time-line-chart'
import { TrendBadge } from '@/components/trend-badge'
import type { Event } from '@/data/events'
import type { YearPoint } from '@/hooks/use-indicator-by-year'
import { formatNumber } from '@/utils/format'

type IndicatorAnnualChartProps = {
  id?: string
  label: string
  description?: string
  source: string
  sourceUrl: string
  positiveDirection?: 'up' | 'down'
  eventsByYear?: Map<number, Event[]>
  data: YearPoint[] | undefined
  first: YearPoint | null
  latest: YearPoint | null
  previous: YearPoint | null
  delta: number | null
  displayUnit: string
  displayValue: string | null
  yKey: string
  isLoading: boolean
  error: Error | null
  dataUpdatedAt?: number
}

export const IndicatorAnnualChart = memo(function IndicatorAnnualChart({
  id,
  label,
  description,
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
}: IndicatorAnnualChartProps) {
  if (isLoading) return <ChartSkeleton />
  if (error) return <p className="text-destructive text-sm">Error: {error.message}</p>
  if (!data || !first || !latest) return <ChartEmpty indicator={label} />

  return (
    <IndicatorChartCard id={id}>
      <IndicatorChartCardHeader
        title={label}
        subtitle={`Total nacional reportado, ${first.year}\u2013${latest.year}`}
      >
        {description ? (
          <InfoTip content={description}>
            <IconInfoCircle className="size-4 text-muted-foreground" />
          </InfoTip>
        ) : null}
      </IndicatorChartCardHeader>

      <IndicatorChartCardContent>
        <TimeLineChart
          data={data}
          xKey="year"
          yKey={yKey}
          yLabel={label}
          unit={displayUnit}
          eventsByYear={eventsByYear}
          decimals={yKey === 'rate' ? 1 : 0}
        />
        {delta !== null && previous && displayValue && (
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-sm font-medium tabular-nums text-foreground">
              {latest.year}: {displayValue}{' '}
              <span className="font-sans text-xs font-normal text-muted-foreground">{displayUnit}</span>
            </span>
            {positiveDirection != null && <TrendBadge delta={delta} positiveDirection={positiveDirection} />}
            <span className="text-xs text-muted-foreground/60">
              vs{' '}
              <span className="font-mono tabular-nums">
                {formatNumber(previous[yKey as keyof YearPoint] as number, yKey === 'rate' ? 1 : 0)}
              </span>{' '}
              en {previous.year}
            </span>
          </div>
        )}
      </IndicatorChartCardContent>

      <IndicatorChartCardFooter source={source} sourceUrl={sourceUrl} dataUpdatedAt={dataUpdatedAt} />
    </IndicatorChartCard>
  )
})
