import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import * as z from 'zod'
import { VENEZUELA_VISAS_MANIFEST } from '@/data/international-relations'
import type { MultiSeriesResult } from '@/data/types'
import { socrataApi } from '@/lib/api-client'

const VISA_TYPE_MAP: Record<string, string> = {
  TEMPORAL: 'temporal',
  'VISAS MIGRANTE': 'migrante',
  'VISAS RESIDENTE': 'residente',
  'VISAS VISITANTE': 'visitante',
  TRASPASOS: 'traspasos',
  NEGOCIOS: 'negocios',
}

const rowSchema = z.object({
  a_o_expedici_n: z.coerce.number(),
  tipo_de_visa: z.string(),
  total: z.coerce.number(),
})

const responseSchema = z.array(rowSchema)

function useRaw(options?: Pick<QueryObserverOptions, 'enabled'>) {
  return useQuery({
    queryKey: [VENEZUELA_VISAS_MANIFEST.queryKey, 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(
        VENEZUELA_VISAS_MANIFEST.resourceId,
        VENEZUELA_VISAS_MANIFEST.query,
        { signal }
      )
      return responseSchema.parse(raw)
    },
    staleTime: VENEZUELA_VISAS_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })
}

export function useVenezuelaVisasByYear(options?: Pick<QueryObserverOptions, 'enabled'>): MultiSeriesResult {
  const query = useRaw(options)
  const currentYear = new Date().getFullYear()

  const data = useMemo(() => {
    if (!query.data) return undefined

    const byYear = new Map<number, Record<string, number>>()

    for (const row of query.data) {
      const key = VISA_TYPE_MAP[row.tipo_de_visa] ?? row.tipo_de_visa.toLowerCase()
      const year = row.a_o_expedici_n
      const existing = byYear.get(year) ?? {
        temporal: 0,
        migrante: 0,
        residente: 0,
        visitante: 0,
        traspasos: 0,
        negocios: 0,
      }
      existing[key] = (existing[key] ?? 0) + row.total
      byYear.set(year, existing)
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
    id: VENEZUELA_VISAS_MANIFEST.id,
    label: VENEZUELA_VISAS_MANIFEST.label,
    description: VENEZUELA_VISAS_MANIFEST.description,
    question: VENEZUELA_VISAS_MANIFEST.question,
    source: VENEZUELA_VISAS_MANIFEST.source,
    sourceUrl: VENEZUELA_VISAS_MANIFEST.sourceUrl,
    unit: VENEZUELA_VISAS_MANIFEST.unit,
    positiveDirection: VENEZUELA_VISAS_MANIFEST.positiveDirection,
    data,
    isLoading: query.isPending,
    error: query.error,
    dataUpdatedAt: query.dataUpdatedAt,
  }
}
