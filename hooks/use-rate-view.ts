import { create } from 'zustand'

type RateViewState = {
  showRate: boolean
  toggleRate: () => void
}

export const useRateView = create<RateViewState>((set) => ({
  showRate: false,
  toggleRate: () => set((s) => ({ showRate: !s.showRate })),
}))
