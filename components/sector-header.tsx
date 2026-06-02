'use client'

import { IconInfoCircle } from '@tabler/icons-react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useRateView } from '@/hooks/use-rate-view'

type SectorHeaderProps = {
  title: string
  subtitle?: string
  hasRateToggle?: boolean
}

export function SectorHeader({
  title,
  subtitle,
  hasRateToggle,
}: SectorHeaderProps) {
  const { showRate, toggleRate } = useRateView()

  return (
    <div className="flex items-center justify-between px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {hasRateToggle && (
        <div className="flex items-center gap-2">
          <Switch
            id="rate-view"
            size="sm"
            checked={showRate}
            onCheckedChange={toggleRate}
          />
          <Label htmlFor="rate-view" className="text-sm text-muted-foreground">
            Tasa por 100k hab.
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconInfoCircle className="size-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                Los valores absolutos muestran el total reportado. La tasa por
                100k normaliza por población, permitiendo comparar entre
                períodos con diferente tamaño poblacional.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  )
}
