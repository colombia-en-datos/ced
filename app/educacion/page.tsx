'use client'

import { useState } from 'react'
import { CategoryTabs } from '@/components/category-tabs'
import { KpiSummaryStrip } from '@/components/kpi-summary-strip'
import { SectorHeader } from '@/components/sector-header'
import { EDUCATION_CATEGORIES } from '@/data/education'
import { useEducationIndicators } from '@/features/educacion/hooks/use-education-indicators'
import { useCategoryTabs } from '@/hooks/use-category-tabs'
import { useEventsByYear } from '@/hooks/use-events-by-year'

export default function EducacionPage() {
  const [activeTab, setActiveTab] = useState(EDUCATION_CATEGORIES[0]?.id ?? '')
  const { allIndicators, categories } = useEducationIndicators(activeTab)
  const { handleIndicatorClick } = useCategoryTabs(setActiveTab, categories)
  const eventsByYear = useEventsByYear()

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectorHeader
        title="Educación"
        subtitle="Indicadores de educación con fuentes oficiales verificadas."
      />
      <KpiSummaryStrip indicators={allIndicators} onIndicatorClick={handleIndicatorClick} />

      <div className="flex flex-col gap-1 px-4 lg:px-6">
        <h2 className="text-lg font-semibold tracking-tight">Indicadores educativos</h2>
        <p className="text-sm text-muted-foreground">
          Series históricas de indicadores educativos a nivel nacional.
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
