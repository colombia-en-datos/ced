'use client'

import { omit } from 'es-toolkit'
import { BarChartCard } from '@/components/bar-chart-card'
import { IndicatorChart } from '@/components/indicator-chart'
import type { SeriesConfig } from '@/components/multi-line-chart'
import { MultiSeriesChart } from '@/components/multi-series-chart'
import { StackedAreaChartCard } from '@/components/stacked-area-chart-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Event } from '@/data/events'
import type { MultiSeriesResult } from '@/data/types'
import type { IndicatorResult } from '@/hooks/use-indicator-by-year'

export type CategoryChartItem =
  | { type: 'indicator'; data: IndicatorResult }
  | { type: 'multi-series'; data: MultiSeriesResult; series: SeriesConfig[] }
  | { type: 'bar-chart'; data: MultiSeriesResult; series: SeriesConfig[] }
  | { type: 'stacked-area'; data: MultiSeriesResult; series: SeriesConfig[] }

export type Category = {
  id: string
  label: string
  description: string
  items: CategoryChartItem[]
}

type CategoryTabsProps = {
  activeTab: string
  onTabChange: (tab: string) => void
  categories: Category[]
  eventsByYear: Map<number, Event[]>
}

function ChartItem({ item, eventsByYear }: { item: CategoryChartItem; eventsByYear: Map<number, Event[]> }) {
  switch (item.type) {
    case 'indicator':
      return (
        <IndicatorChart
          id={`chart-${item.data.id}`}
          eventsByYear={eventsByYear}
          {...omit(item.data, ['id'])}
        />
      )
    case 'multi-series':
      return <MultiSeriesChart result={item.data} series={item.series} eventsByYear={eventsByYear} />
    case 'bar-chart':
      return <BarChartCard result={item.data} series={item.series} eventsByYear={eventsByYear} />
    case 'stacked-area':
      return <StackedAreaChartCard result={item.data} series={item.series} eventsByYear={eventsByYear} />
  }
}

export function CategoryTabs({ activeTab, onTabChange, categories, eventsByYear }: CategoryTabsProps) {
  if (categories.length === 0) return null

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="px-4 lg:px-6">
      <TabsList variant="line" className="w-full justify-start overflow-x-auto scrollbar-none">
        {categories.map((cat) => (
          <TabsTrigger key={cat.id} value={cat.id}>
            {cat.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((cat) => (
        <TabsContent key={cat.id} value={cat.id}>
          <p className="mt-2 mb-4 text-sm text-muted-foreground">{cat.description}</p>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {cat.items.map((item) => (
              <ChartItem key={item.data.id} item={item} eventsByYear={eventsByYear} />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
