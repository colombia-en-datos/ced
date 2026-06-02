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
  children: ReactNode
}

export function IndicatorChartCard({
  title,
  subtitle,
  source,
  sourceUrl,
  children,
}: IndicatorChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="justify-end">
        <SourceBadge source={source} sourceUrl={sourceUrl} variant="inline" />
      </CardFooter>
    </Card>
  )
}
