import { Sector } from '@/config/sectors'
import { indicatorManifest, type SectorCategory } from './types'

export enum HealthIndicators {
  AcuteMalnutrition = 'acute_malnutrition',
  Dengue = 'dengue',
  GestationalSyphilis = 'gestational_syphilis',
  HealthProviders = 'health_providers',
  HospitalCapacity = 'hospital_capacity',
  HealthWorkforce = 'health_workforce',
  IndependentProfessionals = 'independent_professionals',
  LowBirthWeight = 'low_birth_weight',
  MaternalMortality = 'maternal_mortality',
  MalariaVivax = 'malaria_vivax',
  MortalityEda = 'mortality_eda',
  MortalityIra = 'mortality_ira',
  PerinatalMortality = 'perinatal_mortality',
  SevereMaternalMorbidity = 'severe_maternal_morbidity',
  SocialProtection = 'social_protection',
  SuicideAttempt = 'suicide_attempt',
  Tuberculosis = 'tuberculosis',
  VihSida = 'vih_sida',
  LifeExpectancy = 'life_expectancy',
}

// ---------------------------------------------------------------------------
// SIVIGILA manifest helper — all share the same dataset (4hyg-wa9d)
// ---------------------------------------------------------------------------

const SIVIGILA_RESOURCE_ID = '4hyg-wa9d'
const SIVIGILA_SOURCE = 'Instituto Nacional de Salud (INS)'
const SIVIGILA_SOURCE_URL =
  'https://www.datos.gov.co/Salud-y-Protecci-n-Social/Datos-de-Vigilancia-en-Salud-Publica-de-Colombia/4hyg-wa9d/about_data'

function sivigilaManifest(
  id: HealthIndicators,
  label: string,
  description: string,
  eventName: string,
  unit = 'casos'
) {
  return indicatorManifest.parse({
    id: `${Sector.Salud}_${id}`,
    sector: Sector.Salud,
    label,
    description,
    source: SIVIGILA_SOURCE,
    sourceUrl: SIVIGILA_SOURCE_URL,
    resourceId: SIVIGILA_RESOURCE_ID,
    queryKey: `sivigila_${id}`,
    query: `$select=ano,sum(conteo) as total&$where=nombre_evento='${eventName}'&$group=ano&$order=ano ASC`,
    unit,
    cacheTTL: 86400,
    positiveDirection: 'down',
  })
}

// ---------------------------------------------------------------------------
// Manifest entries
// ---------------------------------------------------------------------------

export const DENGUE_MANIFEST = sivigilaManifest(
  HealthIndicators.Dengue,
  'Dengue',
  'Casos de dengue clásico notificados al sistema de vigilancia en salud pública SIVIGILA.',
  'DENGUE'
)

export const TUBERCULOSIS_MANIFEST = sivigilaManifest(
  HealthIndicators.Tuberculosis,
  'Tuberculosis pulmonar',
  'Casos de tuberculosis pulmonar notificados al sistema de vigilancia en salud pública SIVIGILA.',
  'TUBERCULOSIS PULMONAR'
)

export const MALARIA_VIVAX_MANIFEST = sivigilaManifest(
  HealthIndicators.MalariaVivax,
  'Malaria vivax',
  'Casos de malaria por Plasmodium vivax notificados al SIVIGILA. Es la forma más común de malaria en Colombia.',
  'MALARIA VIVAX'
)

export const VIH_SIDA_MANIFEST = sivigilaManifest(
  HealthIndicators.VihSida,
  'VIH/SIDA',
  'Casos de VIH, SIDA y mortalidad por SIDA notificados al sistema de vigilancia en salud pública SIVIGILA.',
  'VIH/SIDA/MORTALIDAD POR SIDA'
)

export const MATERNAL_MORTALITY_MANIFEST = sivigilaManifest(
  HealthIndicators.MaternalMortality,
  'Mortalidad materna',
  'Muertes maternas notificadas al SIVIGILA. Incluye muertes durante el embarazo, parto o dentro de los 42 días posteriores.',
  'MORTALIDAD MATERNA',
  'muertes'
)

export const PERINATAL_MORTALITY_MANIFEST = sivigilaManifest(
  HealthIndicators.PerinatalMortality,
  'Mortalidad perinatal y neonatal',
  'Muertes perinatales y neonatales tardías notificadas al SIVIGILA.',
  'MORTALIDAD PERINATAL Y NEONATAL TARDÍA',
  'muertes'
)

