import { useEffect, useMemo, useState } from 'react'
import { SECURITY_CATEGORIES, type SecurityIndicators } from '@/data/security'
import type { IndicatorByYearResult } from '@/hooks/use-indicator-by-year'
import { useCocaBaseSeizuresByYear } from '../api/use-coca-base-seizures'
import { useCocaineSeizuresByYear } from '../api/use-cocaine-seizures'
import { useCrimesAgainstMinorsByYear } from '../api/use-crimes-against-minors'
import { useCropEradicationByYear } from '../api/use-crop-eradication'
import { useDisplacementByYear } from '../api/use-displacement'
import { useDomesticViolenceByYear } from '../api/use-domestic-violence'
import { useExtortionByYear } from '../api/use-extortion'
import { useFinancialTheftByYear } from '../api/use-financial-theft'
import { useFirearmSeizuresByYear } from '../api/use-firearm-seizures'
import { useForceCasualtiesByYear } from '../api/use-force-casualties'
import { useHomeTheftByYear } from '../api/use-home-theft'
import { useHomicidesByYear } from '../api/use-homicides'
import { useIllegalMiningCapturesByYear } from '../api/use-illegal-mining-captures'
import { useKidnappingsByYear } from '../api/use-kidnappings'
import { useMarijuanaSeizuresByYear } from '../api/use-marijuana-seizures'
import { useOilPipelineBombingsByYear } from '../api/use-oil-pipeline-bombings'
import { usePersonalTheftByYear } from '../api/use-personal-theft'
import { useSexualCrimesByYear } from '../api/use-sexual-crimes'
import { useTerrorismByYear } from '../api/use-terrorism'
import { useTouristCrimesByYear } from '../api/use-tourist-crimes'
import { useTrafficInjuriesByYear } from '../api/use-traffic-injuries'
import { useVehicleTheftByYear } from '../api/use-vehicle-theft'

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

  const byId: Record<`${SecurityIndicators}`, IndicatorByYearResult> = {
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
