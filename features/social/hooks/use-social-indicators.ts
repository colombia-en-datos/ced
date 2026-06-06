import { useEffect, useMemo, useState } from 'react'
import type { CategoryChartItem } from '@/components/category-tabs'
import { SOCIAL_CATEGORIES, type SocialIndicators } from '@/data/social'
import type { IndicatorResult } from '@/hooks/use-indicator-by-year'
import {
  useBienestarByYear,
  useCasaDignaByYear,
  useEmpleoParaLaProsperidadByYear,
  useEmprendimientoColectivoByYear,
  useFamiliasEnAccionByYear,
  useFamiliasEnSuTierraByYear,
  useGiniIndexByYear,
  useIcbfPrevencionByYear,
  useInfraestructuraSocialByYear,
  useIracaByYear,
  useMiNegocioByYear,
  useNetMigrationByYear,
  usePardNnaByYear,
  usePovertyHeadcountByYear,
  useResaByYear,
  useSubsidiosViviendaByYear,
} from '../api/indicators'

export function useSocialIndicators(activeCategory: string) {
  const [secondWaveEnabled, setSecondWaveEnabled] = useState(false)

  const activeIds = useMemo(
    () => new Set(SOCIAL_CATEGORIES.find((c) => c.id === activeCategory)?.items.map((item) => item.id) ?? []),
    [activeCategory]
  )

  const on = (id: `${SocialIndicators}`) => ({
    enabled: activeIds.has(id as SocialIndicators) || secondWaveEnabled,
  })

  const indicatorById: Record<string, IndicatorResult> = {
    familias_en_accion: useFamiliasEnAccionByYear(on('familias_en_accion')),
    familias_en_su_tierra: useFamiliasEnSuTierraByYear(on('familias_en_su_tierra')),
    empleo_para_la_prosperidad: useEmpleoParaLaProsperidadByYear(on('empleo_para_la_prosperidad')),
    mi_negocio: useMiNegocioByYear(on('mi_negocio')),
    iraca: useIracaByYear(on('iraca')),
    resa: useResaByYear(on('resa')),
    emprendimiento_colectivo: useEmprendimientoColectivoByYear(on('emprendimiento_colectivo')),
    casa_digna: useCasaDignaByYear(on('casa_digna')),
    subsidios_vivienda: useSubsidiosViviendaByYear(on('subsidios_vivienda')),
    infraestructura_social: useInfraestructuraSocialByYear(on('infraestructura_social')),
    pard_nna: usePardNnaByYear(on('pard_nna')),
    icbf_prevencion: useIcbfPrevencionByYear(on('icbf_prevencion')),
    bienestarina: useBienestarByYear(on('bienestarina')),
    gini_index: useGiniIndexByYear(on('gini_index')),
    poverty_headcount: usePovertyHeadcountByYear(on('poverty_headcount')),
    net_migration: useNetMigrationByYear(on('net_migration')),
  }

  const activeLoaded = [...activeIds].every((id) => indicatorById[id]?.data !== undefined)

  useEffect(() => {
    if (activeLoaded && !secondWaveEnabled) {
      setSecondWaveEnabled(true)
    }
  }, [activeLoaded, secondWaveEnabled])

  const allIndicators = Object.values(indicatorById)

  const categories = SOCIAL_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.map((item): CategoryChartItem => {
      return { type: 'indicator', data: indicatorById[item.id] }
    }),
  }))

  return { allIndicators, categories }
}
