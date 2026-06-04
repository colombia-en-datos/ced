'use client'

import { IndicatorChart } from '@/components/indicator-chart'
import type { SeriesConfig } from '@/components/multi-line-chart'
import { MultiSeriesChart } from '@/components/multi-series-chart'
import { SectorHeader } from '@/components/sector-header'
import {
  useDropoutByYear,
  useEnrollmentByYear,
  useNetCoverageByYear,
} from '@/features/educacion/api/indicators'
import { useEventsByYear } from '@/hooks/use-events-by-year'

const COVERAGE_SERIES: SeriesConfig[] = [
  { key: 'transicion', label: 'Transición', color: 'oklch(0.72 0.17 195)' },
  { key: 'primaria', label: 'Primaria', color: 'oklch(0.62 0.21 260)' },
  { key: 'secundaria', label: 'Secundaria', color: 'oklch(0.75 0.18 75)' },
  { key: 'media', label: 'Media', color: 'oklch(0.65 0.22 350)' },
]

const DROPOUT_SERIES: SeriesConfig[] = [
  { key: 'transicion', label: 'Transición', color: 'oklch(0.72 0.17 195)' },
  { key: 'primaria', label: 'Primaria', color: 'oklch(0.62 0.21 260)' },
  { key: 'secundaria', label: 'Secundaria', color: 'oklch(0.75 0.18 75)' },
  { key: 'media', label: 'Media', color: 'oklch(0.65 0.22 350)' },
]

export default function EducacionPage() {
  const enrollment = useEnrollmentByYear({ enabled: true })
  const netCoverage = useNetCoverageByYear({ enabled: true })
  const dropout = useDropoutByYear({ enabled: true })
  const eventsByYear = useEventsByYear()

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectorHeader
        title="Educación"
        subtitle="Indicadores de educación básica y media con fuentes oficiales verificadas."
      />

      <div className="flex flex-col gap-1 px-4 lg:px-6">
        <h2 className="text-lg font-semibold tracking-tight">Indicadores educativos</h2>
        <p className="text-sm text-muted-foreground">
          Series históricas de indicadores educativos a nivel nacional. Promedio de todos los departamentos.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        <IndicatorChart {...enrollment} eventsByYear={eventsByYear} />
        <MultiSeriesChart result={netCoverage} series={COVERAGE_SERIES} eventsByYear={eventsByYear} />
        <MultiSeriesChart result={dropout} series={DROPOUT_SERIES} eventsByYear={eventsByYear} />
      </div>
    </div>
  )
}
