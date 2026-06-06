import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import * as z from 'zod'
import { CYBER_INCIDENTS_BY_TYPE_MANIFEST } from '@/data/technology'
import type { MultiSeriesResult } from '@/data/types'
import { socrataApi } from '@/lib/api-client'

const rowSchema = z.object({
  year: z.coerce.number(),
  tipo_de_incidente: z.string(),
  total: z.coerce.number(),
})

const responseSchema = z.array(rowSchema)

// Map top incident types to stable keys
const TYPE_MAP: Record<string, string> = {
  Phishing: 'phishing',
  'Uso no Autorizado de Recursos': 'usoNoAutorizado',
  'Compromiso de Aplicaciones': 'compromisoApp',
  Spam: 'spam',
  'Sistema Vulnerable': 'sistemaVulnerable',
}

const TOP_TYPES = new Set(Object.keys(TYPE_MAP))

type IncidentTotals = {
  phishing: number
  usoNoAutorizado: number
  compromisoApp: number
  spam: number
  sistemaVulnerable: number
  otros: number
}

function useRaw(options?: Pick<QueryObserverOptions, 'enabled'>) {
  return useQuery({
    queryKey: [CYBER_INCIDENTS_BY_TYPE_MANIFEST.queryKey, 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(
        CYBER_INCIDENTS_BY_TYPE_MANIFEST.resourceId,
        CYBER_INCIDENTS_BY_TYPE_MANIFEST.query,
        { signal }
      )
      return responseSchema.parse(raw)
    },
    staleTime: CYBER_INCIDENTS_BY_TYPE_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })
}

export function useCyberIncidentsByTypeByYear(
  options?: Pick<QueryObserverOptions, 'enabled'>
): MultiSeriesResult {
  const query = useRaw(options)
  const currentYear = new Date().getFullYear()

  const data = useMemo(() => {
    if (!query.data) return undefined

    const empty = (): IncidentTotals => ({
      phishing: 0,
      usoNoAutorizado: 0,
      compromisoApp: 0,
      spam: 0,
      sistemaVulnerable: 0,
      otros: 0,
    })

    const byYear = new Map<number, IncidentTotals>()
    for (const row of query.data) {
      const entry = byYear.get(row.year) ?? empty()
      if (TOP_TYPES.has(row.tipo_de_incidente)) {
        const key = TYPE_MAP[row.tipo_de_incidente] as keyof IncidentTotals
        entry[key] += row.total
      } else {
        entry.otros += row.total
      }
      byYear.set(row.year, entry)
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
    id: CYBER_INCIDENTS_BY_TYPE_MANIFEST.id,
    label: CYBER_INCIDENTS_BY_TYPE_MANIFEST.label,
    description: CYBER_INCIDENTS_BY_TYPE_MANIFEST.description,
    question: CYBER_INCIDENTS_BY_TYPE_MANIFEST.question,
    source: CYBER_INCIDENTS_BY_TYPE_MANIFEST.source,
    sourceUrl: CYBER_INCIDENTS_BY_TYPE_MANIFEST.sourceUrl,
    unit: CYBER_INCIDENTS_BY_TYPE_MANIFEST.unit,
    positiveDirection: CYBER_INCIDENTS_BY_TYPE_MANIFEST.positiveDirection,
    data,
    isLoading: query.isPending,
    error: query.error,
    dataUpdatedAt: query.dataUpdatedAt,
  }
}
