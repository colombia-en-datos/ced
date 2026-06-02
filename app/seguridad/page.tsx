"use client"

import { KidnappingsChart } from "@/features/seguridad/components/kidnappings-chart"

export default function SeguridadPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <KidnappingsChart />
      </div>
    </div>
  )
}
