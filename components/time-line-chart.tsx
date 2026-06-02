"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type PolicyEvent = {
  year: number
  label: string
}

type TimeLineChartProps = {
  data: Record<string, unknown>[]
  xKey: string
  yKey: string
  yLabel: string
  color?: string
  policyEvents?: PolicyEvent[]
}

export function TimeLineChart({
  data,
  xKey,
  yKey,
  yLabel,
  color = "var(--chart-1)",
  policyEvents,
}: TimeLineChartProps) {
  const chartConfig = {
    [yKey]: {
      label: yLabel,
      color,
    },
  } satisfies ChartConfig

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
            stroke="var(--destructive)"
            strokeDasharray="4 4"
            label={{
              value: `${event.label} (${event.year})`,
              position: "top",
              fontSize: 11,
              fill: "var(--destructive)",
            }}
          />
        ))}
        <Line
          dataKey={yKey}
          type="monotone"
          stroke={`var(--color-${yKey})`}
          strokeWidth={2.5}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}
