import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import * as z from 'zod'
import { COMPUTERS_FOR_EDU_MANIFEST } from '@/data/technology'
import type { MultiSeriesResult } from '@/data/types'
import { socrataApi } from '@/lib/api-client'

const rowSchema = z.object({
  anio: z.coerce.number(),
  pcs_mintic: z.coerce.number(),
  pcs_et: z.coerce.number(),
  tablets_students: z.coerce.number(),
  tablets_students_et: z.coerce.number(),
  tablets_teachers: z.coerce.number(),
})

const responseSchema = z.array(rowSchema)

function useRaw(options?: Pick<QueryObserverOptions, 'enabled'>) {
  return useQuery({
    queryKey: [COMPUTERS_FOR_EDU_MANIFEST.queryKey, 'raw'],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.resource(
        COMPUTERS_FOR_EDU_MANIFEST.resourceId,
        COMPUTERS_FOR_EDU_MANIFEST.query,
        { signal }
      )
      return responseSchema.parse(raw)
    },
    staleTime: COMPUTERS_FOR_EDU_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })
}

export function useComputersForEduByYear(options?: Pick<QueryObserverOptions, 'enabled'>): MultiSeriesResult {
  const query = useRaw(options)
  const currentYear = new Date().getFullYear()

  const data = useMemo(() => {
    if (!query.data) return undefined

    return query.data
      .sort((a, b) => a.anio - b.anio)
      .map((row) => ({
        ts: new Date(row.anio, 0, 1).getTime(),
        label: String(row.anio),
        isPartial: row.anio === currentYear,
        pcs: row.pcs_mintic + row.pcs_et,
        tabletsStudents: row.tablets_students + row.tablets_students_et,
        tabletsTeachers: row.tablets_teachers,
      }))
  }, [query.data, currentYear])

  return {
    id: COMPUTERS_FOR_EDU_MANIFEST.id,
    label: COMPUTERS_FOR_EDU_MANIFEST.label,
    description: COMPUTERS_FOR_EDU_MANIFEST.description,
    question: COMPUTERS_FOR_EDU_MANIFEST.question,
    source: COMPUTERS_FOR_EDU_MANIFEST.source,
    sourceUrl: COMPUTERS_FOR_EDU_MANIFEST.sourceUrl,
    unit: COMPUTERS_FOR_EDU_MANIFEST.unit,
    positiveDirection: COMPUTERS_FOR_EDU_MANIFEST.positiveDirection,
    data,
    isLoading: query.isPending,
    error: query.error,
    dataUpdatedAt: query.dataUpdatedAt,
  }
}
