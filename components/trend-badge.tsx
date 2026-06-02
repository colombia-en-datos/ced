import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatNumber } from '@/utils/format'

type TrendBadgeProps = {
  delta: number
  positiveDirection: 'up' | 'down'
  className?: string
}

export function TrendBadge({
  delta,
  positiveDirection,
  className,
}: TrendBadgeProps) {
  const isPositive =
    (positiveDirection === 'down' && delta < 0) ||
    (positiveDirection === 'up' && delta > 0)

  const TrendIcon = delta >= 0 ? IconTrendingUp : IconTrendingDown

  return (
    <Badge
      variant="outline"
      className={cn(
        'border-transparent tabular-nums',
        isPositive
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          : 'bg-red-500/10 text-red-600 dark:text-red-400',
        className
      )}
    >
      <TrendIcon />
      {delta > 0 ? '+' : ''}
      {formatNumber(delta, 1)}%
    </Badge>
  )
}
