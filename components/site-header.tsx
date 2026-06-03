'use client'

import { IconInfoCircle } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { InfoTip } from '@/components/info-tip'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Switch } from '@/components/ui/switch'
import { getSectorBySlug } from '@/config/sectors'
import { useRateView } from '@/hooks/use-rate-view'

function useCurrentSector() {
  const pathname = usePathname()
  const segment = pathname.split('/').filter(Boolean)[0]
  return segment ? (getSectorBySlug(segment) ?? null) : null
}

export function SiteHeader() {
  const sector = useCurrentSector()
  const { showRate, toggleRate } = useRateView()

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              {sector ? (
                <BreadcrumbLink asChild>
                  <Link href="/">Inicio</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>Inicio</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {sector && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{sector.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Switch id="rate-view" size="sm" checked={showRate} onCheckedChange={toggleRate} />
          <Label htmlFor="rate-view" className="hidden text-sm text-muted-foreground sm:inline">
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
      </div>
    </header>
  )
}
