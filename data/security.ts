import { Sector } from '@/config/sectors'
import { inidicatorManifest } from './types'

export enum SecurityIndicators {
  CocaBaseSeizures = 'coca_base_seizures',
  CocaineSeizures = 'cocaine_seizures',
  CrimesAgainstMinors = 'crimes_against_minors',
  CropEradication = 'crop_eradication',
  Displacement = 'displacement',
  DomesticViolence = 'domestic_violence',
  Extortion = 'extortion',
  FinancialTheft = 'financial_theft',
  FirearmSeizures = 'firearm_seizures',
  ForceCasualties = 'force_casualties',
  SexualCrimes = 'sexual_crimes',
  Homicides = 'homicides',
  HomeTheft = 'home_theft',
  IllegalMiningCaptures = 'illegal_mining_captures',
  Kidnappings = 'kidnappings',
  MarijuanaSeizures = 'marijuana_seizures',
  TrafficInjuries = 'traffic_injuries',
  PersonalTheft = 'personal_theft',
  Terrorism = 'terrorism',
  TouristCrimes = 'tourist_crimes',
  OilPipelineBombings = 'oil_pipeline_bombings',
  VehicleTheft = 'vehicle_theft',
}

export type SecurityCategory = {
  id: string
  label: string
  description: string
  indicators: SecurityIndicators[]
}

export const SECURITY_CATEGORIES: SecurityCategory[] = [
  {
    id: 'violence',
    label: 'Violencia y conflicto',
    description:
      'Delitos contra la vida e infraestructura en el contexto del conflicto armado.',
    indicators: [
      SecurityIndicators.Homicides,
      SecurityIndicators.Terrorism,
      SecurityIndicators.Kidnappings,
      SecurityIndicators.Extortion,
      SecurityIndicators.Displacement,
      SecurityIndicators.ForceCasualties,
      SecurityIndicators.OilPipelineBombings,
    ],
  },
  {
    id: 'social',
    label: 'Convivencia',
    description:
      'Indicadores de violencia interpersonal y protección de poblaciones vulnerables.',
    indicators: [
      SecurityIndicators.DomesticViolence,
      SecurityIndicators.SexualCrimes,
      SecurityIndicators.CrimesAgainstMinors,
      SecurityIndicators.TrafficInjuries,
    ],
  },
  {
    id: 'theft',
    label: 'Hurtos',
    description: 'Modalidades de hurto reportadas a nivel nacional.',
    indicators: [
      SecurityIndicators.PersonalTheft,
      SecurityIndicators.HomeTheft,
      SecurityIndicators.VehicleTheft,
      SecurityIndicators.FinancialTheft,
      SecurityIndicators.TouristCrimes,
    ],
  },
  {
    id: 'operations',
    label: 'Operativos',
    description:
      'Resultados operacionales de la fuerza pública en lucha contra el narcotráfico y la minería ilegal.',
    indicators: [
      SecurityIndicators.CocaineSeizures,
      SecurityIndicators.CocaBaseSeizures,
      SecurityIndicators.MarijuanaSeizures,
      SecurityIndicators.CropEradication,
      SecurityIndicators.IllegalMiningCaptures,
      SecurityIndicators.FirearmSeizures,
    ],
  },
]

export const COCA_BASE_SEIZURES_MANIFEST = inidicatorManifest.parse({
  id: `${Sector.Seguridad}_${SecurityIndicators.CocaBaseSeizures}`,
  sector: Sector.Seguridad,
  label: 'Incautaciones de base de coca',
  description:
    'Kilogramos de pasta/base de cocaína incautados por la fuerza pública en el ejercicio de sus funciones',
  source: 'MinDefensa',
  sourceUrl:
    'https://www.datos.gov.co/Seguridad-y-Defensa/INCAUTACIONES-DE-BASE-DE-COCA/nxbk-nikm/about_data',
  resourceId: 'nxbk-nikm',
  unit: 'kg',
  cacheTTL: 86400,
  positiveDirection: 'up',
})

export const COCAINE_SEIZURES_MANIFEST = inidicatorManifest.parse({
  id: `${Sector.Seguridad}_${SecurityIndicators.CocaineSeizures}`,
  sector: Sector.Seguridad,
  label: 'Incautaciones de cocaína',
  description:
    'Kilogramos de clorhidrato de cocaína incautados por la fuerza pública. El clorhidrato de cocaína es el producto obtenido de la pasta de coca mediante cambios de pH y procesos de precipitación, finalizado con adición de ácido clorhídrico',
  source: 'MinDefensa',
  sourceUrl:
    'https://www.datos.gov.co/Seguridad-y-Defensa/INCAUTACIONES-DE-COCA-NA/26zg-9p9r/about_data',
  resourceId: '26zg-9p9r',
  unit: 'kg',
  cacheTTL: 86400,
  positiveDirection: 'up',
})

