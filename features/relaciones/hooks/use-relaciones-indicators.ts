import { useEffect, useMemo, useState } from 'react'
import type { CategoryChartItem } from '@/components/category-tabs'
import { RELACIONES_CATEGORIES, type RelacionesIndicators } from '@/data/international-relations'
import type { MultiSeriesResult } from '@/data/types'
import type { IndicatorResult } from '@/hooks/use-indicator-by-year'
import {
  useConsularAssistanceByYear,
  useDiasporaByYear,
  useReturnMigrationByYear,
  useTreatiesByYear,
  useVisasIssuedByYear,
} from '../api/indicators'
import { useDetainedAbroadByYear } from '../api/use-detained-abroad'
import { useVenezuelaVisasByYear } from '../api/use-venezuela-visas'

export function useRelacionesIndicators(activeCategory: string) {
  const [secondWaveEnabled, setSecondWaveEnabled] = useState(false)

  const activeIds = useMemo(
    () =>
      new Set(RELACIONES_CATEGORIES.find((c) => c.id === activeCategory)?.items.map((item) => item.id) ?? []),
    [activeCategory]
  )

  const on = (id: `${RelacionesIndicators}`) => ({
    enabled: activeIds.has(id as RelacionesIndicators) || secondWaveEnabled,
  })

  const indicatorById: Record<string, IndicatorResult> = {
    visas_issued: useVisasIssuedByYear(on('visas_issued')),
    diaspora: useDiasporaByYear(on('diaspora')),
    return_migration: useReturnMigrationByYear(on('return_migration')),
    treaties: useTreatiesByYear(on('treaties')),
    consular_assistance: useConsularAssistanceByYear(on('consular_assistance')),
    detained_abroad: useDetainedAbroadByYear(on('detained_abroad')),
  }

  const multiById: Record<string, MultiSeriesResult> = {
    venezuela_visas: useVenezuelaVisasByYear(on('venezuela_visas')),
  }

  const activeLoaded = [...activeIds].every(
    (id) => indicatorById[id]?.data !== undefined || multiById[id]?.data !== undefined
  )

  useEffect(() => {
    if (activeLoaded && !secondWaveEnabled) {
      setSecondWaveEnabled(true)
    }
  }, [activeLoaded, secondWaveEnabled])

  const allIndicators = Object.values(indicatorById)

  const categories = RELACIONES_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.map((item): CategoryChartItem => {
      if (item.type === 'indicator') {
        return { type: 'indicator', data: indicatorById[item.id] }
      }
      return { type: item.type, data: multiById[item.id], series: item.series }
    }),
  }))

  return { allIndicators, categories }
}
