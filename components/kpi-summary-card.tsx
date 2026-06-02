'use client'

import { SourceBadge } from '@/components/source-badge'
import { TrendBadge } from '@/components/trend-badge'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { YearPoint } from '@/hooks/use-indicator-by-year'
import { formatRelativeTime } from '@/utils/format'

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
}: KpiSummaryCardProps) {
  if (isLoading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            <Skeleton className="h-4 w-32" />
          </CardDescription>
          <CardTitle>
            <Skeleton className="h-8 w-24" />
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <Skeleton className="h-5 w-28" />
        </CardFooter>
      </Card>
    )
  }

  const displayLabel = latest ? `${label} año ${latest.year}` : label

  const periodLabel =
    latest && previous ? `${previous.year} vs ${latest.year}` : undefined

  return (
    <Card className="@container/card">
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
        {dataUpdatedAt ? (
          <span className="text-xs text-muted-foreground">
            Actualizado {formatRelativeTime(dataUpdatedAt)}
          </span>
        ) : null}
      </CardFooter>
    </Card>
  )
}
