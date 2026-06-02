'use client'

import { IconInfoCircle } from '@tabler/icons-react'
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
import type { Event } from '@/data/events'
import type { YearPoint } from '@/hooks/use-indicator-by-year'
import { formatNumber } from '@/utils/format'

type IndicatorAnnualChartProps = {
  label: string
  description?: string
  source: string
  sourceUrl: string
  events?: Event[]
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
}

export function IndicatorAnnualChart({
  label,
  description,
  source,
  sourceUrl,
  events,
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
}: IndicatorAnnualChartProps) {
  if (isLoading) return <ChartSkeleton />
  if (error)
    return <p className="text-destructive text-sm">Error: {error.message}</p>
  if (!data || !first || !latest) return <ChartEmpty indicator={label} />

  return (
    <IndicatorChartCard>
      <IndicatorChartCardHeader
        title={label}
        subtitle={`Total nacional reportado, ${first.year}\u2013${latest.year}`}
      >
        {description && (
          <InfoTip content={description}>
            <IconInfoCircle className="size-4 text-muted-foreground" />
          </InfoTip>
        )}
      </IndicatorChartCardHeader>

      <IndicatorChartCardContent>
        <TimeLineChart
          data={data}
          xKey="year"
          yKey={yKey}
          yLabel={label}
          unit={displayUnit}
          events={events}
          decimals={yKey === 'rate' ? 1 : 0}
        />
        {delta !== null && previous && displayValue && (
          <p className="mt-2 text-sm text-muted-foreground">
            {latest.year}: {displayValue} {displayUnit} ({delta > 0 ? '+' : ''}
            {formatNumber(delta, 1)}% vs {previous.year})
          </p>
        )}
      </IndicatorChartCardContent>

      <IndicatorChartCardFooter source={source} sourceUrl={sourceUrl} />
    </IndicatorChartCard>
  )
}
