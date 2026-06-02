'use client'

import { IndicatorAnnualChart } from '@/components/indicator-annual-chart'
import { SectorHeader } from '@/components/sector-header'
import { HOMICIDES_MANIFEST, KIDNAPPINGS_MANIFEST } from '@/data/security'
import { KpiSummaryStrip } from '@/features/seguridad/components/kpi-summary-strip'
import { useHomicidesByYear } from '@/features/seguridad/hooks/use-homicides'
import {
  useKidnappings,
  useKidnappingsByYear,
} from '@/features/seguridad/hooks/use-kidnappings'

export default function SeguridadPage() {
  const { dataUpdatedAt } = useKidnappings()
  const kidnappings = useKidnappingsByYear()
  const homicides = useHomicidesByYear()

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectorHeader title="Seguridad Nacional" dataUpdatedAt={dataUpdatedAt} />
      <KpiSummaryStrip />
      <div className="px-4 lg:px-6">
        <IndicatorAnnualChart
          manifest={KIDNAPPINGS_MANIFEST}
          {...kidnappings}
        />
        <IndicatorAnnualChart manifest={HOMICIDES_MANIFEST} {...homicides} />
      </div>
    </div>
  )
}
