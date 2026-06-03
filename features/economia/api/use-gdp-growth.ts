import { GDP_GROWTH_MANIFEST } from '@/data/economy'
import { createBanrepIndicator } from '@/lib/create-banrep-indicator'

export const { useRaw: useGdpGrowth, useByYear: useGdpGrowthByYear } =
  createBanrepIndicator(GDP_GROWTH_MANIFEST)
