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
} from '@/components/ui/chart'
import type { Event } from '@/data/events'
import { formatCompact, formatNumber } from '@/utils/format'

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
          tickFormatter={formatCompact}
        />
        <ChartTooltip
          cursor={false}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const label = String(payload[0]?.payload?.label ?? '')
            const total = series.reduce((sum, s) => sum + Number(payload[0]?.payload?.[s.key] ?? 0), 0)
            return (
              <div className="rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                <div className="mb-1.5 text-xs font-light text-muted-foreground">{label}</div>
                <div className="grid gap-1.5">
                  {series.map((s) => (
                    <div key={s.key} className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 shrink-0 rounded-xs" style={{ backgroundColor: s.color }} />
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className="ml-auto font-mono font-medium tabular-nums text-foreground">
                        {formatNumber(Number(payload[0]?.payload?.[s.key] ?? 0), decimals)}
                        {unit ? ` ${unit}` : ''}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center border-t pt-1.5 text-xs font-medium text-foreground">
                    Total
                    <span className="ml-auto font-mono font-medium tabular-nums">
                      {formatNumber(total, decimals)}
                      {unit ? ` ${unit}` : ''}
                    </span>
                  </div>
                </div>
              </div>
            )
          }}
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
