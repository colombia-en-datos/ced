'use client'

import { InfoTip } from '@/components/info-tip'
import { formatRelativeTime } from '@/utils/format'

type DataUpdatedAtProps = {
  timestamp: number
}

function formatAbsoluteDate(ms: number): string {
  return new Date(ms).toLocaleString('es-CO', {
    dateStyle: 'long',
    timeStyle: 'short',
  })
}

export function DataUpdatedAt({ timestamp }: DataUpdatedAtProps) {
  return (
    <span className="cursor-default text-xs text-muted-foreground">
      Datos actualizados{' '}
      <InfoTip content={formatAbsoluteDate(timestamp)}>
        <span className="underline decoration-dotted underline-offset-2">
          {formatRelativeTime(timestamp)}
        </span>
      </InfoTip>
    </span>
  )
}
