import { Geist_Mono, IBM_Plex_Sans } from "next/font/google"
import { cn } from "@/lib/utils"
import "./globals.css"
import { AppProvider } from "./provider"

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        ibmPlexSans.variable
      )}
    >
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
