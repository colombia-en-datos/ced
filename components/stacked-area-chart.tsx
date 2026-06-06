'use client'

import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from 'recharts'
import { EventMarker } from '@/components/event-marker'
import type { SeriesConfig } from '@/components/multi-line-chart'
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import type { Event } from '@/data/events'
import { formatNumber } from '@/utils/format'

type DataPoint = Record<string, unknown> & { ts?: number; label?: string }

type StackedAreaChartProps = {
  data: DataPoint[]
  series: SeriesConfig[]
  unit?: string
  eventsByYear?: Map<number, Event[]>
  decimals?: number
}

export function StackedAreaChart({ data, series, unit, eventsByYear, decimals = 1 }: StackedAreaChartProps) {
  const chartConfig = Object.fromEntries(
    series.map((s) => [s.key, { label: s.label, color: s.color }])
  ) satisfies ChartConfig

  const labelByTs = useMemo(() => {
    const map = new Map<number, string>()
    for (const d of data) {
      if (d.ts != null && d.label != null) map.set(d.ts as number, d.label as string)
    }
    return map
  }, [data])

  return (
    <ChartContainer config={chartConfig}>
      <AreaChart accessibilityLayer data={data} margin={{ left: 12, right: 12, top: 20 }}>
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
          tickFormatter={(v: number) => formatNumber(v, 0)}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="dot"
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
        {series.map((s) => (
          <Area
            key={s.key}
            dataKey={s.key}
            type="monotone"
            fill={`var(--color-${s.key})`}
            fillOpacity={0.4}
            stroke={`var(--color-${s.key})`}
            stackId="a"
          />
        ))}
      </AreaChart>
    </ChartContainer>
  )
}
