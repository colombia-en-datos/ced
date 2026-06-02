'use client'

import { KpiSummaryCard } from '@/components/kpi-summary-card'
import { useAnnualSecurityIndicators } from '../hooks/use-annual-security-indicators'

export function KpiSummaryStrip() {
  const indicators = useAnnualSecurityIndicators()

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {indicators.map((indicator) => (
        <KpiSummaryCard key={indicator.label} {...indicator} />
      ))}
    </div>
  )
}
