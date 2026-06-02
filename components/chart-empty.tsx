import { IconDatabaseOff } from '@tabler/icons-react'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

type ChartEmptyProps = {
  title?: string
  description?: string
  indicator?: string
}

export function ChartEmpty({
  title = 'Sin datos',
  description = 'No hay datos disponibles para este indicador.',
  indicator,
}: ChartEmptyProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconDatabaseOff />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>
          {indicator != null
            ? `No hay datos disponibles para ${indicator}.`
            : (description ?? '')}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
