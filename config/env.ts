import * as z from 'zod'

export const isDev = process.env.NODE_ENV !== 'production'

const EnvSchema = z.object({
  SOCRATA_TOKEN: z.string().optional(),
  PROXY_URL: z.string().optional(),
})

const parsedEnv = EnvSchema.safeParse({
  SOCRATA_TOKEN: process.env.NEXT_PUBLIC_SOCRATA_TOKEN || undefined,
  PROXY_URL: process.env.NEXT_PUBLIC_PROXY_URL || undefined,
})

if (!parsedEnv.success) {
  throw new Error(
    `Invalid env:\n${Object.entries(parsedEnv.error.flatten().fieldErrors)
      .map(([k, v]) => `  - ${k}: ${v}`)
      .join('\n')}`
  )
}

export const env = parsedEnv.data
