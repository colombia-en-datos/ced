export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <img src="/logo.svg" alt="" width={size} height={size} />
      <span className="text-base font-semibold leading-tight">Colombia en Datos</span>
    </div>
  )
}
