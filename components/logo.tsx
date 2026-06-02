import Image from 'next/image'

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <Image src="/logo.svg" alt="" width={size} height={size} className="" />
      <span className="text-base font-semibold leading-tight">
        Colombia en Datos
      </span>
    </div>
  )
}
