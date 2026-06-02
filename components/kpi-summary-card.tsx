'use client'

import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react'
import { SourceBadge } from '@/components/source-badge'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { IndicatorManifest } from '@/data/types'
import type { YearPoint } from '@/hooks/use-indicator-by-year'
import { formatNumber } from '@/utils/format'

type KpiSummaryCardProps = {
  manifest: IndicatorManifest
  latest?: YearPoint | null
  previous?: YearPoint | null
  delta?: number | null
  isLoading?: boolean
}

export function KpiSummaryCard({
  manifest,
  latest,
  previous,
  delta,
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

  const label = latest
    ? `${manifest.label} año ${latest.year}`
    : `${manifest.label} por año`

  const periodLabel =
    latest && previous ? `${previous.year} vs ${latest.year}` : undefined

  const trendIsPositive =
    delta != null &&
    ((manifest.positiveDirection === 'down' && delta < 0) ||
      (manifest.positiveDirection === 'up' && delta > 0))

  const TrendIcon =
    delta != null && delta >= 0 ? IconTrendingUp : IconTrendingDown

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {latest ? formatNumber(latest.total) : '\u2014'}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        {periodLabel && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>{periodLabel}</span>
            {delta != null && (
              <Badge
                variant="outline"
                className={
                  trendIsPositive ? 'text-emerald-600' : 'text-red-600'
                }
              >
                <TrendIcon />
                {delta > 0 ? '+' : ''}
                {delta.toFixed(1)}%
              </Badge>
            )}
          </div>
        )}
        <div className="text-muted-foreground">
          Fuente:{' '}
          <SourceBadge
            source={manifest.source}
            sourceUrl={manifest.sourceUrl}
            variant="inline"
          />
        </div>
      </CardFooter>
    </Card>
  )
}
