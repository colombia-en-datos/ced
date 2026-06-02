'use client'

import { IndicatorAnnualChart } from '@/components/indicator-annual-chart'
import { SectorHeader } from '@/components/sector-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KpiSummaryStrip } from '@/features/seguridad/components/kpi-summary-strip'
import { useAnnualSecurityIndicators } from '@/features/seguridad/hooks/use-annual-security-indicators'

export default function SeguridadPage() {
  const { heroIndicators, categories } = useAnnualSecurityIndicators()

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectorHeader
        title="Seguridad Nacional"
        subtitle="Indicadores de seguridad y convivencia ciudadana con fuentes oficiales verificadas."
        hasRateToggle
      />
      <KpiSummaryStrip indicators={heroIndicators} />

      <div className="flex flex-col gap-1 px-4 lg:px-6">
        <h2 className="text-lg font-semibold tracking-tight">
          Indicadores anuales
        </h2>
        <p className="text-sm text-muted-foreground">
          Series históricas de delitos reportados a nivel nacional. Cada gráfica
          incluye marcadores de eventos de política pública relevantes.
        </p>
      </div>

      <Tabs defaultValue={categories[0]?.id} className="px-4 lg:px-6">
        <TabsList
          variant="line"
          className="w-full justify-start overflow-x-auto"
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
              {cat.data.map((indicator) => (
                <IndicatorAnnualChart key={indicator.label} {...indicator} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
