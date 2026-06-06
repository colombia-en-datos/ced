import { InfoTip } from '@/components/info-tip'
import type { Event } from '@/data/events'

export function EventMarker({
  text,
  events,
  viewBox,
}: {
  text: string
  events: Event[]
  viewBox?: { x?: number; y?: number }
}) {
  const x = viewBox?.x ?? 0
  const multi = events.length > 1
  const size = multi ? 20 : 16

  const tooltipContent = (
    <div className="flex flex-col gap-0.5">
      {events.map((e) => (
        <span key={e.label} className="whitespace-nowrap">
          <span className="font-semibold text-amber-400">{e.id}</span> {e.label} ({e.date.getFullYear()})
        </span>
      ))}
    </div>
  )

  return (
    <foreignObject x={x - size / 2} y={8 - size / 2} width={size} height={size} className="overflow-visible">
      <InfoTip content={tooltipContent}>
        <div
          className="flex items-center justify-center rounded-full border border-amber-400/60 bg-amber-400/15 cursor-default"
          style={{ width: size, height: size }}
        >
          <span
            className="font-semibold text-amber-500 leading-none select-none"
            style={{ fontSize: multi ? 8 : 9 }}
          >
            {text}
          </span>
        </div>
      </InfoTip>
    </foreignObject>
  )
}
