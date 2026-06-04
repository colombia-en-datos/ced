import { IconInfoCircle } from '@tabler/icons-react'
import { InfoTip } from '@/components/info-tip'
import type { DerivedSource } from '@/hooks/use-indicator-by-year'

type IndicatorInfoTipProps = {
  description?: string
  formula?: string
  derivedSources?: DerivedSource[]
}

export function IndicatorInfoTip({ description, formula, derivedSources }: IndicatorInfoTipProps) {
  if (!description && !formula) return null

  return (
    <InfoTip
      content={
        <div className="flex max-w-xs flex-col gap-2">
          {description ? <p>{description}</p> : null}
          {formula ? (
            <p className="font-mono text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground/70">Fórmula:</span> {formula}
            </p>
          ) : null}
          {derivedSources?.length ? (
            <div className="text-[11px]">
              <span className="font-semibold text-foreground/70">Indicador derivado de:</span>
              <ul className="mt-0.5 list-inside list-disc">
                {derivedSources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      }
    >
      <IconInfoCircle className="size-4 text-muted-foreground" />
    </InfoTip>
  )
}