export const CRIMES_AGAINST_MINORS_MANIFEST = inidicatorManifest.parse({
  id: `${Sector.Seguridad}_${SecurityIndicators.CrimesAgainstMinors}`,
  sector: Sector.Seguridad,
  label: 'Delitos contra niños y adolescentes',
  description:
    'Delitos cometidos contra la niñez y la adolescencia en Colombia, reportados por la Policía Nacional',
  source: 'Policía Nacional',
  sourceUrl:
    'https://www.datos.gov.co/Seguridad-y-Defensa/Ni-os-ni-as-y-adolescentes-v-ctimas-de-delitos-en-/8mcu-22np/about_data',
  resourceId: '8mcu-22np',
  unit: 'víctimas',
  cacheTTL: 86400,
  positiveDirection: 'down',
})

export const CROP_ERADICATION_MANIFEST = inidicatorManifest.parse({
  id: `${Sector.Seguridad}_${SecurityIndicators.CropEradication}`,
  sector: Sector.Seguridad,
  label: 'Erradicación de cultivos',
  description:
    'Eliminación física o afectación directa de los cultivos ilícitos. Se ejecuta a través del empleo de diferentes modalidades que buscan la disminución de este tipo de plantaciones',
  source: 'MinDefensa',
  sourceUrl:
    'https://www.datos.gov.co/Seguridad-y-Defensa/ERRADICACI-N/p72f-qcvk/about_data',
  resourceId: 'p72f-qcvk',
  unit: 'hectáreas',
  cacheTTL: 86400,
  positiveDirection: 'up',
})

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

