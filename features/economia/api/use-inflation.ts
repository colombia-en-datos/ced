import { INFLATION_MANIFEST } from '@/data/economy'
import { createBanrepIndicator } from '@/lib/create-banrep-indicator'

export const { useRaw: useInflation, useByMonth: useInflationByMonth } =
  createBanrepIndicator(INFLATION_MANIFEST)
