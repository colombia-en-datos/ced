import { IconExternalLink } from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge'

type SourceBadgeProps = {
  source: string
  sourceUrl: string
  variant?: 'inline' | 'badge'
}

export function SourceBadge({ source, sourceUrl, variant = 'badge' }: SourceBadgeProps) {
  if (variant === 'inline') {
    return (
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
      >
        {source}
        <IconExternalLink className="size-3" />
      </a>
    )
  }

  return (
    <Badge variant="outline" asChild>
      <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
        {source}
        <IconExternalLink className="size-3" />
      </a>
    </Badge>
  )
}
