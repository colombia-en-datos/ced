import { Sector } from '@/config/sectors'
import { inidicatorManifest } from './types'

export enum SecurityIndicators {
  Displacement = 'displacement',
  Extortion = 'extortion',
  Homicides = 'homicides',
  Kidnappings = 'kidnappings',
  PersonalTheft = 'personal_theft',
  VehicleTheft = 'vehicle_theft',
}

// National-level dataset (e29y-pi4y, 368k rows). Chosen over the departmental
// dataset (ynab-fjc9, 5.3M rows) to keep client-side aggregation feasible.
// For the department heatmap, use ynab-fjc9 with server-side SoQL grouping.
export const DISPLACEMENT_MANIFEST = inidicatorManifest.parse({
  id: `${Sector.Seguridad}_${SecurityIndicators.Displacement}`,
  sector: Sector.Seguridad,
  label: 'Desplazamiento forzado',
  description:
    'Personas víctimas de desplazamiento forzado registradas en el Registro Único de Víctimas (RUV), cifra nacional anualizada por ocurrencia',
  source: 'Unidad de Víctimas',
  sourceUrl:
    'https://www.datos.gov.co/Inclusi-n-Social-y-Reconciliaci-n/REPORTE-VICTIMAS-DESPLAZAMIENTO-ANUALIZADO-OCURREN/e29y-pi4y/about_data',
  resourceId: 'e29y-pi4y',
  unit: 'personas',
  cacheTTL: 86400,
  positiveDirection: 'down',
})

export const EXTORTION_MANIFEST = inidicatorManifest.parse({
  id: `${Sector.Seguridad}_${SecurityIndicators.Extortion}`,
  sector: Sector.Seguridad,
  label: 'Extorsión',
  description:
    'Según el art. 244 del Código Penal Colombiano, Ley 599 de 2000, el que constriña a otro a hacer, tolerar u omitir alguna cosa, con el propósito de obtener provecho ilícito para sí o para un tercero',
  source: 'MinDefensa',
  sourceUrl:
    'https://www.datos.gov.co/Seguridad-y-Defensa/EXTORSI-N/q2ib-t9am/about_data',
  resourceId: 'q2ib-t9am',
  unit: 'víctimas',
  cacheTTL: 86400,
  positiveDirection: 'down',
})

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

export const PERSONAL_THEFT_MANIFEST = inidicatorManifest.parse({
  id: `${Sector.Seguridad}_${SecurityIndicators.PersonalTheft}`,
  sector: Sector.Seguridad,
  label: 'Hurto a personas',
  description:
    'Modalidad de hurto donde el victimario utiliza diferentes medios con el fin de apoderarse de los elementos de valor que lleva consigo una persona',
  source: 'MinDefensa',
  sourceUrl:
    'https://www.datos.gov.co/Seguridad-y-Defensa/HURTO-PERSONAS/4rxi-8m8d/about_data',
  resourceId: '4rxi-8m8d',
  unit: 'víctimas',
  cacheTTL: 86400,
  positiveDirection: 'down',
})

export const VEHICLE_THEFT_MANIFEST = inidicatorManifest.parse({
  id: `${Sector.Seguridad}_${SecurityIndicators.VehicleTheft}`,
  sector: Sector.Seguridad,
  label: 'Hurto a vehículos',
  description:
    'Sumatoria del hurto de automotores y motocicletas registrado por Ministerio de Defensa Nacional',
  source: 'MinDefensa',
  sourceUrl:
    'https://www.datos.gov.co/Seguridad-y-Defensa/HURTO-A-VEH-CULOS/csb4-y6v2/about_data',
  resourceId: 'csb4-y6v2',
  unit: 'unidades',
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
