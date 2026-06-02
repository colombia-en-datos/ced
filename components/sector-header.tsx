import { formatRelativeTime } from '@/utils/format'

type SectorHeaderProps = {
  title: string
  dataUpdatedAt?: number
}

export function SectorHeader({ title, dataUpdatedAt }: SectorHeaderProps) {
  return (
    <div className="flex flex-col gap-2 px-4 lg:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <div className="flex flex-wrap items-center gap-2">
        {dataUpdatedAt ? (
          <span className="text-sm text-muted-foreground">
            Actualizado {formatRelativeTime(dataUpdatedAt)}
          </span>
        ) : null}
      </div>
    </div>
  )
}
