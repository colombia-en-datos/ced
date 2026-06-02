'use client'

import { IndicatorAnnualChart } from '@/components/indicator-annual-chart'
import { usePopulationByYear } from '@/hooks/use-population-by-year'

export default function Page() {
  const population = usePopulationByYear()

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <p className="text-muted-foreground">Indicadores oficiales, fuentes verificadas.</p>
      </div>
      <div className="px-4 lg:px-6">
        <IndicatorAnnualChart {...population} />
      </div>
    </div>
  )
}
