'use client'

import { memo } from 'react'
import { DataUpdatedAt } from '@/components/data-updated-at'
import { SourceBadge } from '@/components/source-badge'
import { TrendBadge } from '@/components/trend-badge'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
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

const CARD_BASE = 'w-[288px] shrink-0 min-h-52'

export function KpiSummaryCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn(CARD_BASE, '@container/card', className)}>
      <CardHeader>
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-3 w-16" />
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3.5 w-36" />
      </CardFooter>
    </Card>
  )
}

export const KpiSummaryCard = memo(function KpiSummaryCard({
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
  if (isLoading) return <KpiSummaryCardSkeleton className={className} />

  const displayLabel = latest ? `${label} año ${latest.year}` : label

  const periodLabel = latest && previous ? `${previous.label} vs ${latest.label}` : undefined

  return (
    <Card
      className={cn(
        CARD_BASE,
        '@container/card flex flex-col cursor-pointer transition-all hover:ring-4 hover:ring-border',
        className
      )}
      onClick={onClick}
    >
      <CardHeader>
        <CardDescription>{displayLabel}</CardDescription>
        <CardTitle className="flex items-baseline gap-1.5 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {displayValue ?? '\u2014'}
          {displayUnit ? (
            <span className="text-sm font-normal text-muted-foreground">{displayUnit}</span>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardFooter className="mt-auto flex-col items-start gap-1.5 text-sm">
        {periodLabel ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>{periodLabel}</span>
            {delta != null && positiveDirection != null && (
              <TrendBadge delta={delta} positiveDirection={positiveDirection} />
            )}
          </div>
        ) : null}
        <div className="text-muted-foreground">
          Fuente: <SourceBadge source={source} sourceUrl={sourceUrl} variant="inline" />
        </div>
        {dataUpdatedAt ? <DataUpdatedAt timestamp={dataUpdatedAt} /> : null}
      </CardFooter>
    </Card>
  )
})
