import { experimental_createQueryPersister } from "@tanstack/query-persist-client-core"
import type { DefaultOptions } from "@tanstack/react-query"

export const persister = experimental_createQueryPersister({
  storage: typeof window !== "undefined" ? localStorage : undefined,
  prefix: "ced",
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days (matches longest TTL)
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