export const DOMESTIC_VIOLENCE_MANIFEST = inidicatorManifest.parse({
  id: `${Sector.Seguridad}_${SecurityIndicators.DomesticViolence}`,
  sector: Sector.Seguridad,
  label: 'Violencia intrafamiliar',
  description:
    'Víctimas de violencia intrafamiliar, definida como toda acción en la que se maltrate física o psicológicamente a cualquier miembro del núcleo familiar',
  source: 'MinDefensa',
  sourceUrl:
    'https://www.datos.gov.co/Seguridad-y-Defensa/VIOLENCIA-INTRAFAMILIAR/gepp-dxcs/about_data',
  resourceId: 'gepp-dxcs',
  unit: 'víctimas',
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

export const FINANCIAL_THEFT_MANIFEST = inidicatorManifest.parse({
  id: `${Sector.Seguridad}_${SecurityIndicators.FinancialTheft}`,
  sector: Sector.Seguridad,
  label: 'Hurto a entidades financieras',
  description:
    'Hurto con violencia o acceso clandestino a entidades financieras para sustraer dinero, según el artículo 239 del Código Penal Colombiano',
  source: 'MinDefensa',
  sourceUrl:
    'https://www.datos.gov.co/Seguridad-y-Defensa/HURTO-A-ENTIDADES-FINANCIERAS/i7h7-wmjc/about_data',
  resourceId: 'i7h7-wmjc',
  unit: 'casos',
  cacheTTL: 86400,
  positiveDirection: 'down',
})

export const FIREARM_SEIZURES_MANIFEST = inidicatorManifest.parse({
  id: `${Sector.Seguridad}_${SecurityIndicators.FirearmSeizures}`,
  sector: Sector.Seguridad,
  label: 'Incautación de armas de fuego',
  description:
    'Armas de fuego incautadas por la Policía Nacional en todo el territorio colombiano',
  source: 'Policía Nacional',
  sourceUrl:
    'https://www.datos.gov.co/Seguridad-y-Defensa/Reporte-Incautaci-n-de-Armas-de-Fuego-Polic-a-Naci/2iz5-9bbz/about_data',
  resourceId: '2iz5-9bbz',
  unit: 'armas',
  cacheTTL: 86400,
  positiveDirection: 'up',
})

export const FORCE_CASUALTIES_MANIFEST = inidicatorManifest.parse({
  id: `${Sector.Seguridad}_${SecurityIndicators.ForceCasualties}`,
  sector: Sector.Seguridad,
  label: 'Afectación de la fuerza pública',
  description:
    'Homicidios y lesiones de miembros de la Fuerza Pública (Ejército, Armada, Fuerza Aérea y Policía) en cumplimiento de su deber constitucional',
  source: 'MinDefensa',
  sourceUrl:
    'https://www.datos.gov.co/Seguridad-y-Defensa/AFECTACI-N-DE-MIEMBROS-DE-LA-FUERZA-P-BLICA/8rpn-wpty/about_data',
  resourceId: '8rpn-wpty',
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

export const SEXUAL_CRIMES_MANIFEST = inidicatorManifest.parse({
  id: `${Sector.Seguridad}_${SecurityIndicators.SexualCrimes}`,
  sector: Sector.Seguridad,
  label: 'Delitos sexuales',
  description:
    'Delitos contemplados en el Título IV del Código Penal Colombiano que atentan contra la libertad, integridad y formación sexuales. Se mide en víctimas',
  source: 'MinDefensa',
  sourceUrl:
    'https://www.datos.gov.co/Seguridad-y-Defensa/DELITOS-SEXUALES/bz43-8ahq/about_data',
  resourceId: 'bz43-8ahq',
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

export const MARIJUANA_SEIZURES_MANIFEST = inidicatorManifest.parse({
  id: `${Sector.Seguridad}_${SecurityIndicators.MarijuanaSeizures}`,
  sector: Sector.Seguridad,
  label: 'Incautaciones de marihuana',
  description:
    'Kilogramos de marihuana incautados por la fuerza pública en el ejercicio de sus funciones',
  source: 'MinDefensa',
  sourceUrl:
    'https://www.datos.gov.co/Seguridad-y-Defensa/INCAUTACIONES-DE-MARIHUANA/g228-vp9d/about_data',
  resourceId: 'g228-vp9d',
  unit: 'kg',
  cacheTTL: 86400,
  positiveDirection: 'up',
})

export const OIL_PIPELINE_BOMBINGS_MANIFEST = inidicatorManifest.parse({
  id: `${Sector.Seguridad}_${SecurityIndicators.OilPipelineBombings}`,
  sector: Sector.Seguridad,
  label: 'Voladura de oleoductos',
  description:
    'Afectación a la infraestructura crítica: voladura de oleoductos',
  source: 'MinDefensa',
  sourceUrl:
    'https://www.datos.gov.co/Seguridad-y-Defensa/VOLADURA-DE-OLEDUCTOS/ec2r-4byk/about_data',
  resourceId: 'ec2r-4byk',
  unit: 'casos',
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

export const TRAFFIC_INJURIES_MANIFEST = inidicatorManifest.parse({
  id: `${Sector.Seguridad}_${SecurityIndicators.TrafficInjuries}`,
  sector: Sector.Seguridad,
  label: 'Lesiones en accidentes de tránsito',
  description:
    'Acción que causa daño corporal o lesión a una persona mediante la participación de un vehículo (accidente de tránsito). Se mide en víctimas',
  source: 'MinDefensa',
  sourceUrl:
    'https://www.datos.gov.co/Seguridad-y-Defensa/LESIONES-ACCIDENTES-DE-TR-NSITO/ntej-qq7v/about_data',
  resourceId: 'ntej-qq7v',
  unit: 'víctimas',
  cacheTTL: 86400,
  positiveDirection: 'down',
})

export const TERRORISM_MANIFEST = inidicatorManifest.parse({
  id: `${Sector.Seguridad}_${SecurityIndicators.Terrorism}`,
  sector: Sector.Seguridad,
  label: 'Terrorismo',
  description:
    'El que provoque o mantenga en estado de zozobra o terror a la población o a un sector de ella, mediante actos que pongan en peligro la vida, la integridad física o la libertad de las personas o las edificaciones o medios de comunicación, transporte, procesamiento o conducción de fluidos o fuerzas motrices, valiéndose de medios capaces de causar estragos (Ley 599 de 2000, artículo 343)',
  source: 'MinDefensa',
  sourceUrl:
    'https://www.datos.gov.co/Seguridad-y-Defensa/TERRORISMO/yi5j-5fe9/about_data',
  resourceId: 'yi5j-5fe9',
  unit: 'casos',
  cacheTTL: 86400,
  positiveDirection: 'down',
})

export const TOURIST_CRIMES_MANIFEST = inidicatorManifest.parse({
  id: `${Sector.Seguridad}_${SecurityIndicators.TouristCrimes}`,
  sector: Sector.Seguridad,
  label: 'Delitos contra turistas',
  description:
    'Turistas víctimas de delitos en Colombia, registrados por la Policía Nacional',
  source: 'Policía Nacional',
  sourceUrl:
    'https://www.datos.gov.co/Seguridad-y-Defensa/Turistas-v-ctimas-de-delitos-en-Colombia/p2r3-hbie/about_data',
  resourceId: 'p2r3-hbie',
  unit: 'casos',
  cacheTTL: 86400,
  positiveDirection: 'down',
})

export const ILLEGAL_MINING_CAPTURES_MANIFEST = inidicatorManifest.parse({
  id: `${Sector.Seguridad}_${SecurityIndicators.IllegalMiningCaptures}`,
  sector: Sector.Seguridad,
  label: 'Capturas por minería ilegal',
  description:
    'Capturas por explotación ilícita de yacimiento minero según el artículo 332 del Código Penal Colombiano, realizadas por la fuerza pública',
  source: 'MinDefensa',
  sourceUrl:
    'https://www.datos.gov.co/Seguridad-y-Defensa/CAPTURAS-POR-MINER-A-ILEGAL/3wcs-8xp9/about_data',
  resourceId: '3wcs-8xp9',
  unit: 'capturas',
  cacheTTL: 86400,
  positiveDirection: 'up',
})

export const HOME_THEFT_MANIFEST = inidicatorManifest.parse({
  id: `${Sector.Seguridad}_${SecurityIndicators.HomeTheft}`,
  sector: Sector.Seguridad,
  label: 'Hurto a residencias',
  description:
    'Modalidad en la que el victimario utiliza diferentes medios con el fin de apoderarse de los elementos que existan en el interior de una vivienda',
  source: 'MinDefensa',
  sourceUrl:
    'https://www.datos.gov.co/Seguridad-y-Defensa/HURTO-A-RESIDENCIAS/7mn7-vzqp/about_data',
  resourceId: '7mn7-vzqp',
  unit: 'casos',
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