export const MORTALITY_EDA_MANIFEST = sivigilaManifest(
  HealthIndicators.MortalityEda,
  'Mortalidad por EDA (0-4 años)',
  'Muertes por enfermedad diarreica aguda (EDA) en menores de 5 años, notificadas al SIVIGILA.',
  'MORTALIDAD POR EDA 0-4 AÑOS',
  'muertes'
)

export const MORTALITY_IRA_MANIFEST = sivigilaManifest(
  HealthIndicators.MortalityIra,
  'Mortalidad por IRA',
  'Muertes por infección respiratoria aguda (IRA) notificadas al SIVIGILA.',
  'MORTALIDAD POR IRA',
  'muertes'
)

export const LOW_BIRTH_WEIGHT_MANIFEST = sivigilaManifest(
  HealthIndicators.LowBirthWeight,
  'Bajo peso al nacer',
  'Recién nacidos con peso inferior a 2.500 gramos, notificados al SIVIGILA.',
  'BAJO PESO AL NACER'
)

export const SEVERE_MATERNAL_MORBIDITY_MANIFEST = sivigilaManifest(
  HealthIndicators.SevereMaternalMorbidity,
  'Morbilidad materna extrema',
  'Casos de morbilidad materna extrema (complicaciones graves durante el embarazo, parto o puerperio) notificados al SIVIGILA.',
  'MORBILIDAD MATERNA EXTREMA'
)

export const ACUTE_MALNUTRITION_MANIFEST = sivigilaManifest(
  HealthIndicators.AcuteMalnutrition,
  'Desnutrición aguda (<5 años)',
  'Casos de desnutrición aguda en menores de 5 años notificados al SIVIGILA.',
  'DESNUTRICIÓN AGUDA EN MENORES DE 5 AÑOS'
)

export const GESTATIONAL_SYPHILIS_MANIFEST = sivigilaManifest(
  HealthIndicators.GestationalSyphilis,
  'Sífilis gestacional',
  'Casos de sífilis en mujeres gestantes notificados al SIVIGILA.',
  'SIFILIS GESTACIONAL'
)

export const SUICIDE_ATTEMPT_MANIFEST = sivigilaManifest(
  HealthIndicators.SuicideAttempt,
  'Intento de suicidio',
  'Casos de intento de suicidio notificados al sistema de vigilancia en salud pública SIVIGILA.',
  'INTENTO DE SUICIDIO'
)

// ---------------------------------------------------------------------------
// Hospital capacity (fa2g-cdft) — multi-series, not SIVIGILA
// ---------------------------------------------------------------------------

export const HOSPITAL_CAPACITY_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Salud}_${HealthIndicators.HospitalCapacity}`,
  sector: Sector.Salud,
  label: 'Capacidad hospitalaria instalada',
  description:
    'Cantidad de camas, ambulancias y quirófanos habilitados a nivel nacional por año. Fuente: Registro Especial de Prestadores de Servicios de Salud (REPS).',
  source: 'MinSalud',
  sourceUrl:
    'https://www.datos.gov.co/Salud-y-Protecci-n-Social/Cantidad-de-ambulancias-camas-y-salas-consideradas/fa2g-cdft/about_data',
  resourceId: 'fa2g-cdft',
  queryKey: 'hospitalCapacity',
  query:
    '$select=a_o,sum(camas_adultos) as camas_adultos,sum(camas_pedi_trica) as camas_pediatrica,sum(camas_obstetricia) as camas_obstetricia,sum(camas_cuidado_intensivo_adulto) as uci_adulto,sum(camas_cuidado_intensivo) as uci_neonatal,sum(camas_cuidado_intensivo_pedi) as uci_pediatrica,sum(ambulancias_b_sica) as ambulancias_basica,sum(ambulancias_medicalizada) as ambulancias_med,sum(salas_quir_fano) as quirofanos&$where=a_o IS NOT NULL&$group=a_o&$order=a_o ASC',
  unit: 'unidades',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

// ---------------------------------------------------------------------------
// Health providers (kjjp-kasm) — multi-series, not SIVIGILA
// ---------------------------------------------------------------------------

export const HEALTH_PROVIDERS_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Salud}_${HealthIndicators.HealthProviders}`,
  sector: Sector.Salud,
  label: 'IPS por naturaleza jurídica',
  description:
    'Instituciones Prestadoras de Servicios de Salud (IPS) habilitadas a nivel nacional, desagregadas por naturaleza jurídica (pública, privada, mixta).',
  source: 'MinSalud',
  sourceUrl:
    'https://www.datos.gov.co/Salud-y-Protecci-n-Social/N-mero-de-prestadores-de-servicios-de-salud-por-de/kjjp-kasm/about_data',
  resourceId: 'kjjp-kasm',
  queryKey: 'healthProviders',
  // clase_prestador was renamed in 2022; LIKE 'Instituciones%' matches both variants
  query:
    "$select=a_o,naturaleza,sum(cantidad_de_prestadores) as total&$where=clase_prestador like 'Instituciones%25'&$group=a_o,naturaleza&$order=a_o ASC",
  unit: 'IPS',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

