import { useMemo } from 'react'
import { EVENTS, type Event } from '@/data/events'
import { useAnalysisSettings } from '@/hooks/use-analysis-settings'

function groupEventsByYear(events: Event[]) {
  const byYear = new Map<number, Event[]>()
  for (const e of events) {
    const year = e.date.getFullYear()
    const list = byYear.get(year) ?? []
    list.push(e)
    byYear.set(year, list)
  }
  return byYear
}

export function useEventsByYear() {
  const { enabledEvents } = useAnalysisSettings()

  return useMemo(() => groupEventsByYear(EVENTS.filter((e) => enabledEvents.has(e.label))), [enabledEvents])
}
