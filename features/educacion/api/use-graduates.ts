import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import * as z from 'zod'
import { GRADUATES_MANIFEST } from '@/data/education'
import type { MultiSeriesResult } from '@/data/types'
import { socrataApi } from '@/lib/api-client'

const rowSchema = z
  .object({
    a_o: z.coerce.number(),
    grado_11: z.coerce.number(),
    ciclo_adultos: z.coerce.number(),
  })
  .transform((r) => ({
    year: r.a_o,
    grado11: r.grado_11,
    cicloAdultos: r.ciclo_adultos,
  }))

const responseSchema = z.array(rowSchema)

function useGraduatesRaw(options?: Pick<QueryObserverOptions, 'enabled'>) {
  return useQuery({
    queryKey: [GRADUATES_MANIFEST.queryKey, 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(GRADUATES_MANIFEST.resourceId, GRADUATES_MANIFEST.query, {
        signal,
      })
      return responseSchema.parse(raw)
    },
    staleTime: GRADUATES_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })
}

export function useGraduatesByYear(options?: Pick<QueryObserverOptions, 'enabled'>): MultiSeriesResult {
  const query = useGraduatesRaw(options)
  const currentYear = new Date().getFullYear()

  const data = useMemo(() => {
    if (!query.data) return undefined
    return query.data.map((r) => ({
      ts: new Date(r.year, 0, 1).getTime(),
      label: String(r.year),
      isPartial: r.year === currentYear,
      grado11: r.grado11,
      cicloAdultos: r.cicloAdultos,
    }))
  }, [query.data, currentYear])

  return {
    id: GRADUATES_MANIFEST.id,
    label: GRADUATES_MANIFEST.label,
    description: GRADUATES_MANIFEST.description,
    source: GRADUATES_MANIFEST.source,
    sourceUrl: GRADUATES_MANIFEST.sourceUrl,
    unit: GRADUATES_MANIFEST.unit,
    positiveDirection: GRADUATES_MANIFEST.positiveDirection,
    data,
    isLoading: query.isPending,
    error: query.error,
    dataUpdatedAt: query.dataUpdatedAt,
  }
}
