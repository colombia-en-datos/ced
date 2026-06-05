import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import * as z from 'zod'
import { SOCIAL_PROTECTION_MANIFEST } from '@/data/health'
import type { MultiSeriesResult } from '@/data/types'
import { socrataApi } from '@/lib/api-client'

const rowSchema = z.object({
  ano: z.coerce.number(),
  componentedesc: z.string(),
  total: z.coerce.number(),
})

const responseSchema = z.array(rowSchema)

const COMPONENT_MAP: Record<string, string> = {
  PENSIONES: 'pensiones',
  'COMPENSACION FAMILIAR': 'compensacionFamiliar',
  'RIESGOS LABORALES': 'riesgosLaborales',
  CESANTIAS: 'cesantias',
}

function useSocialProtectionRaw(options?: Pick<QueryObserverOptions, 'enabled'>) {
  return useQuery({
    queryKey: [SOCIAL_PROTECTION_MANIFEST.queryKey, 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(
        SOCIAL_PROTECTION_MANIFEST.resourceId,
        SOCIAL_PROTECTION_MANIFEST.query,
        { signal }
      )
      return responseSchema.parse(raw)
    },
    staleTime: SOCIAL_PROTECTION_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })
}

export function useSocialProtectionByYear(options?: Pick<QueryObserverOptions, 'enabled'>): MultiSeriesResult {
  const query = useSocialProtectionRaw(options)
  const currentYear = new Date().getFullYear()

  const data = useMemo(() => {
    if (!query.data) return undefined

    const byYear = new Map<number, Record<string, number>>()
    for (const row of query.data) {
      const key = COMPONENT_MAP[row.componentedesc]
      if (!key) continue
      const entry = byYear.get(row.ano) ?? { pensiones: 0, compensacionFamiliar: 0, riesgosLaborales: 0, cesantias: 0 }
      entry[key] = row.total
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
    id: SOCIAL_PROTECTION_MANIFEST.id,
    label: SOCIAL_PROTECTION_MANIFEST.label,
    description: SOCIAL_PROTECTION_MANIFEST.description,
    source: SOCIAL_PROTECTION_MANIFEST.source,
    sourceUrl: SOCIAL_PROTECTION_MANIFEST.sourceUrl,
    unit: SOCIAL_PROTECTION_MANIFEST.unit,
    positiveDirection: SOCIAL_PROTECTION_MANIFEST.positiveDirection,
    data,
    isLoading: query.isPending,
    error: query.error,
    dataUpdatedAt: query.dataUpdatedAt,
  }
}
