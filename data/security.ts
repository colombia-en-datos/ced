import { Sector } from '@/config/sectors'
import { inidicatorManifest } from './types'

export enum SecurityIndicators {
  Homicides = 'homicides',
  Kidnappings = 'kidnappings',
}

export const HOMICIDES_MANIFEST = inidicatorManifest.parse({
  id: `${Sector.Seguridad}_${SecurityIndicators.Homicides}`,
  sector: Sector.Seguridad,
  label: 'Homicidios',
  description:
    'Toda muerte causada por otra persona por cualquier tipo de elemento, registrada por Ministerio de Defensa Nacional',
  source: 'MinDefensa',
  sourceUrl:
    'https://www.datos.gov.co/Seguridad-y-Defensa/HOMICIDIO/m8fd-ahd9/about_data',
  resourceId: 'm8fd-ahd9',
  unit: 'víctimas',
  cacheTTL: 86400,
  positiveDirection: 'down',
})

export const KIDNAPPINGS_MANIFEST = inidicatorManifest.parse({
  id: `${Sector.Seguridad}_${SecurityIndicators.Kidnappings}`,
  sector: Sector.Seguridad,
  label: 'Secuestros',
  description:
    'Casos de secuestro (simple y extorsivo) registrados por Ministerio de Defensa Nacional',
  source: 'MinDefensa',
  sourceUrl:
    'https://www.datos.gov.co/Seguridad-y-Defensa/SECUESTRO/d7zw-hpf4/about_data',
  resourceId: 'd7zw-hpf4',
  unit: 'casos',
  cacheTTL: 86400,
  positiveDirection: 'down',
})
