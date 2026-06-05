import z from 'zod'
import type { SeriesConfig } from '@/components/multi-line-chart'
import { Sector } from '@/config/sectors'

export const indicatorManifest = z.object({
  id: z.string(),
  sector: z.enum(Sector),
  label: z.string(),
  description: z.string(),
  source: z.string(),
  sourceUrl: z.url(),
  resourceId: z.string(),
  queryKey: z.string(),
  orderField: z.string().optional(),
  limit: z.number().optional(),
  unit: z.string(),
  cacheTTL: z.number(),
  positiveDirection: z.union([z.literal('up'), z.literal('down')]),
  active: z.boolean().default(true),
  query: z.string().optional(),
  question: z.string().optional(),
  formula: z.string().optional(),
  derivedSources: z.array(z.object({ label: z.string(), url: z.url() })).optional(),
})

export type IndicatorManifest = z.infer<typeof indicatorManifest>

export type SectorCategoryItem<T extends string> =
  | { type: 'indicator'; id: T }
  | { type: 'multi-series'; id: T; series: SeriesConfig[] }

export type SectorCategory<T extends string> = {
  id: string
  label: string
  description: string
  items: SectorCategoryItem<T>[]
}

export type MultiSeriesResult = {
  id: string
  label: string
  description: string
  question?: string
  source: string
  sourceUrl: string
  unit: string
  positiveDirection: 'up' | 'down'
  data: Record<string, unknown>[] | undefined
  isLoading: boolean
  error: Error | null
  dataUpdatedAt: number
}
