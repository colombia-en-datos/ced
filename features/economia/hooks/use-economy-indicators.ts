import { useEffect, useMemo, useState } from 'react'
import type { CategoryChartItem } from '@/components/category-tabs'
import { ECONOMY_CATEGORIES, type EconomyIndicators } from '@/data/economy'
import type { MultiSeriesResult } from '@/data/types'
import type { IndicatorResult } from '@/hooks/use-indicator-by-year'
import {
  useColcapByDay,
  useExchangeRateByDay,
  useExternalDebtByMonth,
  useForeignInvestmentByYear,
  useGdpGrowthByYear,
  useInflationByMonth,
  useMinimumWageByYear,
  useNewHousingPriceByMonth,
  useOccupationRateByMonth,
  usePolicyRateByDay,
  useRemittancesByMonth,
  useUnemploymentByMonth,
  useUsedHousingPriceByMonth,
} from '../api/indicators'
import { useBudgetByTypeByYear } from '../api/use-budget-by-type'
import { useBudgetInvestmentByYear } from '../api/use-budget-investment'
import { useRealMinimumWageByYear } from '../api/use-real-minimum-wage'

export function useEconomyIndicators(activeCategory: string) {
  const [secondWaveEnabled, setSecondWaveEnabled] = useState(false)

  const activeIds = useMemo(
    () =>
      new Set(ECONOMY_CATEGORIES.find((c) => c.id === activeCategory)?.items.map((item) => item.id) ?? []),
    [activeCategory]
  )

  const on = (id: `${EconomyIndicators}`) => ({
    enabled: activeIds.has(id as EconomyIndicators) || secondWaveEnabled,
  })

  const indicatorById: Record<string, IndicatorResult> = {
    gdp_growth: useGdpGrowthByYear(on('gdp_growth')),
    inflation: useInflationByMonth(on('inflation')),
    exchange_rate: useExchangeRateByDay(on('exchange_rate')),
    remittances: useRemittancesByMonth(on('remittances')),
    foreign_investment: useForeignInvestmentByYear(on('foreign_investment')),
    unemployment: useUnemploymentByMonth(on('unemployment')),
    occupation_rate: useOccupationRateByMonth(on('occupation_rate')),
    policy_rate: usePolicyRateByDay(on('policy_rate')),
    colcap: useColcapByDay(on('colcap')),
    external_debt: useExternalDebtByMonth(on('external_debt')),
    minimum_wage: useMinimumWageByYear(on('minimum_wage')),
    real_minimum_wage: useRealMinimumWageByYear(on('real_minimum_wage')),
    new_housing_price: useNewHousingPriceByMonth(on('new_housing_price')),
    used_housing_price: useUsedHousingPriceByMonth(on('used_housing_price')),
  }

  const multiById: Record<string, MultiSeriesResult> = {
    budget_by_type: useBudgetByTypeByYear(on('budget_by_type')),
    budget_investment: useBudgetInvestmentByYear(on('budget_investment')),
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

  const categories = ECONOMY_CATEGORIES.map((cat) => ({
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
