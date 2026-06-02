'use client'

import { IconInfoCircle } from '@tabler/icons-react'
import { InfoTip } from '@/components/info-tip'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useRateView } from '@/hooks/use-rate-view'

type SectorHeaderProps = {
  title: string
  subtitle?: string
  hasRateToggle?: boolean
}

export function SectorHeader({ title, subtitle, hasRateToggle }: SectorHeaderProps) {
  const { showRate, toggleRate } = useRateView()

  return (
    <div className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {hasRateToggle ? (
        <div className="flex shrink-0 items-center gap-2">
          <Switch id="rate-view" size="sm" checked={showRate} onCheckedChange={toggleRate} />
          <Label htmlFor="rate-view" className="text-sm text-muted-foreground">
            Tasa por 100k hab.
          </Label>
          <InfoTip
            content="Los valores absolutos muestran el total reportado. La tasa por
                100k normaliza por población, permitiendo comparar entre
                períodos con diferente tamaño poblacional."
          >
            <IconInfoCircle className="size-4 text-muted-foreground" />
          </InfoTip>
        </div>
      ) : null}
    </div>
  )
}
