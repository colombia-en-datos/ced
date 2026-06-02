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
    <CardHeader>
      <div className="flex items-center gap-2">
        <CardTitle>{title}</CardTitle>
        {children}
      </div>
      {subtitle && <CardDescription>{subtitle}</CardDescription>}
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
    <CardFooter className="justify-end">
      <SourceBadge source={source} sourceUrl={sourceUrl} variant="inline" />
    </CardFooter>
  )
}
