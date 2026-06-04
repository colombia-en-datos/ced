import z from 'zod'
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
})

export type IndicatorManifest = z.infer<typeof indicatorManifest>

export type MultiSeriesResult = {
  id: string
  label: string
  description: string
  source: string
  sourceUrl: string
  unit: string
  positiveDirection: 'up' | 'down'
  data: Record<string, unknown>[] | undefined
  isLoading: boolean
  error: Error | null
  dataUpdatedAt: number
}
