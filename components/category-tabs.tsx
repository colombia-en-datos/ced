'use client'

import { omit } from 'es-toolkit'
import { IndicatorChart } from '@/components/indicator-chart'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Event } from '@/data/events'
import type { IndicatorResult } from '@/hooks/use-indicator-by-year'

type Category = {
  id: string
  label: string
  description: string
  data: IndicatorResult[]
}

type CategoryTabsProps = {
  activeTab: string
  onTabChange: (tab: string) => void
  categories: Category[]
  eventsByYear: Map<number, Event[]>
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
            {cat.data.map((indicator) => (
              <IndicatorChart
                key={indicator.id}
                id={`chart-${indicator.id}`}
                eventsByYear={eventsByYear}
                {...omit(indicator, ['id'])}
              />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
