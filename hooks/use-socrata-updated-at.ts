import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { socrataApi } from '@/lib/api-client'

const socrataViewSchema = z
  .object({ rowsUpdatedAt: z.number() })
  .transform((v) => v.rowsUpdatedAt * 1000)

/** Returns the dataset's `rowsUpdatedAt` as a millisecond timestamp, or undefined while loading. */
export function useSocrataUpdatedAt(
  resourceId: string,
  cacheTTL: number,
  options?: Pick<QueryObserverOptions, 'enabled'>
): number | undefined {
  const { data } = useQuery({
    queryKey: ['socrata-view', resourceId],
    queryFn: async ({ signal }) => {
      const raw = await socrataApi.view(resourceId, { signal })
      return socrataViewSchema.parse(raw)
    },
    staleTime: cacheTTL * 1000,
    enabled: options ? Boolean(options.enabled) : true,
  })

  return data
}
