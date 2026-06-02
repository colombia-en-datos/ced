'use client'

import { ChartEmpty } from '@/components/chart-empty'
import { ChartSkeleton } from '@/components/chart-skeleton'
import { IndicatorChartCard } from '@/components/indicator-chart-card'
import { TimeLineChart } from '@/components/time-line-chart'
import { KIDNAPPINGS_MANIFEST } from '@/features/seguridad/hooks/use-kidnappings'
import { useKidnappingsByYear } from '@/features/seguridad/hooks/use-kidnappings-by-year'

export function KidnappingsChart() {
  const { data, latest, previous, delta, isLoading, error } =
    useKidnappingsByYear()

  if (isLoading) return <ChartSkeleton />
  if (error)
    return <p className="text-destructive text-sm">Error: {error.message}</p>
  if (!data?.length || !latest)
    return <ChartEmpty indicator={KIDNAPPINGS_MANIFEST.label} />

  return (
    <IndicatorChartCard
      title={KIDNAPPINGS_MANIFEST.label}
      subtitle={`Total nacional reportado, ${data[0].year}\u2013${latest.year}`}
      source={KIDNAPPINGS_MANIFEST.source}
      sourceUrl={KIDNAPPINGS_MANIFEST.sourceUrl}
    >
      <TimeLineChart
        data={data}
        xKey="year"
        yKey="total"
        yLabel="Secuestros"
        policyEvents={[...KIDNAPPINGS_MANIFEST.policyEvents]}
      />
      {delta !== null && previous && (
        <p className="mt-2 text-sm text-muted-foreground">
          {latest.year}: {latest.total.toLocaleString('es-CO')}{' '}
          {KIDNAPPINGS_MANIFEST.unit} ({delta > 0 ? '+' : ''}
          {delta.toFixed(1)}% vs {previous.year})
        </p>
      )}
    </IndicatorChartCard>
  )
}
