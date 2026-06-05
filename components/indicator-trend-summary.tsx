import { TrendBadge } from '@/components/trend-badge'

type IndicatorTrendSummaryProps = {
  periodLabel: string
  value: string
  unit: string
  delta: number
  positiveDirection: 'up' | 'down'
  previousValue: string
  previousLabel: string
}

export function IndicatorTrendSummary({
  periodLabel,
  value,
  unit,
  delta,
  positiveDirection,
  previousValue,
  previousLabel,
}: IndicatorTrendSummaryProps) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-mono text-sm font-medium tabular-nums text-foreground">
        {periodLabel}: {value}{' '}
        <span className="font-sans text-xs font-normal text-muted-foreground">{unit}</span>
      </span>
      <TrendBadge delta={delta} positiveDirection={positiveDirection} />
      <span className="text-xs text-muted-foreground/60">
        vs <span className="font-mono tabular-nums">{previousValue}</span> en {previousLabel}
      </span>
    </div>
  )
}

type IndicatorRangeSummaryProps = {
  periodLabel: string
  delta: number
  positiveDirection: 'up' | 'down'
  fromValue: string
}

export function IndicatorRangeSummary({
  periodLabel,
  delta,
  positiveDirection,
  fromValue,
}: IndicatorRangeSummaryProps) {
  return (
    <div className="flex items-baseline gap-2 text-xs text-muted-foreground/60">
      <span className="font-mono tabular-nums">{periodLabel}</span>
      <TrendBadge delta={delta} positiveDirection={positiveDirection} className="text-[10px] px-1.5 py-0" />
      <span>
        desde <span className="font-mono tabular-nums">{fromValue}</span>
      </span>
    </div>
  )
}
