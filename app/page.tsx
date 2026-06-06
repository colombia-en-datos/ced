'use client'

import Link from 'next/link'
// import { IndicatorChart } from '@/components/indicator-chart'
import { sectors } from '@/config/sectors'
// import { usePopulationByYear } from '@/hooks/use-population-by-year'

export default function Page() {
  // const population = usePopulationByYear()

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex flex-col gap-3 px-4 lg:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Colombia en Datos</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Plataforma de transparencia que consolida estadisticas oficiales del gobierno colombiano en{' '}
          {sectors.length} sectores. Cada cifra enlaza directamente a su fuente primaria. Cada grafica puede
          ser verificada por cualquier persona.
        </p>
        <div className="flex flex-wrap gap-2">
          {sectors.map((s) => (
            <Link
              key={s.slug}
              href={s.url}
              className="rounded-md border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
            >
              {s.title}
            </Link>
          ))}
        </div>
      </div>
      {/* <div className="px-4 lg:px-6">
        <IndicatorChart {...population} />
      </div> */}
    </div>
  )
}
