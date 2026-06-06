import { useEffect, useMemo, useState } from 'react'
import type { CategoryChartItem } from '@/components/category-tabs'
import { EDUCATION_CATEGORIES, type EducationIndicators } from '@/data/education'
import type { MultiSeriesResult } from '@/data/types'
import type { IndicatorResult } from '@/hooks/use-indicator-by-year'
import {
  useDropoutByYear,
  useEnrollmentByYear,
  useHigherEdEnrollmentByYear,
  useNetCoverageByYear,
  useOfficialTeachersByYear,
  useSchoolsByYear,
} from '../api/indicators'
import { useGraduatesByYear } from '../api/use-graduates'
import { useSaber11ByYear } from '../api/use-saber11'

export function useEducationIndicators(activeCategory: string) {
  const [secondWaveEnabled, setSecondWaveEnabled] = useState(false)

  const activeIds = useMemo(
    () =>
      new Set(EDUCATION_CATEGORIES.find((c) => c.id === activeCategory)?.items.map((item) => item.id) ?? []),
    [activeCategory]
  )

  const on = (id: `${EducationIndicators}`) => ({
    enabled: activeIds.has(id as EducationIndicators) || secondWaveEnabled,
  })

  const indicatorById: Record<string, IndicatorResult> = {
    enrollment: useEnrollmentByYear(on('enrollment')),
    official_teachers: useOfficialTeachersByYear(on('official_teachers')),
    schools: useSchoolsByYear(on('schools')),
    higher_ed_enrollment: useHigherEdEnrollmentByYear(on('higher_ed_enrollment')),
  }

  const multiById: Record<string, MultiSeriesResult> = {
    net_coverage: useNetCoverageByYear(on('net_coverage')),
    dropout: useDropoutByYear(on('dropout')),
    graduates: useGraduatesByYear(on('graduates')),
    saber_11: useSaber11ByYear(on('saber_11')),
  }

  const activeLoaded = [...activeIds].every(
    (id) => indicatorById[id]?.data !== undefined || multiById[id]?.data !== undefined
  )

  useEffect(() => {
    if (activeLoaded && !secondWaveEnabled) {
      setSecondWaveEnabled(true)
    }
  }, [activeLoaded, secondWaveEnabled])

  const categories = EDUCATION_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.map((item): CategoryChartItem => {
      if (item.type === 'indicator') {
        return { type: 'indicator', data: indicatorById[item.id] }
      }
      return { type: item.type, data: multiById[item.id], series: item.series }
    }),
  }))

  const allIndicators = Object.values(indicatorById)

  return { allIndicators, categories }
}
