import {
  COLCAP_MANIFEST,
  EXCHANGE_RATE_MANIFEST,
  EXTERNAL_DEBT_MANIFEST,
  FOREIGN_INVESTMENT_MANIFEST,
  GDP_GROWTH_MANIFEST,
  INFLATION_MANIFEST,
  MINIMUM_WAGE_MANIFEST,
  OCCUPATION_RATE_MANIFEST,
  POLICY_RATE_MANIFEST,
  REMITTANCES_MANIFEST,
  UNEMPLOYMENT_MANIFEST,
} from '@/data/economy'
import { createBanrepIndicator } from '@/lib/create-banrep-indicator'

export const { useByYear: useGdpGrowthByYear } = createBanrepIndicator(GDP_GROWTH_MANIFEST)
export const { useByMonth: useInflationByMonth } = createBanrepIndicator(INFLATION_MANIFEST)
export const { useByDay: useExchangeRateByDay } = createBanrepIndicator(EXCHANGE_RATE_MANIFEST)
export const { useByMonth: useRemittancesByMonth } = createBanrepIndicator(REMITTANCES_MANIFEST)
export const { useByYear: useForeignInvestmentByYear } = createBanrepIndicator(FOREIGN_INVESTMENT_MANIFEST)
export const { useByMonth: useUnemploymentByMonth } = createBanrepIndicator(UNEMPLOYMENT_MANIFEST)
export const { useByMonth: useOccupationRateByMonth } = createBanrepIndicator(OCCUPATION_RATE_MANIFEST)
export const { useByDay: usePolicyRateByDay } = createBanrepIndicator(POLICY_RATE_MANIFEST)
export const { useByDay: useColcapByDay } = createBanrepIndicator(COLCAP_MANIFEST)
export const { useByMonth: useExternalDebtByMonth } = createBanrepIndicator(EXTERNAL_DEBT_MANIFEST)
export const { useByYear: useMinimumWageByYear } = createBanrepIndicator(MINIMUM_WAGE_MANIFEST)
