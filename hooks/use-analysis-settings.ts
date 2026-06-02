import { useAnalysisWindow } from '@/hooks/use-analysis-window'
import { useEventFilter } from '@/hooks/use-event-filter'
import { useRateView } from '@/hooks/use-rate-view'

export type AnalysisSettings = {
  showRate: boolean
  enabledEvents: Set<string>
  windowFrom: number
  windowTo: number
}

export function useAnalysisSettings(): AnalysisSettings {
  const showRate = useRateView((s) => s.showRate)
  const enabledEvents = useEventFilter((s) => s.enabledEvents)
  const windowFrom = useAnalysisWindow((s) => s.from)
  const windowTo = useAnalysisWindow((s) => s.to)

  return { showRate, enabledEvents, windowFrom, windowTo }
}
