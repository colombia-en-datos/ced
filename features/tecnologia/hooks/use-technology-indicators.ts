import { useEffect, useMemo, useState } from 'react'
import type { CategoryChartItem } from '@/components/category-tabs'
import { TECHNOLOGY_CATEGORIES, type TechnologyIndicators } from '@/data/technology'
import type { MultiSeriesResult } from '@/data/types'
import type { IndicatorResult } from '@/hooks/use-indicator-by-year'
import {
  useCyberIncidentsByYear,
  useHighTechExportsByYear,
  useIctServiceExportsByYear,
  useInternetUsersByYear,
  useRdFundingByYear,
  useRdSpendingByYear,
  useScientificArticlesByYear,
} from '../api/indicators'
import { useComputersForEduByYear } from '../api/use-computers-for-edu'
import { useCyberIncidentsByTypeByYear } from '../api/use-cyber-incidents-by-type'
import { useFixedInternetByYear } from '../api/use-fixed-internet'
import { useMobileInternetByYear } from '../api/use-mobile-internet'
import { useMobileSubscribersByYear } from '../api/use-mobile-subscribers'
import { useResearchGroupsByYear } from '../api/use-research-groups'
import { useResearchersByYear } from '../api/use-researchers'

export function useTechnologyIndicators(activeCategory: string) {
  const [secondWaveEnabled, setSecondWaveEnabled] = useState(false)

  const activeIds = useMemo(
    () =>
      new Set(TECHNOLOGY_CATEGORIES.find((c) => c.id === activeCategory)?.items.map((item) => item.id) ?? []),
    [activeCategory]
  )

  const on = (id: `${TechnologyIndicators}`) => ({
    enabled: activeIds.has(id as TechnologyIndicators) || secondWaveEnabled,
  })

  const indicatorById: Record<string, IndicatorResult> = {
    internet_users: useInternetUsersByYear(on('internet_users')),
    cyber_incidents: useCyberIncidentsByYear(on('cyber_incidents')),
    rd_funding: useRdFundingByYear(on('rd_funding')),
    rd_spending: useRdSpendingByYear(on('rd_spending')),
    scientific_articles: useScientificArticlesByYear(on('scientific_articles')),
    hightech_exports: useHighTechExportsByYear(on('hightech_exports')),
    ict_service_exports: useIctServiceExportsByYear(on('ict_service_exports')),
  }

  const multiById: Record<string, MultiSeriesResult> = {
    mobile_subscribers: useMobileSubscribersByYear(on('mobile_subscribers')),
    mobile_internet: useMobileInternetByYear(on('mobile_internet')),
    fixed_internet: useFixedInternetByYear(on('fixed_internet')),
    computers_for_edu: useComputersForEduByYear(on('computers_for_edu')),
    cyber_incidents_by_type: useCyberIncidentsByTypeByYear(on('cyber_incidents_by_type')),
    research_groups: useResearchGroupsByYear(on('research_groups')),
    researchers: useResearchersByYear(on('researchers')),
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

  const categories = TECHNOLOGY_CATEGORIES.map((cat) => ({
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
