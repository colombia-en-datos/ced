'use client'

import { useId } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

type PolicyEvent = {
  year: number
  label: string
}

type DataPoint = Record<string, unknown> & { isPartial?: boolean }

type TimeLineChartProps = {
  data: DataPoint[]
  xKey: string
  yKey: string
  yLabel: string
  color?: string
  policyEvents?: PolicyEvent[]
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
  color = 'var(--chart-1)',
  policyEvents,
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
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ left: 12, right: 12, top: 20 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        {policyEvents?.map((event) => (
          <ReferenceLine
            key={event.year}
            x={event.year}
            stroke="var(--color-amber-500)"
            strokeDasharray="4 4"
            label={{
              value: `${event.label} (${event.year})`,
              position: 'top',
              fontSize: 11,
              fill: 'var(--color-amber-500)',
            }}
          />
        ))}
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
