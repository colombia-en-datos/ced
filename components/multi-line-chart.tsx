'use client'

import { useId, useMemo } from 'react'
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from 'recharts'
import { EventMarker } from '@/components/event-marker'
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import type { Event } from '@/data/events'
import { formatCompact, formatNumber } from '@/utils/format'

type DataPoint = Record<string, unknown> & { ts?: number; label?: string; isPartial?: boolean }

export type SeriesConfig = {
  key: string
  label: string
  color: string
}

type MultiLineChartProps = {
  data: DataPoint[]
  series: SeriesConfig[]
  unit?: string
  eventsByYear?: Map<number, Event[]>
  decimals?: number
}

export function MultiLineChart({ data, series, unit, eventsByYear, decimals = 1 }: MultiLineChartProps) {
  const instanceId = useId()
  const gradientPrefix = `ml-mask-${instanceId.replaceAll(':', '')}`

  const partialCount = data.filter((d) => d.isPartial).length
  const hasPartial = partialCount > 0
  const solidRatio = hasPartial ? ((data.length - partialCount) / data.length) * 100 : 100

  const labelByTs = useMemo(() => {
    const map = new Map<number, string>()
    for (const d of data) {
      if (d.ts != null && d.label != null) map.set(d.ts as number, d.label as string)
    }
    return map
  }, [data])

  const chartConfig = Object.fromEntries(
    series.map((s) => [s.key, { label: s.label, color: s.color }])
  ) satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig}>
      <LineChart accessibilityLayer data={data} margin={{ left: 12, right: 12, top: 20 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="ts"
          type="number"
          scale="time"
          domain={['dataMin', 'dataMax']}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(ts: number) => labelByTs.get(ts) ?? ''}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          width={40}
          domain={['auto', 'auto']}
          tickFormatter={formatCompact}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelClassName="text-xs font-light text-muted-foreground"
              labelFormatter={(_label, payload) => String(payload?.[0]?.payload?.label ?? _label)}
              formatter={(value, name) => (
                <>
                  <div
                    className="h-2.5 w-2.5 shrink-0 rounded-xs"
                    style={{ backgroundColor: `var(--color-${name})` }}
                  />
                  <div className="flex flex-1 items-center justify-between gap-4 leading-none">
                    <span className="text-muted-foreground">
                      {chartConfig[name as string]?.label ?? name}
                    </span>
                    <span className="font-mono font-medium tabular-nums text-foreground">
                      {formatNumber(Number(value), decimals)}
                      {unit ? ` ${unit}` : ''}
                    </span>
                  </div>
                </>
              )}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent className="flex-wrap" />} />
        {eventsByYear
          ? Array.from(eventsByYear.entries()).flatMap(([year, yearEvents]) => {
              const eventTs = yearEvents[0].date.getTime()
              return (
                <ReferenceLine
                  key={year}
                  x={eventTs}
                  stroke="var(--color-amber-400)"
                  strokeDasharray="4 4"
                  strokeOpacity={0.6}
                  label={<EventMarker text={yearEvents.map((e) => e.id).join(',')} events={yearEvents} />}
                />
              )
            })
          : null}
        {hasPartial && (
          <defs>
            {series.map((s) => (
              <linearGradient key={s.key} id={`${gradientPrefix}-${s.key}`} x1="0%" y1="0" x2="100%" y2="0">
                <stop offset="0%" stopColor={s.color} />
                <stop offset={`${solidRatio}%`} stopColor={s.color} />
                <stop offset={`${solidRatio}%`} stopColor="transparent" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            ))}
          </defs>
        )}
        {hasPartial
          ? series.flatMap((s) => [
              <Line
                key={`${s.key}-dash`}
                dataKey={s.key}
                type="monotone"
                stroke={`var(--color-${s.key})`}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                tooltipType="none"
              />,
              <Line
                key={s.key}
                dataKey={s.key}
                type="monotone"
                stroke={`url(#${gradientPrefix}-${s.key})`}
                strokeWidth={2}
                dot={false}
                legendType="none"
              />,
            ])
          : series.map((s) => (
              <Line
                key={s.key}
                dataKey={s.key}
                type="monotone"
                stroke={`var(--color-${s.key})`}
                strokeWidth={2}
                dot={false}
              />
            ))}
      </LineChart>
    </ChartContainer>
  )
}
