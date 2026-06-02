'use client'

import { useCallback, useMemo, useState } from 'react'
import { IndicatorAnnualChart } from '@/components/indicator-annual-chart'
import { SectorHeader } from '@/components/sector-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EVENTS, type Event } from '@/data/events'
import { SECURITY_CATEGORIES } from '@/data/security'
import { KpiSummaryStrip } from '@/features/seguridad/components/kpi-summary-strip'
import { useAnnualSecurityIndicators } from '@/features/seguridad/hooks/use-annual-security-indicators'
import { useAnalysisSettings } from '@/hooks/use-analysis-settings'

/** Group events by year for chart markers. Call once and share across charts. */
function groupEventsByYear(events: Event[]) {
  const byYear = new Map<number, Event[]>()
  for (const e of events) {
    const list = byYear.get(e.year) ?? []
    list.push(e)
    byYear.set(e.year, list)
  }
  return byYear
}

export default function SeguridadPage() {
  const settings = useAnalysisSettings()
  const [activeTab, setActiveTab] = useState(SECURITY_CATEGORIES[0].id)
  const { allIndicators, categories } = useAnnualSecurityIndicators(activeTab)

  const eventsByYear = useMemo(
    () =>
      groupEventsByYear(
        EVENTS.filter((e) => settings.enabledEvents.has(e.label))
      ),
    [settings.enabledEvents]
  )

  const indicatorToCategory = useMemo(() => {
    const map: Record<string, string> = {}
    for (const cat of categories) {
      for (const ind of cat.data) {
        map[ind.id] = cat.id
      }
    }
    return map
  }, [categories])

  const handleIndicatorClick = useCallback(
    (indicatorId: string) => {
      const categoryId = indicatorToCategory[indicatorId]
      if (categoryId) {
        setActiveTab(categoryId)
        // Wait for the tab content to render before scrolling
        requestAnimationFrame(() => {
          const el = document.getElementById(`chart-${indicatorId}`)
          if (!el) return
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el.classList.remove('animate-ring-pulse')
          // Force reflow so re-adding the class restarts the animation
          void el.offsetWidth
          el.classList.add('animate-ring-pulse')
          el.addEventListener(
            'animationend',
            () => el.classList.remove('animate-ring-pulse'),
            { once: true }
          )
        })
      }
    },
    [indicatorToCategory]
  )

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectorHeader
        title="Seguridad Nacional"
        subtitle="Indicadores de seguridad y convivencia ciudadana con fuentes oficiales verificadas."
        hasRateToggle
      />
      <KpiSummaryStrip
        indicators={allIndicators}
        onIndicatorClick={handleIndicatorClick}
      />

      <div className="flex flex-col gap-1 px-4 lg:px-6">
        <h2 className="text-lg font-semibold tracking-tight">
          Indicadores anuales
        </h2>
        <p className="text-sm text-muted-foreground">
          Series históricas de delitos reportados a nivel nacional. Cada gráfica
          incluye marcadores de eventos de política pública relevantes.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="px-4 lg:px-6"
      >
        <TabsList
          variant="line"
          className="w-full justify-start overflow-x-auto scrollbar-none"
        >
          {categories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat.id} value={cat.id}>
            <p className="mt-2 mb-4 text-sm text-muted-foreground">
              {cat.description}
            </p>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {cat.data.map(({ id: indicatorId, events: _, ...rest }) => (
                <IndicatorAnnualChart
                  key={rest.label}
                  id={`chart-${indicatorId}`}
                  eventsByYear={eventsByYear}
                  {...rest}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
