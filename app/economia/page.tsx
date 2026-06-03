'use client'

import { useState } from 'react'
import { CategoryTabs } from '@/components/category-tabs'
import { SectorHeader } from '@/components/sector-header'
import { ECONOMY_CATEGORIES } from '@/data/economy'
import { useEconomyIndicators } from '@/features/economia/hooks/use-economy-indicators'
import { KpiSummaryStrip } from '@/features/seguridad/components/kpi-summary-strip'
import { useCategoryTabs } from '@/hooks/use-category-tabs'
import { useEventsByYear } from '@/hooks/use-events-by-year'

export default function EconomiaPage() {
  const [activeTab, setActiveTab] = useState(ECONOMY_CATEGORIES[0]?.id ?? '')
  const { allIndicators, categories } = useEconomyIndicators(activeTab)
  const { handleIndicatorClick } = useCategoryTabs(setActiveTab, categories)
  const eventsByYear = useEventsByYear()

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectorHeader
        title="Economía"
        subtitle="Indicadores económicos de Colombia con fuentes oficiales verificadas."
        hasRateToggle
      />
      <KpiSummaryStrip indicators={allIndicators} onIndicatorClick={handleIndicatorClick} />

      <div className="flex flex-col gap-1 px-4 lg:px-6">
        <h2 className="text-lg font-semibold tracking-tight">Indicadores anuales</h2>
        <p className="text-sm text-muted-foreground">
          Series históricas de indicadores económicos a nivel nacional. Cada gráfica incluye marcadores de
          eventos de política pública relevantes.
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