export const INDEPENDENT_PROFESSIONALS_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Salud}_${HealthIndicators.IndependentProfessionals}`,
  sector: Sector.Salud,
  label: 'Profesionales independientes',
  description: 'Profesionales de la salud habilitados para ejercer de forma independiente a nivel nacional.',
  source: 'MinSalud',
  sourceUrl:
    'https://www.datos.gov.co/Salud-y-Protecci-n-Social/N-mero-de-prestadores-de-servicios-de-salud-por-de/kjjp-kasm/about_data',
  resourceId: 'kjjp-kasm',
  queryKey: 'independentProfessionals',
  query:
    "$select=a_o as ano,sum(cantidad_de_prestadores) as total&$where=clase_prestador='Profesional Independiente'&$group=a_o&$order=a_o ASC",
  unit: 'profesionales',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

// ---------------------------------------------------------------------------
// Health workforce — RETHUS (my8c-6xkk) — multi-series, not SIVIGILA
// ---------------------------------------------------------------------------

export const HEALTH_WORKFORCE_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Salud}_${HealthIndicators.HealthWorkforce}`,
  sector: Sector.Salud,
  label: 'Nuevos profesionales de salud por año',
  description:
    'Profesionales de la salud certificados por año según el Registro Único Nacional del Talento Humano en Salud (RETHUS). Muestra el flujo de nuevos profesionales entrando al sistema.',
  source: 'MinSalud',
  sourceUrl:
    'https://www.datos.gov.co/Salud-y-Protecci-n-Social/Registro-nico-Nacional-del-Talento-Humano-en-Salud/my8c-6xkk/about_data',
  resourceId: 'my8c-6xkk',
  queryKey: 'healthWorkforce',
  query:
    "$select=a_oactoadministrativo as ano,perfilprofesional,sum(numeroregistros) as total&$where=a_oactoadministrativo >= 2000 AND a_oactoadministrativo <= 2021 AND (perfilprofesional like 'P07%25' OR perfilprofesional like 'P03%25' OR perfilprofesional like 'A02%25' OR perfilprofesional like 'P09%25' OR perfilprofesional like 'P11%25')&$group=a_oactoadministrativo,perfilprofesional&$order=a_oactoadministrativo ASC&$limit=200",
  unit: 'certificados',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

// ---------------------------------------------------------------------------
// Social protection affiliations (5xue-fyeb) — multi-series, not SIVIGILA
// ---------------------------------------------------------------------------

