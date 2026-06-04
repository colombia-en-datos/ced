import { useEffect, useMemo, useState } from 'react'
import { ECONOMY_CATEGORIES, type EconomyIndicators } from '@/data/economy'
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

  const byId: Record<`${EconomyIndicators}`, IndicatorResult> = {
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

  const activeLoaded = [...activeIds].every((id) => byId[id]?.data !== undefined)

  useEffect(() => {
    if (activeLoaded && !secondWaveEnabled) {
      setSecondWaveEnabled(true)
    }
  }, [activeLoaded, secondWaveEnabled])

  const allIndicators = Object.values(byId)

  const categories = ECONOMY_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.map((item) => ({ type: 'indicator' as const, data: byId[item.id] })),
  }))

  return { allIndicators, categories }
}
