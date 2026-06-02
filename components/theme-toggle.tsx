'use client'

import { IconMoon, IconSun } from '@tabler/icons-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { SidebarMenuButton } from '@/components/ui/sidebar'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <SidebarMenuButton onClick={() => setTheme(isDark ? 'light' : 'dark')}>
      {isDark ? <IconSun /> : <IconMoon />}
      {isDark ? 'Modo claro' : 'Modo oscuro'}
    </SidebarMenuButton>
  )
}
