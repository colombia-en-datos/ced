'use client'

import { IconCalendarStats, IconTimelineEvent } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { EVENT_GROUPS } from '@/data/events'
import { MIN_WINDOW, useAnalysisWindow } from '@/hooks/use-analysis-window'
import { useEventFilter } from '@/hooks/use-event-filter'

function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

function EventFilterSection() {
  const { enabledEvents, toggleEvent, toggleGroup } = useEventFilter()

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <IconTimelineEvent className="size-5 text-muted-foreground" />
        <div>
          <h2 className="text-base font-semibold">Eventos de política</h2>
          <p className="text-sm text-muted-foreground">
            Selecciona qué eventos de política pública mostrar como marcadores en las gráficas anuales. El
            número corresponde al marcador en las gráficas.
          </p>
        </div>
      </div>
      <div className="grid gap-3 pl-7 sm:grid-cols-2">
        {EVENT_GROUPS.map((group) => {
          const groupChecked = group.events.every((e) => enabledEvents.has(e.label))
          return (
            <Card key={group.group} size="sm">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2.5">
                  <Checkbox checked={groupChecked} onCheckedChange={() => toggleGroup(group)} />
                  {group.group}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2.5">
                {group.events.map((event) => {
                  const id = `event-${event.label.replaceAll(' ', '-')}`
                  const num = event.id
                  return (
                    <div key={event.label} className="flex items-center gap-2.5">
                      <Checkbox
                        id={id}
                        checked={enabledEvents.has(event.label)}
                        onCheckedChange={() => toggleEvent(event.label)}
                      />
                      <label
                        htmlFor={id}
                        className="flex items-center gap-2 text-sm leading-none cursor-pointer"
                      >
                        <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-amber-400/60 bg-amber-400/15 text-[10px] font-semibold text-amber-500">
                          {num}
                        </span>
                        {event.label}{' '}
                        <span className="text-muted-foreground">({event.date.getFullYear()})</span>
                      </label>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

function AnalysisWindowSection() {
  const { from, to, setRange, reset } = useAnalysisWindow()
  const currentYear = new Date().getFullYear()
  const minYear = 1985
  const span = to - from

  const handleChange = (values: number[]) => {
    const [newFrom, newTo] = values
    setRange(newFrom, newTo)
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <IconCalendarStats className="size-5 text-muted-foreground" />
        <div>
          <h2 className="text-base font-semibold">Ventana de análisis</h2>
          <p className="text-sm text-muted-foreground">
            Define el rango de años visible en las gráficas. Mínimo {MIN_WINDOW} años.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 pl-7">
        <div className="flex items-center justify-between text-sm">
          <span className="font-mono tabular-nums text-foreground">
            {from} – {to}
          </span>
          <span className="text-muted-foreground">{span} años seleccionados</span>
        </div>
        <Slider
          value={[from, to]}
          min={minYear}
          max={currentYear}
          step={1}
          minStepsBetweenThumbs={MIN_WINDOW}
          onValueChange={handleChange}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{minYear}</span>
          <button type="button" onClick={reset} className="text-xs text-primary hover:underline">
            Restablecer
          </button>
          <span>{currentYear}</span>
        </div>
      </div>
    </section>
  )
}

export default function ConfiguracionPage() {
  const mounted = useMounted()

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Configuración de análisis</h1>
        <p className="text-sm text-muted-foreground">
          Personaliza cómo se muestran los datos en las gráficas. Los cambios se aplican inmediatamente a
          todos los indicadores.
        </p>
      </div>

      {mounted ? (
        <div className="flex flex-col gap-8 px-4 lg:px-6">
          <EventFilterSection />
          <AnalysisWindowSection />
        </div>
      ) : (
        <div className="flex flex-col gap-6 px-4 lg:px-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      )}
    </div>
  )
}
