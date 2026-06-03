import { useEffect, useMemo, useState } from 'react'
import { ECONOMY_CATEGORIES, EconomyIndicators } from '@/data/economy'
import { useExchangeRateByDay } from '@/features/economia/api/use-exchange-rate'
import { useGdpGrowthByYear } from '@/features/economia/api/use-gdp-growth'
import { useInflationByMonth } from '@/features/economia/api/use-inflation'
import type { IndicatorResult } from '@/hooks/use-indicator-by-year'

export function useEconomyIndicators(activeCategory: string) {
  const [secondWaveEnabled, setSecondWaveEnabled] = useState(false)

  const activeIds = useMemo(
    () =>
      new Set(
        (ECONOMY_CATEGORIES.find((c) => c.id === activeCategory)?.indicators as string[] | undefined) ?? []
      ),
    [activeCategory]
  )

  const gdpGrowth = useGdpGrowthByYear({
    enabled: activeIds.has(EconomyIndicators.GdpGrowth) || secondWaveEnabled,
  })
  const inflation = useInflationByMonth({
    enabled: activeIds.has(EconomyIndicators.Inflation) || secondWaveEnabled,
  })
  const exchangeRate = useExchangeRateByDay({
    enabled: activeIds.has(EconomyIndicators.ExchangeRate) || secondWaveEnabled,
  })

  const byId: Record<string, IndicatorResult> = {
    [EconomyIndicators.GdpGrowth]: gdpGrowth,
    [EconomyIndicators.Inflation]: inflation,
    [EconomyIndicators.ExchangeRate]: exchangeRate,
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
