import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import * as z from 'zod'
import { RESEARCH_GROUPS_MANIFEST } from '@/data/technology'
import type { MultiSeriesResult } from '@/data/types'
import { socrataApi } from '@/lib/api-client'

const rowSchema = z.object({
  nme_convocatoria: z.string(),
  nme_clasificacion_gr: z.string(),
  total: z.coerce.number(),
})

const responseSchema = z.array(rowSchema)

type GroupTotals = {
  a1: number
  a: number
  b: number
  c: number
  d: number
  reconocido: number
}

const CLASS_MAP: Record<string, keyof GroupTotals> = {
  A1: 'a1',
  A: 'a',
  B: 'b',
  C: 'c',
  D: 'd',
  Reconocido: 'reconocido',
}

// Extract year from convocatoria name, e.g. "Convocatoria 640 de 2013" → 2013
function extractYear(name: string): number | null {
  const match = name.match(/\b(20\d{2})\b/)
  return match ? Number(match[1]) : null
}

function useRaw(options?: Pick<QueryObserverOptions, 'enabled'>) {
  return useQuery({
    queryKey: [RESEARCH_GROUPS_MANIFEST.queryKey, 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(
        RESEARCH_GROUPS_MANIFEST.resourceId,
        RESEARCH_GROUPS_MANIFEST.query,
        { signal }
      )
      return responseSchema.parse(raw)
    },
    staleTime: RESEARCH_GROUPS_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })
}

export function useResearchGroupsByYear(options?: Pick<QueryObserverOptions, 'enabled'>): MultiSeriesResult {
  const query = useRaw(options)

  const data = useMemo(() => {
    if (!query.data) return undefined

    const byYear = new Map<number, GroupTotals>()
    for (const row of query.data) {
      const year = extractYear(row.nme_convocatoria)
      if (!year) continue
      const key = CLASS_MAP[row.nme_clasificacion_gr]
      if (!key) continue
      const entry = byYear.get(year) ?? { a1: 0, a: 0, b: 0, c: 0, d: 0, reconocido: 0 }
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
    id: RESEARCH_GROUPS_MANIFEST.id,
    label: RESEARCH_GROUPS_MANIFEST.label,
    description: RESEARCH_GROUPS_MANIFEST.description,
    question: RESEARCH_GROUPS_MANIFEST.question,
    source: RESEARCH_GROUPS_MANIFEST.source,
    sourceUrl: RESEARCH_GROUPS_MANIFEST.sourceUrl,
    unit: RESEARCH_GROUPS_MANIFEST.unit,
    positiveDirection: RESEARCH_GROUPS_MANIFEST.positiveDirection,
    data,
    isLoading: query.isPending,
    error: query.error,
    dataUpdatedAt: query.dataUpdatedAt,
  }
}
