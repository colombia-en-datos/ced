'use client'

import { useState } from 'react'
import { CategoryTabs } from '@/components/category-tabs'
import { KpiSummaryStrip } from '@/components/kpi-summary-strip'
import { SectorHeader } from '@/components/sector-header'
import { SECURITY_CATEGORIES } from '@/data/security'
import { useAnnualSecurityIndicators } from '@/features/seguridad/hooks/use-annual-security-indicators'
import { useCategoryTabs } from '@/hooks/use-category-tabs'
import { useEventsByYear } from '@/hooks/use-events-by-year'

export default function SeguridadPage() {
  const [activeTab, setActiveTab] = useState(SECURITY_CATEGORIES[0].id)
  const { allIndicators, categories } = useAnnualSecurityIndicators(activeTab)
  const { handleIndicatorClick } = useCategoryTabs(setActiveTab, categories)
  const eventsByYear = useEventsByYear()

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectorHeader
        title="Seguridad Nacional"
        subtitle="Indicadores de seguridad y convivencia ciudadana con fuentes oficiales verificadas."
      />
      <KpiSummaryStrip indicators={allIndicators} onIndicatorClick={handleIndicatorClick} />

      <div className="flex flex-col gap-1 px-4 lg:px-6">
        <h2 className="text-lg font-semibold tracking-tight">Indicadores anuales</h2>
        <p className="text-sm text-muted-foreground">
          Series históricas de delitos reportados a nivel nacional. Cada gráfica incluye marcadores de eventos
          de política pública relevantes.
        </p>
      </div>

      <CategoryTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        categories={categories}
        eventsByYear={eventsByYear}
      />
    </div>
  )
}
