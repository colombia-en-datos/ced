'use client'

import { KpiSummaryCard } from '@/components/kpi-summary-card'
import { KIDNAPPINGS_MANIFEST } from '@/features/seguridad/hooks/use-kidnappings'
import { useKidnappingsByYear } from '@/features/seguridad/hooks/use-kidnappings-by-year'

export function KpiSummaryStrip() {
  const { latest, previous, delta, isLoading } = useKidnappingsByYear()

  const periodLabel =
    latest && previous ? `${previous.year} vs ${latest.year}` : undefined

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <KpiSummaryCard
        label={latest ? `Secuestros año ${latest.year}` : 'Secuestros por año'}
        value={latest?.total ?? null}
        delta={delta}
        periodLabel={periodLabel}
        positiveDirection={KIDNAPPINGS_MANIFEST.positiveDirection}
        source={KIDNAPPINGS_MANIFEST.source}
        sourceUrl={KIDNAPPINGS_MANIFEST.sourceUrl}
        isLoading={isLoading}
      />
      <KpiSummaryCard
        label="Homicidios por año"
        value={null}
        delta={null}
        positiveDirection="down"
        source="Policía Nacional"
        sourceUrl="https://www.datos.gov.co"
      />
      <KpiSummaryCard
        label="Extorsión por año"
        value={null}
        delta={null}
        positiveDirection="down"
        source="Fiscalía General"
        sourceUrl="https://www.datos.gov.co"
      />
      <KpiSummaryCard
        label="Desplazamiento forzado"
        value={null}
        delta={null}
        positiveDirection="down"
        source="Unidad de Víctimas"
        sourceUrl="https://www.datos.gov.co"
      />
    </div>
  )
}
