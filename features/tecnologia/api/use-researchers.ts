import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import * as z from 'zod'
import { RESEARCHERS_MANIFEST } from '@/data/technology'
import type { MultiSeriesResult } from '@/data/types'
import { socrataApi } from '@/lib/api-client'

const rowSchema = z.object({
  nme_convocatoria: z.string(),
  nme_clasificacion_pr: z.string(),
  total: z.coerce.number(),
})

const responseSchema = z.array(rowSchema)

type ResearcherTotals = {
  junior: number
  asociado: number
  senior: number
  emerito: number
}

const CLASS_MAP: Record<string, keyof ResearcherTotals> = {
  'Investigador Junior': 'junior',
  'Investigador Asociado': 'asociado',
  'Investigador Sénior': 'senior',
  'Investigador Emérito': 'emerito',
}

function extractYear(name: string): number | null {
  const match = name.match(/\b(20\d{2})\b/)
  return match ? Number(match[1]) : null
}

function useRaw(options?: Pick<QueryObserverOptions, 'enabled'>) {
  return useQuery({
    queryKey: [RESEARCHERS_MANIFEST.queryKey, 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(RESEARCHERS_MANIFEST.resourceId, RESEARCHERS_MANIFEST.query, {
        signal,
      })
      return responseSchema.parse(raw)
    },
    staleTime: RESEARCHERS_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })
}

export function useResearchersByYear(options?: Pick<QueryObserverOptions, 'enabled'>): MultiSeriesResult {
  const query = useRaw(options)

  const data = useMemo(() => {
    if (!query.data) return undefined

    const byYear = new Map<number, ResearcherTotals>()
    for (const row of query.data) {
      const year = extractYear(row.nme_convocatoria)
      if (!year) continue
      const key = CLASS_MAP[row.nme_clasificacion_pr]
      if (!key) continue
      const entry = byYear.get(year) ?? { junior: 0, asociado: 0, senior: 0, emerito: 0 }
      entry[key] += row.total
      byYear.set(year, entry)
    }

    return [...byYear.entries()]
      .sort(([a], [b]) => a - b)
      .map(([year, vals]) => ({
        ts: new Date(year, 0, 1).getTime(),
        label: String(year),
        isPartial: false,
        ...vals,
      }))
  }, [query.data])

  return {
    id: RESEARCHERS_MANIFEST.id,
    label: RESEARCHERS_MANIFEST.label,
    description: RESEARCHERS_MANIFEST.description,
    question: RESEARCHERS_MANIFEST.question,
    source: RESEARCHERS_MANIFEST.source,
    sourceUrl: RESEARCHERS_MANIFEST.sourceUrl,
    unit: RESEARCHERS_MANIFEST.unit,
    positiveDirection: RESEARCHERS_MANIFEST.positiveDirection,
    data,
    isLoading: query.isPending,
    error: query.error,
    dataUpdatedAt: query.dataUpdatedAt,
  }
}
