'use client'

import { DataUpdatedAt } from '@/components/data-updated-at'
import { SourceBadge } from '@/components/source-badge'
import { TrendBadge } from '@/components/trend-badge'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { YearPoint } from '@/hooks/use-indicator-by-year'
import { cn } from '@/lib/utils'

type KpiSummaryCardProps = {
  label: string
  source: string
  sourceUrl: string
  positiveDirection?: 'up' | 'down'
  latest?: YearPoint | null
  previous?: YearPoint | null
  delta?: number | null
  displayUnit?: string
  displayValue?: string | null
  dataUpdatedAt?: number
  isLoading?: boolean
  onClick?: () => void
  className?: string
}

export function KpiSummaryCard({
  label,
  source,
  sourceUrl,
  positiveDirection,
  latest,
  previous,
  delta,
  displayUnit,
  displayValue,
  dataUpdatedAt,
  isLoading,
  onClick,
  className,
}: KpiSummaryCardProps) {
  if (isLoading) return null

  const displayLabel = latest ? `${label} año ${latest.year}` : label

  const periodLabel =
    latest && previous ? `${previous.year} vs ${latest.year}` : undefined

  return (
    <Card
      className={cn(
        '@container/card cursor-pointer transition-all hover:ring-4 hover:ring-border',
        className
      )}
      onClick={onClick}
    >
      <CardHeader>
        <CardDescription>{displayLabel}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {displayValue ?? '\u2014'}
        </CardTitle>
        {displayUnit ? (
          <p className="text-xs text-muted-foreground">{displayUnit}</p>
        ) : null}
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        {periodLabel ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>{periodLabel}</span>
            {delta != null && positiveDirection != null && (
              <TrendBadge delta={delta} positiveDirection={positiveDirection} />
            )}
          </div>
        ) : null}
        <div className="text-muted-foreground">
          Fuente:{' '}
          <SourceBadge source={source} sourceUrl={sourceUrl} variant="inline" />
        </div>
        {dataUpdatedAt ? <DataUpdatedAt timestamp={dataUpdatedAt} /> : null}
      </CardFooter>
    </Card>
  )
}
