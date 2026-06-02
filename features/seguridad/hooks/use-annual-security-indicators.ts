import { useDisplacementByYear } from '../api/use-displacement'
import { useExtortionByYear } from '../api/use-extortion'
import { useHomicidesByYear } from '../api/use-homicides'
import { useKidnappingsByYear } from '../api/use-kidnappings'
import { usePersonalTheftByYear } from '../api/use-personal-theft'
import { useVehicleTheftByYear } from '../api/use-vehicle-theft'

export function useAnnualSecurityIndicators() {
  const kidnappings = useKidnappingsByYear()
  const homicides = useHomicidesByYear()
  const extortion = useExtortionByYear()
  const displacement = useDisplacementByYear()
  const personalTheft = usePersonalTheftByYear()
  const vehicleTheft = useVehicleTheftByYear()

  return [
    kidnappings,
    homicides,
    extortion,
    displacement,
    personalTheft,
    vehicleTheft,
  ]
}
