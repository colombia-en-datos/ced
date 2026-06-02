import { experimental_createQueryPersister, type PersistedQuery } from '@tanstack/query-persist-client-core'
import type { DefaultOptions } from '@tanstack/react-query'
import { idbStorage } from '@/lib/idb-storage'
import pkg from '@/package.json'

export const persister = experimental_createQueryPersister<PersistedQuery>({
  storage: typeof window !== 'undefined' ? idbStorage : undefined,
  prefix: 'ced',
  buster: pkg.version,
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days (matches longest TTL)
  serialize: (persistedQuery) => persistedQuery,
  deserialize: (cached) => cached,
})

export const queryConfig = {
  queries: {
    // throwOnError: true,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 30, // 30 min in memory; persisted data survives independently
    persister: persister.persisterFn,
  },
} satisfies DefaultOptions
