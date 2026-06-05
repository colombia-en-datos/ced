import { useEffect, useMemo, useState } from 'react'
import type { CategoryChartItem } from '@/components/category-tabs'
import { ENVIRONMENT_CATEGORIES, type EnvironmentIndicators } from '@/data/environment'
import type { MultiSeriesResult } from '@/data/types'
import type { IndicatorResult } from '@/hooks/use-indicator-by-year'
import {
  useEnvironmentalCrimesByYear,
  useForestAreaByYear,
  useGhgEmissionsByYear,
  useMaxTemperatureByYear,
  usePm25PollutionByYear,
  useProtectedAreasByYear,
} from '../api/indicators'
import { useAirQualityByYear } from '../api/use-air-quality'
import { useGhgBySectorByYear } from '../api/use-ghg-by-sector'

export function useEnvironmentIndicators(activeCategory: string) {
  const [secondWaveEnabled, setSecondWaveEnabled] = useState(false)

  const activeIds = useMemo(
    () =>
      new Set(
        ENVIRONMENT_CATEGORIES.find((c) => c.id === activeCategory)?.items.map((item) => item.id) ?? []
      ),
    [activeCategory]
  )

  const on = (id: `${EnvironmentIndicators}`) => ({
    enabled: activeIds.has(id as EnvironmentIndicators) || secondWaveEnabled,
  })

  const indicatorById: Record<string, IndicatorResult> = {
    ghg_emissions: useGhgEmissionsByYear(on('ghg_emissions')),
    environmental_crimes: useEnvironmentalCrimesByYear(on('environmental_crimes')),
    forest_area: useForestAreaByYear(on('forest_area')),
    pm25_pollution: usePm25PollutionByYear(on('pm25_pollution')),
    protected_areas: useProtectedAreasByYear(on('protected_areas')),
    max_temperature: useMaxTemperatureByYear(on('max_temperature')),
  }

  const multiById: Record<string, MultiSeriesResult> = {
    ghg_by_sector: useGhgBySectorByYear(on('ghg_by_sector')),
    air_quality: useAirQualityByYear(on('air_quality')),
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

  const categories = ENVIRONMENT_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.map((item): CategoryChartItem => {
      if (item.type === 'indicator') {
        return { type: 'indicator', data: indicatorById[item.id] }
      }
      return { type: 'multi-series', data: multiById[item.id], series: item.series }
    }),
  }))

  return { allIndicators, categories }
}
