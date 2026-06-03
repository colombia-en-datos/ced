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
  useOccupationRateByMonth,
  usePolicyRateByDay,
  useRemittancesByMonth,
  useUnemploymentByMonth,
} from '../api/indicators'

export function useEconomyIndicators(activeCategory: string) {
  const [secondWaveEnabled, setSecondWaveEnabled] = useState(false)

  const activeIds = useMemo(
    () =>
      new Set(
        (ECONOMY_CATEGORIES.find((c) => c.id === activeCategory)?.indicators as string[] | undefined) ?? []
      ),
    [activeCategory]
  )

  const on = (id: `${EconomyIndicators}`) => ({
    enabled: activeIds.has(id) || secondWaveEnabled,
  })

  const byId: Record<string, IndicatorResult> = {
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
    data: cat.indicators.map((id) => byId[id]),
  }))

  return { allIndicators, categories }
}
