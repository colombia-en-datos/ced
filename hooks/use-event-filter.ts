import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { EventGroup } from '@/data/events'

type EventFilterState = {
  enabledEvents: Set<string>
  toggleEvent: (label: string) => void
  toggleGroup: (group: EventGroup) => void
}

export const useEventFilter = create<EventFilterState>()(
  persist(
    (set) => ({
      enabledEvents: new Set<string>(),
      toggleEvent: (label) =>
        set((s) => {
          const next = new Set(s.enabledEvents)
          if (next.has(label)) {
            next.delete(label)
          } else {
            next.add(label)
          }
          return { enabledEvents: next }
        }),
      toggleGroup: (group) =>
        set((s) => {
          const next = new Set(s.enabledEvents)
          const allEnabled = group.events.every((e) => next.has(e.label))
          for (const e of group.events) {
            if (allEnabled) {
              next.delete(e.label)
            } else {
              next.add(e.label)
            }
          }
          return { enabledEvents: next }
        }),
    }),
    {
      name: 'ced-event-filter',
      storage: {
        getItem: (name) => {
          const raw = localStorage.getItem(name)
          if (!raw) return null
          const parsed = JSON.parse(raw)
          if (parsed?.state?.enabledEvents) {
            parsed.state.enabledEvents = new Set(parsed.state.enabledEvents)
          }
          return parsed
        },
        setItem: (name, value) => {
          const serialized = {
            ...value,
            state: {
              ...value.state,
              enabledEvents: [...value.state.enabledEvents],
            },
          }
          localStorage.setItem(name, JSON.stringify(serialized))
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
)
