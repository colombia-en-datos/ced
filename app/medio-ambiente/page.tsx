'use client'

import { useState } from 'react'
import { CategoryTabs } from '@/components/category-tabs'
import { KpiSummaryStrip } from '@/components/kpi-summary-strip'
import { SectorHeader } from '@/components/sector-header'
import { ENVIRONMENT_CATEGORIES } from '@/data/environment'
import { useEnvironmentIndicators } from '@/features/medio-ambiente/hooks/use-environment-indicators'
import { useCategoryTabs } from '@/hooks/use-category-tabs'
import { useEventsByYear } from '@/hooks/use-events-by-year'

export default function MedioAmbientePage() {
  const [activeTab, setActiveTab] = useState(ENVIRONMENT_CATEGORIES[0].id)
  const { allIndicators, categories } = useEnvironmentIndicators(activeTab)
  const { handleIndicatorClick } = useCategoryTabs(setActiveTab, categories)
  const eventsByYear = useEventsByYear()

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectorHeader
        title="Medio Ambiente"
        subtitle="Indicadores ambientales y de desarrollo sostenible con fuentes oficiales verificadas."
      />
      <KpiSummaryStrip indicators={allIndicators} onIndicatorClick={handleIndicatorClick} />

      <div className="flex flex-col gap-1 px-4 lg:px-6">
        <h2 className="text-lg font-semibold tracking-tight">Indicadores ambientales</h2>
        <p className="text-sm text-muted-foreground">
          Series históricas de emisiones, calidad del aire, cobertura forestal y protección ambiental.
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
