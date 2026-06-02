'use client'

import {
  IconBuildingBank,
  IconCategory,
  IconDevices,
  IconGlobe,
  IconLeaf,
  IconMedicalCross,
  IconSchool,
  IconShieldLock,
  IconUsersGroup,
} from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type * as React from 'react'
import { Logo } from '@/components/logo'
import { NavMain } from '@/components/nav-main'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Sector, sectors } from '@/config/sectors'

const sectorIcons: Record<Sector, React.ReactNode> = {
  [Sector.Overview]: <IconCategory />,
  [Sector.Seguridad]: <IconShieldLock />,
  [Sector.Economia]: <IconBuildingBank />,
  [Sector.Educacion]: <IconSchool />,
  [Sector.Salud]: <IconMedicalCross />,
  [Sector.MedioAmbiente]: <IconLeaf />,
  [Sector.Social]: <IconUsersGroup />,
  [Sector.Tecnologia]: <IconDevices />,
  [Sector.Relaciones]: <IconGlobe />,
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const items = sectors.map((s) => ({
    title: s.title,
    url: s.url,
    icon: sectorIcons[s.slug],
    isActive: s.url === '/' ? pathname === '/' : pathname.startsWith(s.url),
  }))

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/">
                <Logo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
    </Sidebar>
  )
}
