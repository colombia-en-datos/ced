import { useEffect, useMemo, useState } from 'react'
import { SECURITY_CATEGORIES, SecurityIndicators } from '@/data/security'
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
          []
      ),
    [activeCategory]
  )

  const on = (id: SecurityIndicators) => ({
    enabled: activeIds.has(id) || secondWaveEnabled,
  })

  const kidnappings = useKidnappingsByYear(on(SecurityIndicators.Kidnappings))
  const homicides = useHomicidesByYear(on(SecurityIndicators.Homicides))
  const extortion = useExtortionByYear(on(SecurityIndicators.Extortion))
  const terrorism = useTerrorismByYear(on(SecurityIndicators.Terrorism))
  const crimesAgainstMinors = useCrimesAgainstMinorsByYear(
    on(SecurityIndicators.CrimesAgainstMinors)
  )
  const financialTheft = useFinancialTheftByYear(
    on(SecurityIndicators.FinancialTheft)
  )
  const forceCasualties = useForceCasualtiesByYear(
    on(SecurityIndicators.ForceCasualties)
  )
  const domesticViolence = useDomesticViolenceByYear(
    on(SecurityIndicators.DomesticViolence)
  )
  const displacement = useDisplacementByYear(
    on(SecurityIndicators.Displacement)
  )
  const personalTheft = usePersonalTheftByYear(
    on(SecurityIndicators.PersonalTheft)
  )
  const homeTheft = useHomeTheftByYear(on(SecurityIndicators.HomeTheft))
  const vehicleTheft = useVehicleTheftByYear(
    on(SecurityIndicators.VehicleTheft)
  )
  const cropEradication = useCropEradicationByYear(
    on(SecurityIndicators.CropEradication)
  )
  const cocaineSeizures = useCocaineSeizuresByYear(
    on(SecurityIndicators.CocaineSeizures)
  )
  const cocaBaseSeizures = useCocaBaseSeizuresByYear(
    on(SecurityIndicators.CocaBaseSeizures)
  )
  const sexualCrimes = useSexualCrimesByYear(
    on(SecurityIndicators.SexualCrimes)
  )
  const illegalMiningCaptures = useIllegalMiningCapturesByYear(
    on(SecurityIndicators.IllegalMiningCaptures)
  )
  const firearmSeizures = useFirearmSeizuresByYear(
    on(SecurityIndicators.FirearmSeizures)
  )
  const marijuanaSeizures = useMarijuanaSeizuresByYear(
    on(SecurityIndicators.MarijuanaSeizures)
  )
  const oilPipelineBombings = useOilPipelineBombingsByYear(
    on(SecurityIndicators.OilPipelineBombings)
  )
  const trafficInjuries = useTrafficInjuriesByYear(
    on(SecurityIndicators.TrafficInjuries)
  )
  const touristCrimes = useTouristCrimesByYear(
    on(SecurityIndicators.TouristCrimes)
  )

  const byId: Record<string, IndicatorByYearResult> = {
    [SecurityIndicators.Kidnappings]: kidnappings,
    [SecurityIndicators.Homicides]: homicides,
    [SecurityIndicators.Extortion]: extortion,
    [SecurityIndicators.Terrorism]: terrorism,
    [SecurityIndicators.CrimesAgainstMinors]: crimesAgainstMinors,
    [SecurityIndicators.FinancialTheft]: financialTheft,
    [SecurityIndicators.ForceCasualties]: forceCasualties,
    [SecurityIndicators.DomesticViolence]: domesticViolence,
    [SecurityIndicators.Displacement]: displacement,
    [SecurityIndicators.PersonalTheft]: personalTheft,
    [SecurityIndicators.HomeTheft]: homeTheft,
    [SecurityIndicators.VehicleTheft]: vehicleTheft,
    [SecurityIndicators.CropEradication]: cropEradication,
    [SecurityIndicators.CocaineSeizures]: cocaineSeizures,
    [SecurityIndicators.CocaBaseSeizures]: cocaBaseSeizures,
    [SecurityIndicators.SexualCrimes]: sexualCrimes,
    [SecurityIndicators.IllegalMiningCaptures]: illegalMiningCaptures,
    [SecurityIndicators.FirearmSeizures]: firearmSeizures,
    [SecurityIndicators.MarijuanaSeizures]: marijuanaSeizures,
    [SecurityIndicators.OilPipelineBombings]: oilPipelineBombings,
    [SecurityIndicators.TrafficInjuries]: trafficInjuries,
    [SecurityIndicators.TouristCrimes]: touristCrimes,
  }

  // Enable second wave once the active category finishes loading
  const activeLoaded = [...activeIds].every(
    (id) => byId[id]?.data !== undefined
  )

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
