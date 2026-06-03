'use client'

import { KpiSummaryCard, KpiSummaryCardSkeleton } from '@/components/kpi-summary-card'
import { Marquee } from '@/components/ui/marquee'
import type { IndicatorResult } from '@/hooks/use-indicator-by-year'

type KpiSummaryStripProps = {
  indicators: IndicatorResult[]
  onIndicatorClick?: (indicatorId: string) => void
}

const MIN_LOADED = 4

export function KpiSummaryStrip({ indicators, onIndicatorClick }: KpiSummaryStripProps) {
  const loadedCount = indicators.filter((i) => !i.isLoading).length

  if (loadedCount < MIN_LOADED) {
    return (
      <div className="flex items-center gap-4 overflow-hidden px-4 lg:px-6 *:data-[slot=card]:shadow-xs">
        <KpiSummaryCardSkeleton />
        <KpiSummaryCardSkeleton />
        <KpiSummaryCardSkeleton />
        <KpiSummaryCardSkeleton />
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
          key={indicator.id}
          {...indicator}
          onClick={onIndicatorClick ? () => onIndicatorClick(indicator.id) : undefined}
        />
      ))}
    </Marquee>
  )
}
