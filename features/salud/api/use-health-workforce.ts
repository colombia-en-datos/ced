import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import * as z from 'zod'
import { HEALTH_WORKFORCE_MANIFEST } from '@/data/health'
import type { MultiSeriesResult } from '@/data/types'
import { socrataApi } from '@/lib/api-client'

const rowSchema = z.object({
  ano: z.coerce.number(),
  perfilprofesional: z.string(),
  total: z.coerce.number(),
})

const responseSchema = z.array(rowSchema)

// Map profile code prefixes to series keys
const profileKeyMap: Record<string, string> = {
  P07: 'medicina',
  P03: 'enfermeria',
  A02: 'auxiliarEnfermeria',
  P09: 'odontologia',
  P11: 'psicologia',
}

function getSeriesKey(profile: string): string | undefined {
  const code = profile.slice(0, 3)
  return profileKeyMap[code]
}

function useHealthWorkforceRaw(options?: Pick<QueryObserverOptions, 'enabled'>) {
  return useQuery({
    queryKey: [HEALTH_WORKFORCE_MANIFEST.queryKey, 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(
        HEALTH_WORKFORCE_MANIFEST.resourceId,
        HEALTH_WORKFORCE_MANIFEST.query,
        { signal }
      )
      return responseSchema.parse(raw)
    },
    staleTime: HEALTH_WORKFORCE_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })
}

type WorkforcePoint = {
  medicina: number
  enfermeria: number
  auxiliarEnfermeria: number
  odontologia: number
  psicologia: number
}

const emptyPoint = (): WorkforcePoint => ({
  medicina: 0,
  enfermeria: 0,
  auxiliarEnfermeria: 0,
  odontologia: 0,
  psicologia: 0,
})

export function useHealthWorkforceByYear(options?: Pick<QueryObserverOptions, 'enabled'>): MultiSeriesResult {
  const query = useHealthWorkforceRaw(options)
  const currentYear = new Date().getFullYear()

  const data = useMemo(() => {
    if (!query.data) return undefined

    const byYear = new Map<number, WorkforcePoint>()
    for (const row of query.data) {
      const key = getSeriesKey(row.perfilprofesional)
      if (!key) continue
      const entry = byYear.get(row.ano) ?? emptyPoint()
      ;(entry as Record<string, number>)[key] = row.total
      byYear.set(row.ano, entry)
    }

    return [...byYear.entries()]
      .sort(([a], [b]) => a - b)
      .map(([year, vals]) => ({
        ts: new Date(year, 0, 1).getTime(),
        label: String(year),
        isPartial: year === currentYear,
        ...vals,
      }))
  }, [query.data, currentYear])

  return {
    id: HEALTH_WORKFORCE_MANIFEST.id,
    label: HEALTH_WORKFORCE_MANIFEST.label,
    description: HEALTH_WORKFORCE_MANIFEST.description,
    source: HEALTH_WORKFORCE_MANIFEST.source,
    sourceUrl: HEALTH_WORKFORCE_MANIFEST.sourceUrl,
    unit: HEALTH_WORKFORCE_MANIFEST.unit,
    positiveDirection: HEALTH_WORKFORCE_MANIFEST.positiveDirection,
    data,
    isLoading: query.isPending,
    error: query.error,
    dataUpdatedAt: query.dataUpdatedAt,
  }
}
