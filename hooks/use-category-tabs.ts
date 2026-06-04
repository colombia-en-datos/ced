import { useCallback, useMemo } from 'react'

type CategoryWithItems = {
  id: string
  items: { data: { id: string } }[]
}

export function useCategoryTabs(setActiveTab: (tab: string) => void, categories: CategoryWithItems[]) {
  const indicatorToCategory = useMemo(() => {
    const map: Record<string, string> = {}
    for (const cat of categories) {
      for (const item of cat.items) {
        map[item.data.id] = cat.id
      }
    }
    return map
  }, [categories])

  const handleIndicatorClick = useCallback(
    (indicatorId: string) => {
      const categoryId = indicatorToCategory[indicatorId]
      if (categoryId) {
        setActiveTab(categoryId)
        requestAnimationFrame(() => {
          const el = document.getElementById(`chart-${indicatorId}`)
          if (!el) return
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el.classList.remove('animate-ring-pulse')
          void el.offsetWidth
          el.classList.add('animate-ring-pulse')
          el.addEventListener('animationend', () => el.classList.remove('animate-ring-pulse'), { once: true })
        })
      }
    },
    [indicatorToCategory, setActiveTab]
  )

  return { handleIndicatorClick }
}
