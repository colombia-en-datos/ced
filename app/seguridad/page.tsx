'use client'

import { SectorHeader } from '@/components/sector-header'
import { KidnappingsChart } from '@/features/seguridad/components/kidnappings-chart'
import { KpiSummaryStrip } from '@/features/seguridad/components/kpi-summary-strip'
import { useKidnappings } from '@/features/seguridad/hooks/use-kidnappings'

export default function SeguridadPage() {
  const { dataUpdatedAt } = useKidnappings()

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectorHeader title="Seguridad Nacional" dataUpdatedAt={dataUpdatedAt} />
      <KpiSummaryStrip />
      <div className="px-4 lg:px-6">
        <KidnappingsChart />
      </div>
    </div>
  )
}
