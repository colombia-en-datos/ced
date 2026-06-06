const rtf = new Intl.RelativeTimeFormat('es-CO', { numeric: 'auto' })

const DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: 'seconds' },
  { amount: 60, unit: 'minutes' },
  { amount: 24, unit: 'hours' },
  { amount: 30, unit: 'days' },
  { amount: 12, unit: 'months' },
  { amount: Number.POSITIVE_INFINITY, unit: 'years' },
]

export function formatRelativeTime(timestamp: number): string {
  let delta = (timestamp - Date.now()) / 1000

  for (const { amount, unit } of DIVISIONS) {
    if (Math.abs(delta) < amount) {
      return rtf.format(Math.round(delta), unit)
    }
    delta /= amount
  }
  return ''
}

export function formatNumber(value: number, decimals?: number): string {
  return value.toLocaleString('es-CO', {
    maximumFractionDigits: decimals ?? 0,
  })
}

/** Compact format for chart Y-axis ticks: 1.200.000 → "1,2M", 45.000 → "45K" */
export function formatCompact(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1e6) return `${(value / 1e6).toLocaleString('es-CO', { maximumFractionDigits: 1 })}M`
  if (abs >= 1e3) return `${(value / 1e3).toLocaleString('es-CO', { maximumFractionDigits: 0 })}K`
  return value.toLocaleString('es-CO', { maximumFractionDigits: 0 })
}
