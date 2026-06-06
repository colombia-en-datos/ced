import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import * as z from 'zod'
import { MOBILE_INTERNET_MANIFEST } from '@/data/technology'
import type { MultiSeriesResult } from '@/data/types'
import { socrataApi } from '@/lib/api-client'

const rowSchema = z.object({
  a_o: z.coerce.number(),
  trimestre: z.coerce.number(),
  proveedor: z.string(),
  segmento: z.string(),
  tr_fico: z.coerce.number(),
})

const responseSchema = z.array(rowSchema)

// Map long corporate names to short display keys
const PROVIDER_MAP: Record<string, string> = {
  'COLOMBIA MOVIL  S.A ESP': 'tigo',
  'COLOMBIA TELECOMUNICACIONES S.A. E.S.P.': 'movistar',
  'COMUNICACION CELULAR S A COMCEL S A': 'claro',
  'VIRGIN MOBILE COLOMBIA S.A.S.': 'virgin',
  'PARTNERS TELECOM COLOMBIA SAS': 'wom',
}
const TOP_KEYS = new Set(Object.values(PROVIDER_MAP))

// Traffic values are in KB — convert to TB
const KB_TO_TB = 1024 ** 3

function useRaw(options?: Pick<QueryObserverOptions, 'enabled'>) {
  return useQuery({
    queryKey: [MOBILE_INTERNET_MANIFEST.queryKey, 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(
        MOBILE_INTERNET_MANIFEST.resourceId,
        MOBILE_INTERNET_MANIFEST.query,
        { signal }
      )
      return responseSchema.parse(raw)
    },
    staleTime: MOBILE_INTERNET_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })
}

export function useMobileInternetByYear(options?: Pick<QueryObserverOptions, 'enabled'>): MultiSeriesResult {
  const query = useRaw(options)
  const currentYear = new Date().getFullYear()

  const data = useMemo(() => {
    if (!query.data) return undefined

    // Sum traffic per provider per year (across all quarters and segments)
    const byYear = new Map<number, { maxQ: number; byProvider: Map<string, number> }>()
    for (const row of query.data) {
      let entry = byYear.get(row.a_o)
      if (!entry) {
        entry = { maxQ: row.trimestre, byProvider: new Map() }
        byYear.set(row.a_o, entry)
      }
      if (row.trimestre > entry.maxQ) entry.maxQ = row.trimestre

      const key = PROVIDER_MAP[row.proveedor] ?? 'otros'
      entry.byProvider.set(key, (entry.byProvider.get(key) ?? 0) + row.tr_fico)
    }

    return [...byYear.entries()]
      .sort(([a], [b]) => a - b)
      .map(([year, { maxQ, byProvider }]) => {
        // Split "otros" bucket from top providers
        let otrosTotal = 0
        const result: Record<string, unknown> = {
          ts: new Date(year, 0, 1).getTime(),
          label: String(year),
          isPartial: year === currentYear || maxQ < 4,
        }
        for (const key of TOP_KEYS) {
          result[key] = (byProvider.get(key) ?? 0) / KB_TO_TB
        }
        for (const [key, val] of byProvider) {
          if (!TOP_KEYS.has(key)) otrosTotal += val
        }
        result.otros = otrosTotal / KB_TO_TB
        return result
      })
  }, [query.data, currentYear])

  return {
    id: MOBILE_INTERNET_MANIFEST.id,
    label: MOBILE_INTERNET_MANIFEST.label,
    description: MOBILE_INTERNET_MANIFEST.description,
    question: MOBILE_INTERNET_MANIFEST.question,
    source: MOBILE_INTERNET_MANIFEST.source,
    sourceUrl: MOBILE_INTERNET_MANIFEST.sourceUrl,
    unit: MOBILE_INTERNET_MANIFEST.unit,
    positiveDirection: MOBILE_INTERNET_MANIFEST.positiveDirection,
    data,
    isLoading: query.isPending,
    error: query.error,
    dataUpdatedAt: query.dataUpdatedAt,
  }
}
