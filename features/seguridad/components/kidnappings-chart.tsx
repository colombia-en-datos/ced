"use client"

import { ChartEmpty } from "@/components/chart-empty"
import { ChartSkeleton } from "@/components/chart-skeleton"
import { TimeLineChart } from "@/components/time-line-chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  KIDNAPPINGS_MANIFEST,
  useKidnappings,
} from "@/features/seguridad/hooks/use-kidnappings"

export function KidnappingsChart() {
  const { data, latest, previous, delta, isLoading, error } = useKidnappings()

  if (isLoading) return <ChartSkeleton />
  if (error)
    return <p className="text-destructive text-sm">Error: {error.message}</p>
  if (!data?.length || !latest)
    return <ChartEmpty indicator={KIDNAPPINGS_MANIFEST.label} />

  return (
    <Card>
      <CardHeader>
        <CardTitle>{KIDNAPPINGS_MANIFEST.label}</CardTitle>
        <CardDescription>
          {data[0].year}–{latest.year} &middot; Fuente:{" "}
          <a
            href={KIDNAPPINGS_MANIFEST.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            {KIDNAPPINGS_MANIFEST.source}
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TimeLineChart
          data={data}
          xKey="year"
          yKey="total"
          yLabel="Secuestros"
          policyEvents={[...KIDNAPPINGS_MANIFEST.policyEvents]}
        />
        {delta !== null && previous && (
          <p className="mt-2 text-sm text-muted-foreground">
            {latest.year}: {latest.total.toLocaleString("es-CO")}{" "}
            {KIDNAPPINGS_MANIFEST.unit} ({delta > 0 ? "+" : ""}
            {delta.toFixed(1)}% vs {previous.year})
          </p>
        )}
      </CardContent>
    </Card>
  )
}
