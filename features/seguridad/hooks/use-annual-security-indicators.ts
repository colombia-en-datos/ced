import {
  SECURITY_CATEGORIES,
  SECURITY_HERO_INDICATORS,
  SecurityIndicators,
} from '@/data/security'
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

export function useAnnualSecurityIndicators() {
  const kidnappings = useKidnappingsByYear()
  const homicides = useHomicidesByYear()
  const extortion = useExtortionByYear()
  const terrorism = useTerrorismByYear()
  const crimesAgainstMinors = useCrimesAgainstMinorsByYear()
  const financialTheft = useFinancialTheftByYear()
  const forceCasualties = useForceCasualtiesByYear()
  const domesticViolence = useDomesticViolenceByYear()
  const displacement = useDisplacementByYear()
  const personalTheft = usePersonalTheftByYear()
  const homeTheft = useHomeTheftByYear()
  const vehicleTheft = useVehicleTheftByYear()
  const cropEradication = useCropEradicationByYear()
  const cocaineSeizures = useCocaineSeizuresByYear()
  const cocaBaseSeizures = useCocaBaseSeizuresByYear()
  const sexualCrimes = useSexualCrimesByYear()
  const illegalMiningCaptures = useIllegalMiningCapturesByYear()
  const firearmSeizures = useFirearmSeizuresByYear()
  const marijuanaSeizures = useMarijuanaSeizuresByYear()
  const oilPipelineBombings = useOilPipelineBombingsByYear()
  const trafficInjuries = useTrafficInjuriesByYear()
  const touristCrimes = useTouristCrimesByYear()

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

  const heroIndicators = SECURITY_HERO_INDICATORS.map((id) => byId[id])

  const categories = SECURITY_CATEGORIES.map((cat) => ({
    ...cat,
    data: cat.indicators.map((id) => byId[id]),
  }))

  return { heroIndicators, categories }
}
