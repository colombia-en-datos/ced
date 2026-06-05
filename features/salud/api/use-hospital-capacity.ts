import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import * as z from 'zod'
import { HOSPITAL_CAPACITY_MANIFEST } from '@/data/health'
import type { MultiSeriesResult } from '@/data/types'
import { socrataApi } from '@/lib/api-client'

const rowSchema = z
  .object({
    a_o: z.coerce.number(),
    camas_adultos: z.coerce.number(),
    camas_pediatrica: z.coerce.number(),
    camas_obstetricia: z.coerce.number(),
    uci_adulto: z.coerce.number(),
    uci_neonatal: z.coerce.number(),
    uci_pediatrica: z.coerce.number(),
    ambulancias_basica: z.coerce.number(),
    ambulancias_med: z.coerce.number(),
    quirofanos: z.coerce.number(),
  })
  .transform((r) => ({
    year: r.a_o,
    hospitalBeds: r.camas_adultos + r.camas_pediatrica + r.camas_obstetricia,
    icuBeds: r.uci_adulto + r.uci_neonatal + r.uci_pediatrica,
    ambulances: r.ambulancias_basica + r.ambulancias_med,
    operatingRooms: r.quirofanos,
  }))

const responseSchema = z.array(rowSchema)

function useHospitalCapacityRaw(options?: Pick<QueryObserverOptions, 'enabled'>) {
  return useQuery({
    queryKey: [HOSPITAL_CAPACITY_MANIFEST.queryKey, 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(
        HOSPITAL_CAPACITY_MANIFEST.resourceId,
        HOSPITAL_CAPACITY_MANIFEST.query,
        { signal }
      )
      return responseSchema.parse(raw)
    },
    staleTime: HOSPITAL_CAPACITY_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })
}

export function useHospitalCapacityByYear(
  options?: Pick<QueryObserverOptions, 'enabled'>
): MultiSeriesResult {
  const query = useHospitalCapacityRaw(options)
  const currentYear = new Date().getFullYear()

  const data = useMemo(() => {
    if (!query.data) return undefined
    return query.data.map((r) => ({
      ts: new Date(r.year, 0, 1).getTime(),
      label: String(r.year),
      isPartial: r.year === currentYear,
      hospitalBeds: r.hospitalBeds,
      icuBeds: r.icuBeds,
      ambulances: r.ambulances,
      operatingRooms: r.operatingRooms,
    }))
  }, [query.data, currentYear])

  return {
    id: HOSPITAL_CAPACITY_MANIFEST.id,
    label: HOSPITAL_CAPACITY_MANIFEST.label,
    description: HOSPITAL_CAPACITY_MANIFEST.description,
    source: HOSPITAL_CAPACITY_MANIFEST.source,
    sourceUrl: HOSPITAL_CAPACITY_MANIFEST.sourceUrl,
    unit: HOSPITAL_CAPACITY_MANIFEST.unit,
    positiveDirection: HOSPITAL_CAPACITY_MANIFEST.positiveDirection,
    data,
    isLoading: query.isPending,
    error: query.error,
    dataUpdatedAt: query.dataUpdatedAt,
  }
}
