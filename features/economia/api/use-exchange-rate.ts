import { EXCHANGE_RATE_MANIFEST } from '@/data/economy'
import { createBanrepIndicator } from '@/lib/create-banrep-indicator'

export const { useRaw: useExchangeRate, useByDay: useExchangeRateByDay } =
  createBanrepIndicator(EXCHANGE_RATE_MANIFEST)