export const SOCIAL_PROTECTION_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Salud}_${HealthIndicators.SocialProtection}`,
  sector: Sector.Salud,
  label: 'Afiliaciones al Sistema de Protección Social',
  description:
    'Número de afiliaciones reportadas por las entidades y administradoras del Sistema de Protección Social (RUAF), desagregadas por componente.',
  source: 'MinSalud',
  sourceUrl:
    'https://www.datos.gov.co/Salud-y-Protecci-n-Social/N-mero-de-afiliaciones-que-reportan-las-entidades-/5xue-fyeb/about_data',
  resourceId: '5xue-fyeb',
  queryKey: 'socialProtection',
  query:
    '$select=date_extract_y(fechacorte) as ano,componentedesc,sum(numafiliados) as total&$group=date_extract_y(fechacorte),componentedesc&$order=ano ASC',
  unit: 'afiliados',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

// ---------------------------------------------------------------------------
// World Bank — life expectancy (SP.DYN.LE00.IN)
// ---------------------------------------------------------------------------

export const LIFE_EXPECTANCY_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Salud}_${HealthIndicators.LifeExpectancy}`,
  sector: Sector.Salud,
  label: 'Esperanza de vida al nacer',
  description:
    'Esperanza de vida al nacer (años). Indica el promedio de años que se espera viva un recién nacido si las tasas de mortalidad vigentes se mantienen constantes.',
  source: 'Banco Mundial',
  sourceUrl: 'https://datos.bancomundial.org/indicator/SP.DYN.LE00.IN?locations=CO',
  resourceId: 'SP.DYN.LE00.IN',
  queryKey: 'wbLifeExpectancy',
  unit: 'años',
  cacheTTL: 2592000,
  positiveDirection: 'up',
})

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export const HEALTH_CATEGORIES: SectorCategory<HealthIndicators>[] = [
  {
    id: 'health-system',
    label: 'Sistema de salud',
    description: 'Infraestructura, recurso humano y resultados generales del sistema de salud.',
    items: [
      {
        type: 'multi-series',
        id: HealthIndicators.HospitalCapacity,
        series: [
          { key: 'hospitalBeds', label: 'Camas hospitalarias', color: 'oklch(0.62 0.21 260)' },
          { key: 'icuBeds', label: 'Camas UCI', color: 'oklch(0.65 0.22 350)' },
          { key: 'ambulances', label: 'Ambulancias', color: 'oklch(0.72 0.17 195)' },
          { key: 'operatingRooms', label: 'Quirófanos', color: 'oklch(0.75 0.18 75)' },
        ],
      },
      {
        type: 'multi-series',
        id: HealthIndicators.HealthProviders,
        series: [
          { key: 'privada', label: 'IPS privadas', color: 'oklch(0.62 0.21 260)' },
          { key: 'publica', label: 'IPS públicas', color: 'oklch(0.72 0.17 195)' },
          { key: 'mixta', label: 'IPS mixtas', color: 'oklch(0.75 0.18 75)' },
        ],
      },
      { type: 'indicator', id: HealthIndicators.IndependentProfessionals },
      {
        type: 'multi-series',
        id: HealthIndicators.HealthWorkforce,
        series: [
          { key: 'medicina', label: 'Medicina', color: 'oklch(0.62 0.21 260)' },
          { key: 'enfermeria', label: 'Enfermería', color: 'oklch(0.72 0.17 195)' },
          { key: 'auxiliarEnfermeria', label: 'Aux. enfermería', color: 'oklch(0.68 0.16 145)' },
          { key: 'odontologia', label: 'Odontología', color: 'oklch(0.75 0.18 75)' },
          { key: 'psicologia', label: 'Psicología', color: 'oklch(0.65 0.22 350)' },
        ],
      },
      {
        type: 'multi-series',
        id: HealthIndicators.SocialProtection,
        series: [
          { key: 'pensiones', label: 'Pensiones', color: 'oklch(0.62 0.21 260)' },
          { key: 'compensacionFamiliar', label: 'Compensación familiar', color: 'oklch(0.72 0.17 195)' },
          { key: 'riesgosLaborales', label: 'Riesgos laborales', color: 'oklch(0.75 0.18 75)' },
          { key: 'cesantias', label: 'Cesantías', color: 'oklch(0.65 0.22 350)' },
        ],
      },
      { type: 'indicator', id: HealthIndicators.LifeExpectancy },
    ],
  },
  {
    id: 'communicable',
    label: 'Enfermedades transmisibles',
    description: 'Enfermedades infecciosas de notificación obligatoria al SIVIGILA.',
    items: [
      { type: 'indicator', id: HealthIndicators.Dengue },
      { type: 'indicator', id: HealthIndicators.Tuberculosis },
      { type: 'indicator', id: HealthIndicators.MalariaVivax },
      { type: 'indicator', id: HealthIndicators.VihSida },
    ],
  },
  {
    id: 'maternal-neonatal',
    label: 'Salud materna y neonatal',
    description: 'Indicadores de salud durante el embarazo, parto y período neonatal.',
    items: [
      { type: 'indicator', id: HealthIndicators.MaternalMortality },
      { type: 'indicator', id: HealthIndicators.SevereMaternalMorbidity },
      { type: 'indicator', id: HealthIndicators.PerinatalMortality },
      { type: 'indicator', id: HealthIndicators.LowBirthWeight },
      { type: 'indicator', id: HealthIndicators.GestationalSyphilis },
    ],
  },
  {
    id: 'child-nutrition',
    label: 'Salud infantil y nutrición',
    description: 'Mortalidad y desnutrición en la primera infancia.',
    items: [
      { type: 'indicator', id: HealthIndicators.MortalityEda },
      { type: 'indicator', id: HealthIndicators.MortalityIra },
      { type: 'indicator', id: HealthIndicators.AcuteMalnutrition },
      // Pending: infant mortality rate (WB)
    ],
  },
  {
    id: 'mental-health',
    label: 'Salud mental',
    description: 'Indicadores de salud mental y conducta suicida.',
    items: [{ type: 'indicator', id: HealthIndicators.SuicideAttempt }],
  },
]
