'use client'

import { IndicatorAnnualChart } from '@/components/indicator-annual-chart'
import { SectorHeader } from '@/components/sector-header'
import { KpiSummaryStrip } from '@/features/seguridad/components/kpi-summary-strip'
import { useAnnualSecurityIndicators } from '@/features/seguridad/hooks/use-annual-security-indicators'

export default function SeguridadPage() {
  const indicators = useAnnualSecurityIndicators()

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectorHeader
        title="Seguridad Nacional"
        subtitle="Indicadores de seguridad y convivencia ciudadana con fuentes oficiales verificadas."
        hasRateToggle
      />
      <KpiSummaryStrip />
      <div className="flex flex-col gap-1 px-4 lg:px-6">
        <h2 className="text-lg font-semibold tracking-tight">
          Indicadores anuales
        </h2>
        <p className="text-sm text-muted-foreground">
          Series históricas de delitos reportados a nivel nacional. Cada gráfica
          incluye marcadores de eventos de política pública relevantes.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        {indicators.map((indicator) => (
          <IndicatorAnnualChart key={indicator.label} {...indicator} />
        ))}
      </div>
    </div>
  )
}
