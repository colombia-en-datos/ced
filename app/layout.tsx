'use client'

import { Geist_Mono, IBM_Plex_Sans } from 'next/font/google'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import './globals.css'
import { AppProvider } from './provider'

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn('antialiased', fontMono.variable, 'font-sans', ibmPlexSans.variable)}
    >
      <head>
        <title>Colombia en Datos</title>
      </head>

      <body>
        <AppProvider>
          <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
              <SiteHeader />
              <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">{children}</div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </AppProvider>
      </body>
    </html>
  )
}
