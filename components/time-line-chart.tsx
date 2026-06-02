'use client'

import { useId } from 'react'
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from 'recharts'
import { InfoTip } from '@/components/info-tip'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import type { Event } from '@/data/events'
import { formatNumber } from '@/utils/format'

type DataPoint = Record<string, unknown> & { isPartial?: boolean }

type TimeLineChartProps = {
  data: DataPoint[]
  xKey: string
  yKey: string
  yLabel: string
  unit?: string
  color?: string
  eventsByYear?: Map<number, Event[]>
  decimals?: number
}

function DashedLineEnd({
  gradientId,
  dataPointCount,
  partialCount,
  yKey,
  strokeColor,
  strokeWidth,
}: {
  gradientId: string
  dataPointCount: number
  partialCount: number
  yKey: string
  strokeColor: string
  strokeWidth: number
}) {
  const solidRatio = ((dataPointCount - partialCount) / dataPointCount) * 100

  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0" x2="100%" y2="0">
          <stop offset="0%" stopColor={strokeColor} />
          <stop offset={`${solidRatio}%`} stopColor={strokeColor} />
          <stop offset={`${solidRatio}%`} stopColor="transparent" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <Line
        dataKey={yKey}
        type="monotone"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray="5 5"
        dot={false}
        tooltipType="none"
      />
      <Line
        dataKey={yKey}
        type="monotone"
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        dot={false}
      />
    </>
  )
}

export function TimeLineChart({
  data,
  xKey,
  yKey,
  yLabel,
  unit,
  color = 'var(--chart-1)',
  eventsByYear,
  decimals = 0,
}: TimeLineChartProps) {
  const instanceId = useId()
  const gradientId = `solid-mask-${instanceId.replaceAll(':', '')}`

  const chartConfig = {
    [yKey]: {
      label: yLabel,
      color,
    },
  } satisfies ChartConfig

  const partialCount = data.filter((d) => d.isPartial).length
  const hasPartial = partialCount > 0

  return (
    <ChartContainer config={chartConfig}>
      <LineChart accessibilityLayer data={data} margin={{ left: 12, right: 12, top: 20 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis hide />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelClassName="text-xs font-light text-muted-foreground"
              labelFormatter={(_label, payload) => String(payload?.[0]?.payload?.[xKey] ?? _label)}
              formatter={(value) => (
                <span className="text-sm font-medium text-foreground">
                  {formatNumber(Number(value), decimals)} {unit}
                </span>
              )}
            />
          }
        />
        {eventsByYear
          ? Array.from(eventsByYear.entries()).map(([year, yearEvents]) => (
              <ReferenceLine
                key={year}
                x={year}
                stroke="var(--color-amber-400)"
                strokeDasharray="4 4"
                strokeOpacity={0.6}
                label={<EventMarker text={yearEvents.map((e) => e.id).join(',')} events={yearEvents} />}
              />
            ))
          : null}
        {hasPartial ? (
          <DashedLineEnd
            gradientId={gradientId}
            dataPointCount={data.length}
            partialCount={partialCount}
            yKey={yKey}
            strokeColor={`var(--color-${yKey})`}
            strokeWidth={2.5}
          />
        ) : (
          <Line
            dataKey={yKey}
            type="monotone"
            stroke={`var(--color-${yKey})`}
            strokeWidth={2.5}
            dot={false}
          />
        )}
      </LineChart>
    </ChartContainer>
  )
}

function EventMarker({
  text,
  events,
  viewBox,
}: {
  text: string
  events: Event[]
  viewBox?: { x?: number; y?: number }
}) {
  const x = viewBox?.x ?? 0
  const multi = events.length > 1
  const size = multi ? 20 : 16

  const tooltipContent = (
    <div className="flex flex-col gap-0.5">
      {events.map((e) => (
        <span key={e.label} className="whitespace-nowrap">
          <span className="font-semibold text-amber-400">{e.id}</span> {e.label} ({e.year})
        </span>
      ))}
    </div>
  )

  return (
    <foreignObject x={x - size / 2} y={8 - size / 2} width={size} height={size} className="overflow-visible">
      <InfoTip content={tooltipContent}>
        <div
          className="flex items-center justify-center rounded-full border border-amber-400/60 bg-amber-400/15 cursor-default"
          style={{ width: size, height: size }}
        >
          <span
            className="font-semibold text-amber-500 leading-none select-none"
            style={{ fontSize: multi ? 8 : 9 }}
          >
            {text}
          </span>
        </div>
      </InfoTip>
    </foreignObject>
  )
}
