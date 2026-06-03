type SectorHeaderProps = {
  title: string
  subtitle?: string
}

export function SectorHeader({ title, subtitle }: SectorHeaderProps) {
  return (
    <div className="px-4 lg:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
    </div>
  )
}
