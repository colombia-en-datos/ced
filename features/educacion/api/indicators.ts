import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import * as z from 'zod'
import {
  BASIC_EDUCATION_MANIFEST,
  EducationIndicators,
  HIGHER_ED_ENROLLMENT_MANIFEST,
  OFFICIAL_TEACHERS_MANIFEST,
  SCHOOLS_MANIFEST,
} from '@/data/education'
import { EVENTS } from '@/data/events'
import type { MultiSeriesResult } from '@/data/types'
import { useYearlyIndicator, type YearPoint } from '@/hooks/use-indicator-by-year'
import { socrataApi } from '@/lib/api-client'
import { createSocrataIndicator } from '@/lib/create-socrata-indicator'

const rowSchema = z
  .object({
    ano: z.coerce.number(),
    departamento: z.string(),
    tasa_matriculacion_5_16: z.coerce.number(),
    cobertura_neta_transicion: z.coerce.number(),
    cobertura_neta_primaria: z.coerce.number(),
    cobertura_neta_secundaria: z.coerce.number(),
    cobertura_neta_media: z.coerce.number(),
    desercion_transicion: z.preprocess((v) => (v == null ? 0 : v), z.coerce.number()),
    desercion_primaria: z.coerce.number(),
    desercion_secundaria: z.coerce.number(),
    desercion_media: z.coerce.number(),
  })
  .transform((r) => ({
    year: r.ano,
    department: r.departamento,
    enrollmentRate: r.tasa_matriculacion_5_16,
    coverageTransicion: r.cobertura_neta_transicion,
    coveragePrimaria: r.cobertura_neta_primaria,
    coverageSecundaria: r.cobertura_neta_secundaria,
    coverageMedia: r.cobertura_neta_media,
    dropoutTransicion: r.desercion_transicion,
    dropoutPrimaria: r.desercion_primaria,
    dropoutSecundaria: r.desercion_secundaria,
    dropoutMedia: r.desercion_media,
  }))

type EducationRow = z.output<typeof rowSchema>

const responseSchema = z.array(rowSchema)

function useEducationRaw(options?: Pick<QueryObserverOptions, 'enabled'>) {
  return useQuery({
    queryKey: [BASIC_EDUCATION_MANIFEST.queryKey, 'raw'],
    queryFn: async ({ signal }) => {
      const query = `$order=${BASIC_EDUCATION_MANIFEST.orderField} ASC&$limit=${BASIC_EDUCATION_MANIFEST.limit}`
      const raw = await socrataApi.resource(BASIC_EDUCATION_MANIFEST.resourceId, query, { signal })
      return responseSchema.parse(raw)
    },
    staleTime: BASIC_EDUCATION_MANIFEST.cacheTTL * 1000,
    enabled: Boolean(options?.enabled),
  })
}

/** Average a field across all departments for each year. */
function aggregateNationally(rows: EducationRow[], field: keyof EducationRow): Map<number, number> {
  const sums = new Map<number, { total: number; count: number }>()
  for (const r of rows) {
    const val = r[field] as number
    const entry = sums.get(r.year) ?? { total: 0, count: 0 }
    entry.total += val
    entry.count += 1
    sums.set(r.year, entry)
  }
  const result = new Map<number, number>()
  for (const [year, { total, count }] of sums) {
    result.set(year, total / count)
  }
  return result
}

function toYearPoints(averages: Map<number, number>, currentYear: number): YearPoint[] {
  return Array.from(averages.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, value]) => ({
      year,
      ts: new Date(year, 0, 1).getTime(),
      label: String(year),
      total: value,
      rate: 0,
      isPartial: year === currentYear,
    }))
}

export function useEnrollmentByYear(options?: Pick<QueryObserverOptions, 'enabled'>) {
  const query = useEducationRaw(options)
  const currentYear = new Date().getFullYear()

  const allYearly = useMemo(() => {
    if (!query.data) return undefined
    return toYearPoints(aggregateNationally(query.data, 'enrollmentRate'), currentYear)
  }, [query.data, currentYear])

  return useYearlyIndicator(
    allYearly,
    { isLoading: query.isPending, error: query.error, dataUpdatedAt: query.dataUpdatedAt },
    {
      ...BASIC_EDUCATION_MANIFEST,
      id: `${BASIC_EDUCATION_MANIFEST.sector}_${EducationIndicators.Enrollment}`,
      label: 'Tasa de matriculación (5-16 años)',
      description:
        'Proporcion de poblacion entre 5 y 16 anos matriculada en el sistema educativo. Promedio nacional.',
    },
    EVENTS
  )
}

export type MultiSeriesPoint = {
  ts: number
  label: string
  isPartial: boolean
  transicion: number
  primaria: number
  secundaria: number
  media: number
}

export type { MultiSeriesResult } from '@/data/types'

