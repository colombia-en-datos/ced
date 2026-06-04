import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { EVENTS } from '@/data/events'
import type { IndicatorManifest } from '@/data/types'
import { useIndicatorByYear } from '@/hooks/use-indicator-by-year'
import { socrataApi } from '@/lib/api-client'

type CountRow = { date: Date; count: number }

export function createSocrataIndicator<T extends CountRow>(
  manifest: IndicatorManifest,
  rowSchema: z.ZodType<T>
) {
  const responseSchema = z.array(rowSchema)

  function useRaw(options?: Pick<QueryObserverOptions, 'enabled'>) {
    return useQuery({
      queryKey: [manifest.queryKey, 'raw'],
      queryFn: async ({ signal }) => {
        const params =
          manifest.query ??
          [
            manifest.orderField && `$order=${manifest.orderField} ASC`,
            manifest.limit && `$limit=${manifest.limit}`,
          ]
            .filter(Boolean)
            .join('&')
        const raw = await socrataApi.resource(manifest.resourceId, params || undefined, { signal })

        return responseSchema.parse(raw)
      },
      staleTime: manifest.cacheTTL * 1000,
      enabled: manifest.active !== false && Boolean(options?.enabled),
    })
  }

  function useByYear(options?: Pick<QueryObserverOptions, 'enabled'>) {
    return useIndicatorByYear(useRaw(options), manifest, EVENTS)
  }

  return { useRaw, useByYear }
}
