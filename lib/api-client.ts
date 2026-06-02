import { toast } from 'sonner'
import { env } from '@/config/env'

type ApiOptions = {
  params?: Record<string, string | number | boolean | undefined | null>
  headers?: Record<string, string>
  signal?: AbortSignal
}

function buildUrlWithParams(
  url: string,
  params?: ApiOptions['params']
): string {
  if (!params) return url
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value))
    }
  }
  const qs = searchParams.toString()
  return qs ? `${url}?${qs}` : url
}

async function apiRequest<T>(
  url: string,
  options: ApiOptions = {}
): Promise<T> {
  const { params, headers = {}, signal } = options
  const fullUrl = buildUrlWithParams(url, params)

  const response = await fetch(fullUrl, {
    headers: {
      Accept: 'application/json',
      ...headers,
    },
    signal,
  })

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`
    toast.error(`Error fetching data: ${message}`)
    throw new Error(`Api failed: ${message} — ${fullUrl}`)
  }

  return response.json()
}

/** Api from datos.gov.co Socrata API. Pass the resource ID and optional SoQL query string. */
export function socrataApi<T = Record<string, string>[]>(
  resourceId: string,
  query?: string,
  options?: ApiOptions
): Promise<T> {
  const base = `https://www.datos.gov.co/resource/${resourceId}.json`
  const url = query ? `${base}?${query}` : base

  return apiRequest<T>(url, {
    ...options,
    headers: {
      ...options?.headers,
      ...(env.SOCRATA_TOKEN ? { 'X-App-Token': env.SOCRATA_TOKEN } : {}),
    },
  })
}

/** Api a World Bank indicator for Colombia. Response data is at index [1]. */
export async function worldBankApi<T>(
  indicator: string,
  options?: ApiOptions
): Promise<T[]> {
  const url = `https://api.worldbank.org/v2/country/CO/indicator/${indicator}`
  const data = await apiRequest<[unknown, T[]]>(url, {
    ...options,
    params: { format: 'json', per_page: '100', ...options?.params },
  })
  return data[1]
}

/** Api JSON through the CORS proxy (for DANE endpoints that block browser requests). */
export function proxyApi<T>(
  targetUrl: string,
  options?: ApiOptions
): Promise<T> {
  if (!env.PROXY_URL) {
    throw new Error(
      'NEXT_PUBLIC_PROXY_URL is not configured — needed for DANE endpoints'
    )
  }
  return apiRequest<T>(env.PROXY_URL, {
    ...options,
    params: { url: targetUrl, ...options?.params },
  })
}
