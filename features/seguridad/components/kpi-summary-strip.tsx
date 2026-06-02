'use client'

import { KpiSummaryCard } from '@/components/kpi-summary-card'
import { HOMICIDES_MANIFEST, KIDNAPPINGS_MANIFEST } from '@/data/security'
import { useHomicidesByYear } from '@/features/seguridad/hooks/use-homicides'
import { useKidnappingsByYear } from '@/features/seguridad/hooks/use-kidnappings'

export function KpiSummaryStrip() {
  const kidnappings = useKidnappingsByYear()
  const homicides = useHomicidesByYear()

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <KpiSummaryCard manifest={KIDNAPPINGS_MANIFEST} {...kidnappings} />
      <KpiSummaryCard manifest={HOMICIDES_MANIFEST} {...homicides} />
    </div>
  )
}