function buildMultiSeries(
  rows: EducationRow[],
  fields: {
    transicion: keyof EducationRow
    primaria: keyof EducationRow
    secundaria: keyof EducationRow
    media: keyof EducationRow
  },
  currentYear: number
): MultiSeriesPoint[] {
  const transicionAvg = aggregateNationally(rows, fields.transicion)
  const primariaAvg = aggregateNationally(rows, fields.primaria)
  const secundariaAvg = aggregateNationally(rows, fields.secundaria)
  const mediaAvg = aggregateNationally(rows, fields.media)

  const years = [...transicionAvg.keys()].sort((a, b) => a - b)

  return years.map((year) => ({
    ts: new Date(year, 0, 1).getTime(),
    label: String(year),
    isPartial: year === currentYear,
    transicion: transicionAvg.get(year) ?? 0,
    primaria: primariaAvg.get(year) ?? 0,
    secundaria: secundariaAvg.get(year) ?? 0,
    media: mediaAvg.get(year) ?? 0,
  }))
}

export function useNetCoverageByYear(options?: Pick<QueryObserverOptions, 'enabled'>): MultiSeriesResult {
  const query = useEducationRaw(options)
  const currentYear = new Date().getFullYear()

  const data = useMemo(() => {
    if (!query.data) return undefined
    return buildMultiSeries(
      query.data,
      {
        transicion: 'coverageTransicion',
        primaria: 'coveragePrimaria',
        secundaria: 'coverageSecundaria',
        media: 'coverageMedia',
      },
      currentYear
    )
  }, [query.data, currentYear])

  return {
    id: `${BASIC_EDUCATION_MANIFEST.sector}_${EducationIndicators.NetCoverage}`,
    label: 'Cobertura neta por nivel',
    description:
      'Proporcion de estudiantes matriculados en el nivel educativo correspondiente a su edad. Promedio nacional.',
    source: BASIC_EDUCATION_MANIFEST.source,
    sourceUrl: BASIC_EDUCATION_MANIFEST.sourceUrl,
    unit: '%',
    positiveDirection: 'up',
    data,
    isLoading: query.isPending,
    error: query.error,
    dataUpdatedAt: query.dataUpdatedAt,
  }
}

export function useDropoutByYear(options?: Pick<QueryObserverOptions, 'enabled'>): MultiSeriesResult {
  const query = useEducationRaw(options)
  const currentYear = new Date().getFullYear()

  const data = useMemo(() => {
    if (!query.data) return undefined
    return buildMultiSeries(
      query.data,
      {
        transicion: 'dropoutTransicion',
        primaria: 'dropoutPrimaria',
        secundaria: 'dropoutSecundaria',
        media: 'dropoutMedia',
      },
      currentYear
    )
  }, [query.data, currentYear])

  return {
    id: `${BASIC_EDUCATION_MANIFEST.sector}_${EducationIndicators.Dropout}`,
    label: 'Deserción por nivel',
    description:
      'Proporcion de estudiantes que abandonan el sistema educativo antes de completar el nivel. Promedio nacional.',
    source: BASIC_EDUCATION_MANIFEST.source,
    sourceUrl: BASIC_EDUCATION_MANIFEST.sourceUrl,
    unit: '%',
    positiveDirection: 'down',
    data,
    isLoading: query.isPending,
    error: query.error,
    dataUpdatedAt: query.dataUpdatedAt,
  }
}

// ---------------------------------------------------------------------------
// Simple createSocrataIndicator hooks
// ---------------------------------------------------------------------------

const officialTeachersSchema = z
  .object({ anno_inf: z.coerce.number(), total: z.coerce.number() })
  .transform((r) => ({ date: new Date(r.anno_inf, 0, 1), count: r.total }))

export const { useRaw: useOfficialTeachers, useByYear: useOfficialTeachersByYear } = createSocrataIndicator(
  OFFICIAL_TEACHERS_MANIFEST,
  officialTeachersSchema
)

const schoolsSchema = z
  .object({ a_o: z.coerce.number(), total: z.coerce.number() })
  .transform((r) => ({ date: new Date(r.a_o, 0, 1), count: r.total }))

export const { useRaw: useSchools, useByYear: useSchoolsByYear } = createSocrataIndicator(
  SCHOOLS_MANIFEST,
  schoolsSchema
)

const higherEdEnrollmentSchema = z
  .object({ a_o: z.coerce.number(), total: z.coerce.number() })
  .transform((r) => ({ date: new Date(r.a_o, 0, 1), count: r.total }))

export const { useRaw: useHigherEdEnrollment, useByYear: useHigherEdEnrollmentByYear } =
  createSocrataIndicator(HIGHER_ED_ENROLLMENT_MANIFEST, higherEdEnrollmentSchema)
