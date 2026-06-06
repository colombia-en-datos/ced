'use client'

import { useCallback, useId, useMemo, useRef, useState } from 'react'
import { CartesianGrid, Line, LineChart, ReferenceArea, ReferenceLine, XAxis, YAxis } from 'recharts'
import { EventMarker } from '@/components/event-marker'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import type { Event } from '@/data/events'
import { cn } from '@/lib/utils'
import { formatCompact, formatNumber } from '@/utils/format'

type DataPoint = Record<string, unknown> & { isPartial?: boolean; ts?: number; label?: string }

type TimeLineChartProps = {
  data: DataPoint[]
  yKey: string
  yLabel: string
  unit?: string
  color?: string
  eventsByYear?: Map<number, Event[]>
  decimals?: number
  positiveDirection?: 'up' | 'down'
}

type DragSelection = { startIdx: number; endIdx: number }

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
  yKey,
  yLabel,
  unit,
  color = 'var(--chart-1)',
  eventsByYear,
  decimals = 0,
  positiveDirection,
}: TimeLineChartProps) {
  const instanceId = useId()
  const gradientId = `solid-mask-${instanceId.replaceAll(':', '')}`

  // --- Drag-to-measure state ---
  const [selection, setSelection] = useState<DragSelection | null>(null)
  const dragStartRef = useRef<number | null>(null)

  const findIndex = useCallback(
    (label: unknown) => {
      if (label == null) return -1
      const ts = Number(label)
      return data.findIndex((d) => d.ts === ts)
    },
    [data]
  )

  const handleMouseDown = useCallback(
    (state: { activeLabel?: string | number }) => {
      const idx = findIndex(state?.activeLabel)
      if (idx >= 0) {
        dragStartRef.current = idx
        setSelection({ startIdx: idx, endIdx: idx })
      }
    },
    [findIndex]
  )

  const handleMouseMove = useCallback(
    (state: { activeLabel?: string | number }) => {
      if (dragStartRef.current == null) return
      const idx = findIndex(state?.activeLabel)
      if (idx >= 0) {
        setSelection({ startIdx: dragStartRef.current, endIdx: idx })
      }
    },
    [findIndex]
  )

  const handleMouseUp = useCallback(() => {
    dragStartRef.current = null
    setSelection((prev) => {
      if (!prev || prev.startIdx === prev.endIdx) return null
      return prev
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (dragStartRef.current != null) {
      dragStartRef.current = null
      setSelection(null)
    }
  }, [])

  const selectionRange = useMemo(() => {
    if (!selection) return null
    const { startIdx, endIdx } = selection
    if (startIdx === endIdx) return null
    const [fromIdx, toIdx] = startIdx <= endIdx ? [startIdx, endIdx] : [endIdx, startIdx]
    const startPoint = data[fromIdx]
    const endPoint = data[toIdx]
    if (!startPoint || !endPoint) return null

    const startVal = Number(startPoint[yKey])
    const endVal = Number(endPoint[yKey])
    if (Number.isNaN(startVal) || Number.isNaN(endVal)) return null

    const absoluteChange = endVal - startVal
    const percentChange = startVal !== 0 ? (absoluteChange / startVal) * 100 : 0

    return {
      x1: startPoint.ts as number,
      x2: endPoint.ts as number,
      startLabel: startPoint.label as string,
      endLabel: endPoint.label as string,
      absoluteChange,
      percentChange,
    }
  }, [selection, data, yKey])

  // --- Existing memos ---
  const labelByTs = useMemo(() => {
    const map = new Map<number, string>()
    for (const d of data) {
      if (d.ts != null && d.label != null) map.set(d.ts as number, d.label as string)
    }
    return map
  }, [data])

  const chartConfig = {
    [yKey]: {
      label: yLabel,
      color,
    },
  } satisfies ChartConfig

  const partialCount = data.filter((d) => d.isPartial).length
  const hasPartial = partialCount > 0

  return (
    <div className="relative select-none">
      {selectionRange && (
        <DragDeltaOverlay
          absoluteChange={selectionRange.absoluteChange}
          percentChange={selectionRange.percentChange}
          startLabel={selectionRange.startLabel}
          endLabel={selectionRange.endLabel}
          unit={unit}
          decimals={decimals}
          positiveDirection={positiveDirection}
        />
      )}
      <ChartContainer config={chartConfig}>
        <LineChart
          accessibilityLayer
          data={data}
          margin={{ left: 12, right: 12, top: 20 }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <CartesianGrid vertical={false} />
          {selectionRange && (
            <ReferenceArea
              x1={selectionRange.x1}
              x2={selectionRange.x2}
              fill={`var(--color-${yKey})`}
              fillOpacity={0.08}
              stroke="none"
            />
          )}
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
            content={
              <ChartTooltipContent
                labelClassName="text-xs font-light text-muted-foreground"
                labelFormatter={(_label, payload) => String(payload?.[0]?.payload?.label ?? _label)}
                formatter={(value) => (
                  <span className="text-sm font-medium text-foreground">
                    {formatNumber(Number(value), decimals)} {unit}
                  </span>
                )}
              />
            }
          />
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
    </div>
  )
}

function DragDeltaOverlay({
  absoluteChange,
  percentChange,
  startLabel,
  endLabel,
  unit,
  decimals,
  positiveDirection,
}: {
  absoluteChange: number
  percentChange: number
  startLabel: string
  endLabel: string
  unit?: string
  decimals: number
  positiveDirection?: 'up' | 'down'
}) {
  const isUp = absoluteChange > 0
  const isDown = absoluteChange < 0
  const isGood = positiveDirection === 'down' ? isDown : positiveDirection === 'up' ? isUp : null
  const colorClass =
    isGood === true
      ? 'text-emerald-600 dark:text-emerald-400'
      : isGood === false
        ? 'text-red-600 dark:text-red-400'
        : 'text-muted-foreground'

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center">
      <div className="flex items-center gap-1.5 rounded-md border bg-background/90 px-2.5 py-1 text-sm shadow-sm backdrop-blur-sm">
        <span className={cn('font-semibold tabular-nums', colorClass)}>
          {isUp ? '+' : ''}
          {formatNumber(absoluteChange, decimals)}
          {unit ? ` ${unit}` : ''}
        </span>
        <span className={cn('tabular-nums', colorClass)}>({formatNumber(Math.abs(percentChange), 2)}%)</span>
        <span className={colorClass}>{isUp ? '↑' : isDown ? '↓' : ''}</span>
        <span className="text-xs text-muted-foreground">
          {startLabel} – {endLabel}
        </span>
      </div>
    </div>
  )
}
