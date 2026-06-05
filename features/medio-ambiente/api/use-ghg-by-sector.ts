import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import * as z from 'zod'
import { GHG_BY_SECTOR_MANIFEST } from '@/data/environment'
import type { MultiSeriesResult } from '@/data/types'
import { socrataApi } from '@/lib/api-client'

const rowSchema = z.object({
  a_o: z.coerce.number(),
  clasificacion: z.string(),
  total: z.coerce.number(),
})

const responseSchema = z.array(rowSchema)

type SectorTotals = {
  energia: number
  agricultura: number
  silvicultura: number
  residuos: number
  industria: number
}

const SECTOR_MAP: Record<string, keyof SectorTotals> = {
  '1 Energía': 'energia',
  '3 Agricultura': 'agricultura',
  '4 Silvicultura, uso y cambio de uso de la tierra': 'silvicultura',
  '5 Residuos': 'residuos',
  '2 Procesos industriales': 'industria',
}

function useGhgBySectorRaw(options?: Pick<QueryObserverOptions, 'enabled'>) {
  return useQuery({
    queryKey: [GHG_BY_SECTOR_MANIFEST.queryKey, 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(GHG_BY_SECTOR_MANIFEST.resourceId, GHG_BY_SECTOR_MANIFEST.query, {
        signal,
      })
      return responseSchema.parse(raw)
    },
    staleTime: GHG_BY_SECTOR_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })
}

export function useGhgBySectorByYear(options?: Pick<QueryObserverOptions, 'enabled'>): MultiSeriesResult {
  const query = useGhgBySectorRaw(options)
  const currentYear = new Date().getFullYear()

  const data = useMemo(() => {
    if (!query.data) return undefined

    const byYear = new Map<number, SectorTotals>()
    for (const row of query.data) {
      const key = SECTOR_MAP[row.clasificacion]
      if (!key) continue
      const entry = byYear.get(row.a_o) ?? {
        energia: 0,
        agricultura: 0,
        silvicultura: 0,
        residuos: 0,
        industria: 0,
      }
      entry[key] = row.total
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
    id: GHG_BY_SECTOR_MANIFEST.id,
    label: GHG_BY_SECTOR_MANIFEST.label,
    description: GHG_BY_SECTOR_MANIFEST.description,
    question: GHG_BY_SECTOR_MANIFEST.question,
    source: GHG_BY_SECTOR_MANIFEST.source,
    sourceUrl: GHG_BY_SECTOR_MANIFEST.sourceUrl,
    unit: GHG_BY_SECTOR_MANIFEST.unit,
    positiveDirection: GHG_BY_SECTOR_MANIFEST.positiveDirection,
    data,
    isLoading: query.isPending,
    error: query.error,
    dataUpdatedAt: query.dataUpdatedAt,
  }
}
