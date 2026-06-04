'use client'

import { memo } from 'react'
import { IndicatorInfoTip } from '@/components/indicator-info-tip'
import { IndicatorTimeChart } from '@/components/indicator-time-chart'
import type { Event } from '@/data/events'
import type { DerivedSource, YearPoint } from '@/hooks/use-indicator-by-year'

type IndicatorChartProps = {
  id?: string
  label: string
  description?: string
  formula?: string
  derivedSources?: DerivedSource[]
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

export const IndicatorChart = memo(function IndicatorChart({
  label,
  description,
  formula,
  derivedSources,
  first,
  latest,
  ...rest
}: IndicatorChartProps) {
  const subtitle = first && latest ? `Total nacional reportado, ${first.year}\u2013${latest.year}` : ''

  return (
    <IndicatorTimeChart
      title={label}
      subtitle={subtitle}
      headerInfo={
        <IndicatorInfoTip description={description} formula={formula} derivedSources={derivedSources} />
      }
      latest={latest}
      {...rest}
    />
  )
})
