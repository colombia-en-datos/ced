import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import * as z from 'zod'
import { HEALTH_PROVIDERS_MANIFEST } from '@/data/health'
import type { MultiSeriesResult } from '@/data/types'
import { socrataApi } from '@/lib/api-client'

const rowSchema = z.object({
  a_o: z.coerce.number(),
  naturaleza: z.string(),
  total: z.coerce.number(),
})

const responseSchema = z.array(rowSchema)

function useHealthProvidersRaw(options?: Pick<QueryObserverOptions, 'enabled'>) {
  return useQuery({
    queryKey: [HEALTH_PROVIDERS_MANIFEST.queryKey, 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(
        HEALTH_PROVIDERS_MANIFEST.resourceId,
        HEALTH_PROVIDERS_MANIFEST.query,
        { signal }
      )
      return responseSchema.parse(raw)
    },
    staleTime: HEALTH_PROVIDERS_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })
}

export function useHealthProvidersByYear(options?: Pick<QueryObserverOptions, 'enabled'>): MultiSeriesResult {
  const query = useHealthProvidersRaw(options)
  const currentYear = new Date().getFullYear()

  const data = useMemo(() => {
    if (!query.data) return undefined

    // Pivot: group rows by year, then pick naturaleza values
    const byYear = new Map<number, { privada: number; publica: number; mixta: number }>()
    for (const row of query.data) {
      const entry = byYear.get(row.a_o) ?? { privada: 0, publica: 0, mixta: 0 }
      if (row.naturaleza === 'Privada') entry.privada = row.total
      else if (row.naturaleza === 'Pública') entry.publica = row.total
      else if (row.naturaleza === 'Mixta') entry.mixta = row.total
      byYear.set(row.a_o, entry)
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
    id: HEALTH_PROVIDERS_MANIFEST.id,
    label: HEALTH_PROVIDERS_MANIFEST.label,
    description: HEALTH_PROVIDERS_MANIFEST.description,
    source: HEALTH_PROVIDERS_MANIFEST.source,
    sourceUrl: HEALTH_PROVIDERS_MANIFEST.sourceUrl,
    unit: HEALTH_PROVIDERS_MANIFEST.unit,
    positiveDirection: HEALTH_PROVIDERS_MANIFEST.positiveDirection,
    data,
    isLoading: query.isPending,
    error: query.error,
    dataUpdatedAt: query.dataUpdatedAt,
  }
}
