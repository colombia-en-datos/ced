'use client'

import { useState } from 'react'
import { CategoryTabs } from '@/components/category-tabs'
import { KpiSummaryStrip } from '@/components/kpi-summary-strip'
import { SectorHeader } from '@/components/sector-header'
import { SOCIAL_CATEGORIES } from '@/data/social'
import { useSocialIndicators } from '@/features/social/hooks/use-social-indicators'
import { useCategoryTabs } from '@/hooks/use-category-tabs'
import { useEventsByYear } from '@/hooks/use-events-by-year'

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState(SOCIAL_CATEGORIES[0].id)
  const { allIndicators, categories } = useSocialIndicators(activeTab)
  const { handleIndicatorClick } = useCategoryTabs(setActiveTab, categories)
  const eventsByYear = useEventsByYear()

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectorHeader
        title="Inclusión Social"
        subtitle="Programas sociales, protección infantil e indicadores de desigualdad con fuentes oficiales verificadas."
      />
      <KpiSummaryStrip indicators={allIndicators} onIndicatorClick={handleIndicatorClick} />

      <div className="flex flex-col gap-1 px-4 lg:px-6">
        <h2 className="text-lg font-semibold tracking-tight">Indicadores sociales</h2>
        <p className="text-sm text-muted-foreground">
          Cobertura de programas sociales, protección de la niñez y tendencias de pobreza y desigualdad. Cada
          gráfica incluye la fuente oficial verificable.
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
