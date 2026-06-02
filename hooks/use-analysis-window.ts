import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const CURRENT_YEAR = new Date().getFullYear()
const MIN_WINDOW = 8
const DEFAULT_FROM = 1985
const DEFAULT_TO = CURRENT_YEAR

export { MIN_WINDOW }

type AnalysisWindowState = {
  from: number
  to: number
  setRange: (from: number, to: number) => void
  reset: () => void
}

export const useAnalysisWindow = create<AnalysisWindowState>()(
  persist(
    (set) => ({
      from: DEFAULT_FROM,
      to: DEFAULT_TO,
      setRange: (from, to) => {
        const span = to - from
        if (span >= MIN_WINDOW) {
          set({ from, to })
        }
      },
      reset: () => set({ from: DEFAULT_FROM, to: DEFAULT_TO }),
    }),
    { name: 'ced-analysis-window' }
  )
)
