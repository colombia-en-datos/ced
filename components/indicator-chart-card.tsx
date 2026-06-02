import type { ReactNode } from 'react'
import { SourceBadge } from '@/components/source-badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type IndicatorChartCardProps = {
  title: string
  subtitle?: string
  source: string
  sourceUrl: string
  headerAction?: ReactNode
  children: ReactNode
}

export function IndicatorChartCard({
  children,
}: Pick<IndicatorChartCardProps, 'children'>) {
  return <Card>{children}</Card>
}

export function IndicatorChartCardHeader({
  title,
  subtitle,
  children,
}: Pick<IndicatorChartCardProps, 'title' | 'subtitle'> & {
  children?: ReactNode
}) {
  return (
    <CardHeader className="border-b border-border/40 pb-4">
      <div className="flex items-center gap-2">
        <CardTitle className="text-lg font-semibold tracking-tight">
          {title}
        </CardTitle>
        {children}
      </div>
      {subtitle ? (
        <CardDescription className="font-mono text-xs tracking-wide text-muted-foreground/70">
          {subtitle}
        </CardDescription>
      ) : null}
    </CardHeader>
  )
}

export function IndicatorChartCardContent({
  children,
}: Pick<IndicatorChartCardProps, 'children'>) {
  return <CardContent>{children}</CardContent>
}

export function IndicatorChartCardFooter({
  source,
  sourceUrl,
}: Pick<IndicatorChartCardProps, 'source' | 'sourceUrl'>) {
  return (
    <CardFooter className="justify-end border-t border-border/40 pt-4">
      <SourceBadge source={source} sourceUrl={sourceUrl} variant="inline" />
    </CardFooter>
  )
}
