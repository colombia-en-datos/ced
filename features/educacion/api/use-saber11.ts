import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import * as z from 'zod'
import { SABER_11_MANIFEST } from '@/data/education'
import type { MultiSeriesResult } from '@/data/types'
import { socrataApi } from '@/lib/api-client'

/** Years with only pre-exam students (~15–32K vs 500K+ normal) produce
 *  unrepresentative averages. Filter them out. */
const MIN_STUDENTS = 100_000

const rowSchema = z
  .object({
    year: z.coerce.number(),
    matematicas: z.coerce.number(),
    ingles: z.coerce.number(),
    lectura_critica: z.coerce.number(),
    c_naturales: z.coerce.number(),
    sociales: z.coerce.number(),
    total: z.coerce.number(),
  })
  .transform((r) => ({
    year: r.year,
    matematicas: r.matematicas,
    ingles: r.ingles,
    lecturaCritica: r.lectura_critica,
    cNaturales: r.c_naturales,
    sociales: r.sociales,
    studentCount: r.total,
  }))

const responseSchema = z.array(rowSchema)

function useSaber11Raw(options?: Pick<QueryObserverOptions, 'enabled'>) {
  return useQuery({
    queryKey: [SABER_11_MANIFEST.queryKey, 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(SABER_11_MANIFEST.resourceId, SABER_11_MANIFEST.query, {
        signal,
      })
      return responseSchema.parse(raw)
    },
    staleTime: SABER_11_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })
}

export function useSaber11ByYear(options?: Pick<QueryObserverOptions, 'enabled'>): MultiSeriesResult {
  const query = useSaber11Raw(options)
  const currentYear = new Date().getFullYear()

  const data = useMemo(() => {
    if (!query.data) return undefined
    return query.data
      .filter((r) => r.studentCount >= MIN_STUDENTS)
      .map((r) => ({
        ts: new Date(r.year, 0, 1).getTime(),
        label: String(r.year),
        isPartial: r.year === currentYear,
        matematicas: r.matematicas,
        ingles: r.ingles,
        lecturaCritica: r.lecturaCritica,
        cNaturales: r.cNaturales,
        sociales: r.sociales,
      }))
  }, [query.data, currentYear])

  return {
    id: SABER_11_MANIFEST.id,
    label: SABER_11_MANIFEST.label,
    description: SABER_11_MANIFEST.description,
    source: SABER_11_MANIFEST.source,
    sourceUrl: SABER_11_MANIFEST.sourceUrl,
    unit: SABER_11_MANIFEST.unit,
    positiveDirection: SABER_11_MANIFEST.positiveDirection,
    data,
    isLoading: query.isPending,
    error: query.error,
    dataUpdatedAt: query.dataUpdatedAt,
  }
}
