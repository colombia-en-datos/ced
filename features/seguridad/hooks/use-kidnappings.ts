import { useQuery } from "@tanstack/react-query"
import { socrataApi } from "@/lib/api-client"

const KIDNAPPINGS_MANIFEST = {
  id: "seguridad_secuestros",
  sector: "seguridad",
  label: "Secuestros por año",
  description:
    "Casos de secuestro (simple y extorsivo) registrados por la Policía Nacional",
  source: "Policía Nacional",
  sourceUrl:
    "https://www.datos.gov.co/Seguridad-y-Defensa/SECUESTRO/d7zw-hpf4/about_data",
  resourceId: "d7zw-hpf4",
  query:
    "$select=date_extract_y(fecha_hecho) as year, sum(cantidad) as total&$group=year&$order=year ASC",
  fields: { year: "year", value: "total" },
  unit: "casos",
  cacheTTL: 86400,
  positiveDirection: "down" as const,
  policyEvents: [
    { year: 2016, label: "Acuerdo de paz FARC" },
    { year: 2022, label: "Inicio Paz Total" },
  ],
} as const

type SocrataRow = { year: string; total: string }

export type KidnappingDataPoint = {
  year: number
  total: number
}

export function useKidnappings() {
  const query = useQuery({
    queryKey: ["kidnappings"],
    queryFn: async ({ signal }) => {
      const rows = await socrataApi<SocrataRow[]>(
        KIDNAPPINGS_MANIFEST.resourceId,
        KIDNAPPINGS_MANIFEST.query,
        { signal }
      )

      return rows
        .map((row) => ({
          year: Number(row.year),
          total: Number(row.total),
        }))
        .filter((d) => !Number.isNaN(d.year) && !Number.isNaN(d.total))
    },
    staleTime: KIDNAPPINGS_MANIFEST.cacheTTL * 1000,
  })

  const { data } = query
  const latest = data?.[data.length - 1] ?? null
  const previous = data && data.length >= 2 ? data[data.length - 2] : null
  const delta =
    latest && previous
      ? ((latest.total - previous.total) / previous.total) * 100
      : null

  return { ...query, latest, previous, delta }
}

export { KIDNAPPINGS_MANIFEST }
