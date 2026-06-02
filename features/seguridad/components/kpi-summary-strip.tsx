'use client'

import { KpiSummaryCard } from '@/components/kpi-summary-card'
import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import { Marquee } from '@/components/ui/marquee'
import { Skeleton } from '@/components/ui/skeleton'
import type { IndicatorByYearResult } from '@/hooks/use-indicator-by-year'

type KpiSummaryStripProps = {
  indicators: IndicatorByYearResult[]
  onIndicatorClick?: (indicatorId: string) => void
}

const MIN_LOADED = 4

function KpiSummaryCardSkeleton() {
  return (
    <Card className="w-72 shrink-0 @container/card">
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

export function KpiSummaryStrip({
  indicators,
  onIndicatorClick,
}: KpiSummaryStripProps) {
  const loadedCount = indicators.filter((i) => !i.isLoading).length

  if (loadedCount < MIN_LOADED) {
    return (
      <div className="flex gap-4 overflow-hidden px-4 lg:px-6 *:data-[slot=card]:shadow-xs">
        <KpiSummaryCardSkeleton key="s1" />
        <KpiSummaryCardSkeleton key="s2" />
        <KpiSummaryCardSkeleton key="s3" />
        <KpiSummaryCardSkeleton key="s4" />
      </div>
    )
  }

  return (
    <Marquee
      pauseOnHover
      className="[--duration:90s] [--gap:1rem] *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card"
    >
      {indicators.map((indicator) => (
        <KpiSummaryCard
          key={indicator.label}
          className="w-72 shrink-0"
          {...indicator}
          onClick={
            onIndicatorClick ? () => onIndicatorClick(indicator.id) : undefined
          }
        />
      ))}
    </Marquee>
  )
}
