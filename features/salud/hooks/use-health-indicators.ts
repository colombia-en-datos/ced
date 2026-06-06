import { useEffect, useMemo, useState } from 'react'
import type { CategoryChartItem } from '@/components/category-tabs'
import { HEALTH_CATEGORIES, type HealthIndicators } from '@/data/health'
import type { MultiSeriesResult } from '@/data/types'
import type { IndicatorResult } from '@/hooks/use-indicator-by-year'
import {
  useAcuteMalnutritionByYear,
  useDengueByYear,
  useGestationalSyphilisByYear,
  useIndependentProfessionalsByYear,
  useLifeExpectancyByYear,
  useLowBirthWeightByYear,
  useMalariaVivaxByYear,
  useMaternalMortalityByYear,
  useMortalityEdaByYear,
  useMortalityIraByYear,
  usePerinatalMortalityByYear,
  useSevereMaternalMorbidityByYear,
  useSuicideAttemptByYear,
  useTuberculosisByYear,
  useVihSidaByYear,
} from '../api/indicators'
import { useHealthProvidersByYear } from '../api/use-health-providers'
import { useHealthWorkforceByYear } from '../api/use-health-workforce'
import { useHospitalCapacityByYear } from '../api/use-hospital-capacity'
import { useSocialProtectionByYear } from '../api/use-social-protection'

export function useHealthIndicators(activeCategory: string) {
  const [secondWaveEnabled, setSecondWaveEnabled] = useState(false)

  const activeIds = useMemo(
    () => new Set(HEALTH_CATEGORIES.find((c) => c.id === activeCategory)?.items.map((item) => item.id) ?? []),
    [activeCategory]
  )

  const on = (id: `${HealthIndicators}`) => ({
    enabled: activeIds.has(id as HealthIndicators) || secondWaveEnabled,
  })

  const indicatorById: Record<string, IndicatorResult> = {
    independent_professionals: useIndependentProfessionalsByYear(on('independent_professionals')),
    life_expectancy: useLifeExpectancyByYear(on('life_expectancy')),
    dengue: useDengueByYear(on('dengue')),
    tuberculosis: useTuberculosisByYear(on('tuberculosis')),
    malaria_vivax: useMalariaVivaxByYear(on('malaria_vivax')),
    vih_sida: useVihSidaByYear(on('vih_sida')),
    gestational_syphilis: useGestationalSyphilisByYear(on('gestational_syphilis')),
    maternal_mortality: useMaternalMortalityByYear(on('maternal_mortality')),
    perinatal_mortality: usePerinatalMortalityByYear(on('perinatal_mortality')),
    mortality_eda: useMortalityEdaByYear(on('mortality_eda')),
    mortality_ira: useMortalityIraByYear(on('mortality_ira')),
    low_birth_weight: useLowBirthWeightByYear(on('low_birth_weight')),
    severe_maternal_morbidity: useSevereMaternalMorbidityByYear(on('severe_maternal_morbidity')),
    acute_malnutrition: useAcuteMalnutritionByYear(on('acute_malnutrition')),
    suicide_attempt: useSuicideAttemptByYear(on('suicide_attempt')),
  }

  const multiById: Record<string, MultiSeriesResult> = {
    health_providers: useHealthProvidersByYear(on('health_providers')),
    health_workforce: useHealthWorkforceByYear(on('health_workforce')),
    hospital_capacity: useHospitalCapacityByYear(on('hospital_capacity')),
    social_protection: useSocialProtectionByYear(on('social_protection')),
  }

  const activeLoaded = [...activeIds].every(
    (id) => indicatorById[id]?.data !== undefined || multiById[id]?.data !== undefined
  )

  useEffect(() => {
    if (activeLoaded && !secondWaveEnabled) {
      setSecondWaveEnabled(true)
    }
  }, [activeLoaded, secondWaveEnabled])

  const categories = HEALTH_CATEGORIES.map((cat) => ({
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
