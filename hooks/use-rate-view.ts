import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type RateViewState = {
  showRate: boolean
  toggleRate: () => void
}

export const useRateView = create<RateViewState>()(
  persist(
    (set) => ({
      showRate: false,
      toggleRate: () => set((s) => ({ showRate: !s.showRate })),
    }),
    { name: 'ced-rate-view' }
  )
)
