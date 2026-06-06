'use client'

import { useState } from 'react'
import { CategoryTabs } from '@/components/category-tabs'
import { KpiSummaryStrip } from '@/components/kpi-summary-strip'
import { SectorHeader } from '@/components/sector-header'
import { RELACIONES_CATEGORIES } from '@/data/international-relations'
import { useRelacionesIndicators } from '@/features/relaciones/hooks/use-relaciones-indicators'
import { useCategoryTabs } from '@/hooks/use-category-tabs'
import { useEventsByYear } from '@/hooks/use-events-by-year'

export default function RelacionesPage() {
  const [activeTab, setActiveTab] = useState(RELACIONES_CATEGORIES[0].id)
  const { allIndicators, categories } = useRelacionesIndicators(activeTab)
  const { handleIndicatorClick } = useCategoryTabs(setActiveTab, categories)
  const eventsByYear = useEventsByYear()

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectorHeader
        title="Relaciones Internacionales"
        subtitle="Visas, tratados, diáspora colombiana y protección consular con fuentes oficiales del Ministerio de Relaciones Exteriores."
      />
      <KpiSummaryStrip indicators={allIndicators} onIndicatorClick={handleIndicatorClick} />

      <div className="flex flex-col gap-1 px-4 lg:px-6">
        <h2 className="text-lg font-semibold tracking-tight">Indicadores internacionales</h2>
        <p className="text-sm text-muted-foreground">
          Gestión migratoria, actividad diplomática y protección de colombianos en el exterior. Cada gráfica
          incluye la fuente oficial verificable.
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
