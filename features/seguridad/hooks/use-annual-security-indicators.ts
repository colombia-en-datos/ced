import { useEffect, useMemo, useState } from 'react'
import { SECURITY_CATEGORIES, type SecurityIndicators } from '@/data/security'
import type { IndicatorResult } from '@/hooks/use-indicator-by-year'
import {
  useCocaBaseSeizuresByYear,
  useCocaineSeizuresByYear,
  useCrimesAgainstMinorsByYear,
  useCropEradicationByYear,
  useDisplacementByYear,
  useDomesticViolenceByYear,
  useExtortionByYear,
  useFinancialTheftByYear,
  useFirearmSeizuresByYear,
  useForceCasualtiesByYear,
  useHomeTheftByYear,
  useHomicidesByYear,
  useIllegalMiningCapturesByYear,
  useKidnappingsByYear,
  useMarijuanaSeizuresByYear,
  useOilPipelineBombingsByYear,
  usePersonalTheftByYear,
  useSexualCrimesByYear,
  useTerrorismByYear,
  useTouristCrimesByYear,
  useTrafficInjuriesByYear,
  useVehicleTheftByYear,
} from '../api/indicators'

export function useAnnualSecurityIndicators(activeCategory: string) {
  const [secondWaveEnabled, setSecondWaveEnabled] = useState(false)

  const activeIds = useMemo(
    () =>
      new Set(
        SECURITY_CATEGORIES.find((c) => c.id === activeCategory)?.indicators ??
          ([] as `${SecurityIndicators}`[])
      ),
    [activeCategory]
  )

  const on = (id: `${SecurityIndicators}`) => ({
    enabled: activeIds.has(id) || secondWaveEnabled,
  })

  const byId: Record<`${SecurityIndicators}`, IndicatorResult> = {
    kidnappings: useKidnappingsByYear(on('kidnappings')),
    homicides: useHomicidesByYear(on('homicides')),
    extortion: useExtortionByYear(on('extortion')),
    terrorism: useTerrorismByYear(on('terrorism')),
    crimes_against_minors: useCrimesAgainstMinorsByYear(on('crimes_against_minors')),
    financial_theft: useFinancialTheftByYear(on('financial_theft')),
    force_casualties: useForceCasualtiesByYear(on('force_casualties')),
    domestic_violence: useDomesticViolenceByYear(on('domestic_violence')),
    displacement: useDisplacementByYear(on('displacement')),
    personal_theft: usePersonalTheftByYear(on('personal_theft')),
    home_theft: useHomeTheftByYear(on('home_theft')),
    vehicle_theft: useVehicleTheftByYear(on('vehicle_theft')),
    crop_eradication: useCropEradicationByYear(on('crop_eradication')),
    cocaine_seizures: useCocaineSeizuresByYear(on('cocaine_seizures')),
    coca_base_seizures: useCocaBaseSeizuresByYear(on('coca_base_seizures')),
    sexual_crimes: useSexualCrimesByYear(on('sexual_crimes')),
    illegal_mining_captures: useIllegalMiningCapturesByYear(on('illegal_mining_captures')),
    firearm_seizures: useFirearmSeizuresByYear(on('firearm_seizures')),
    marijuana_seizures: useMarijuanaSeizuresByYear(on('marijuana_seizures')),
    oil_pipeline_bombings: useOilPipelineBombingsByYear(on('oil_pipeline_bombings')),
    traffic_injuries: useTrafficInjuriesByYear(on('traffic_injuries')),
    tourist_crimes: useTouristCrimesByYear(on('tourist_crimes')),
  }

  const activeLoaded = [...activeIds].every((id) => byId[id]?.data !== undefined)

  useEffect(() => {
    if (activeLoaded && !secondWaveEnabled) {
      setSecondWaveEnabled(true)
    }
  }, [activeLoaded, secondWaveEnabled])

  const allIndicators = Object.values(byId)

  const categories = SECURITY_CATEGORIES.map((cat) => ({
    ...cat,
    data: cat.indicators.map((id) => byId[id]),
  }))

  return { allIndicators, categories }
}
