import { Sector } from '@/config/sectors'
import { indicatorManifest, type SectorCategory } from './types'

export enum EnvironmentIndicators {
  AirQuality = 'air_quality',
  EnvironmentalCrimes = 'environmental_crimes',
  ForestArea = 'forest_area',
  GhgBySector = 'ghg_by_sector',
  GhgEmissions = 'ghg_emissions',
  MaxTemperature = 'max_temperature',
  Pm25Pollution = 'pm25_pollution',
  ProtectedAreas = 'protected_areas',
}

// ---------------------------------------------------------------------------
// GHG emissions — IDEAM national inventory (6rff-a5ep)
// Uses SoQL aggregation: yearly totals in kt CO₂eq
// ---------------------------------------------------------------------------

export const GHG_EMISSIONS_MANIFEST = indicatorManifest.parse({
  id: `${Sector.MedioAmbiente}_${EnvironmentIndicators.GhgEmissions}`,
  sector: Sector.MedioAmbiente,
  label: 'Emisiones GEI totales',
  description:
    'Emisiones brutas totales de gases de efecto invernadero a nivel nacional, expresadas en kilotoneladas de CO₂ equivalente. Inventario nacional del IDEAM, 1990–2021.',
  question: '¿Están aumentando o disminuyendo las emisiones de gases de efecto invernadero de Colombia?',
  source: 'IDEAM',
  sourceUrl:
    'https://www.datos.gov.co/Ambiente-y-Desarrollo-Sostenible/Inventario-Nacional-Gases-Efecto-Invernadero/6rff-a5ep/about_data',
  resourceId: '6rff-a5ep',
  queryKey: 'ghgEmissions',
  query: '$select=a_o as ano,sum(total_emisiones) as total&$group=a_o&$order=a_o ASC',
  unit: 'kt CO₂eq',
  cacheTTL: 604800,
  positiveDirection: 'down',
})

// ---------------------------------------------------------------------------
// GHG emissions by IPCC sector — same dataset, grouped by clasificacion
// ---------------------------------------------------------------------------

export const GHG_BY_SECTOR_MANIFEST = indicatorManifest.parse({
  id: `${Sector.MedioAmbiente}_${EnvironmentIndicators.GhgBySector}`,
  sector: Sector.MedioAmbiente,
  label: 'Emisiones GEI por sector',
  description:
    'Emisiones brutas de gases de efecto invernadero desagregadas por los 5 sectores IPCC: Energía, Procesos industriales, Agricultura, Silvicultura/uso de la tierra (LULUCF) y Residuos.',
  question: '¿Qué sectores contribuyen más a las emisiones de gases de efecto invernadero en Colombia?',
  source: 'IDEAM',
  sourceUrl:
    'https://www.datos.gov.co/Ambiente-y-Desarrollo-Sostenible/Inventario-Nacional-Gases-Efecto-Invernadero/6rff-a5ep/about_data',
  resourceId: '6rff-a5ep',
  queryKey: 'ghgBySector',
  query:
    "$select=a_o,clasificacion,sum(total_emisiones) as total&$where=clasificacion in('1 Energía','2 Procesos industriales','3 Agricultura','4 Silvicultura, uso y cambio de uso de la tierra','5 Residuos')&$group=a_o,clasificacion&$order=a_o ASC&$limit=200",
  unit: 'kt CO₂eq',
  cacheTTL: 604800,
  positiveDirection: 'down',
})

// ---------------------------------------------------------------------------
// Environmental crimes — MinDefensa (9zck-qfvc)
// Uses SoQL aggregation: yearly count
// ---------------------------------------------------------------------------

export const ENVIRONMENTAL_CRIMES_MANIFEST = indicatorManifest.parse({
  id: `${Sector.MedioAmbiente}_${EnvironmentIndicators.EnvironmentalCrimes}`,
  sector: Sector.MedioAmbiente,
  label: 'Delitos ambientales',
  description:
    'Delitos contra el medio ambiente tipificados en el Código Penal colombiano (arts. 328–339), incluyendo aprovechamiento ilícito de recursos naturales, minería ilegal, daño ambiental y contaminación.',
  question: '¿Se están persiguiendo efectivamente los delitos ambientales en Colombia?',
  source: 'Ministerio de Defensa Nacional',
  sourceUrl:
    'https://www.datos.gov.co/Seguridad-y-Defensa/DELITOS-CONTRA-EL-MEDIO-AMBIENTE/9zck-qfvc/about_data',
  resourceId: '9zck-qfvc',
  queryKey: 'environmentalCrimes',
  query: '$select=date_extract_y(fecha_hecho) as ano,sum(cantidad) as total&$group=ano&$order=ano ASC',
  unit: 'casos',
  cacheTTL: 86400,
  positiveDirection: 'down',
})

// ---------------------------------------------------------------------------
// World Bank indicators
// ---------------------------------------------------------------------------

export const FOREST_AREA_MANIFEST = indicatorManifest.parse({
  id: `${Sector.MedioAmbiente}_${EnvironmentIndicators.ForestArea}`,
  sector: Sector.MedioAmbiente,
  label: 'Cobertura forestal',
  description:
    'Área de bosque como porcentaje del área terrestre total. Incluye plantaciones forestales y bosque natural. Fuente: FAO vía Banco Mundial.',
  question: '¿Cuánto bosque ha perdido Colombia y se está frenando la deforestación?',
  source: 'Banco Mundial',
  sourceUrl: 'https://datos.bancomundial.org/indicador/AG.LND.FRST.ZS?locations=CO',
  resourceId: 'AG.LND.FRST.ZS',
  queryKey: 'wbForestArea',
  unit: '%',
  cacheTTL: 2592000,
  positiveDirection: 'up',
})

export const PM25_POLLUTION_MANIFEST = indicatorManifest.parse({
  id: `${Sector.MedioAmbiente}_${EnvironmentIndicators.Pm25Pollution}`,
  sector: Sector.MedioAmbiente,
  label: 'Contaminación PM2.5',
  description:
    'Exposición media anual a partículas finas PM2.5 (microgramos por metro cúbico). El límite recomendado por la OMS es 5 μg/m³.',
  question: '¿Está respirando Colombia un aire más limpio que hace 30 años?',
  source: 'Banco Mundial',
  sourceUrl: 'https://datos.bancomundial.org/indicador/EN.ATM.PM25.MC.M3?locations=CO',
  resourceId: 'EN.ATM.PM25.MC.M3',
  queryKey: 'wbPm25Pollution',
  unit: 'μg/m³',
  cacheTTL: 2592000,
  positiveDirection: 'down',
})

export const PROTECTED_AREAS_MANIFEST = indicatorManifest.parse({
  id: `${Sector.MedioAmbiente}_${EnvironmentIndicators.ProtectedAreas}`,
  sector: Sector.MedioAmbiente,
  label: 'Áreas protegidas',
  description:
    'Áreas terrestres y marinas protegidas como porcentaje del área territorial total. Incluye parques nacionales, reservas y santuarios.',
  question: '¿Cuánto territorio colombiano está protegido y crece al ritmo necesario?',
  source: 'Banco Mundial',
  sourceUrl: 'https://datos.bancomundial.org/indicador/ER.PTD.TOTL.ZS?locations=CO',
  resourceId: 'ER.PTD.TOTL.ZS',
  queryKey: 'wbProtectedAreas',
  unit: '%',
  cacheTTL: 2592000,
  positiveDirection: 'up',
})

// ---------------------------------------------------------------------------
// Max air temperature — IDEAM weather stations (ccvq-rp9s)
// Uses SoQL aggregation: national yearly average of hourly max temp readings
// ---------------------------------------------------------------------------

export const MAX_TEMPERATURE_MANIFEST = indicatorManifest.parse({
  id: `${Sector.MedioAmbiente}_${EnvironmentIndicators.MaxTemperature}`,
  sector: Sector.MedioAmbiente,
  label: 'Temperatura máxima promedio',
  description:
    'Promedio nacional anual de la temperatura máxima del aire registrada cada hora en estaciones meteorológicas del IDEAM. Datos verificados con control de calidad básico según recomendaciones de la OMM.',
  question: '¿Está subiendo la temperatura máxima promedio en Colombia?',
  source: 'IDEAM',
  sourceUrl:
    'https://www.datos.gov.co/Ambiente-y-Desarrollo-Sostenible/Temperatura-M-xima-del-Aire/ccvq-rp9s/about_data',
  resourceId: 'ccvq-rp9s',
  queryKey: 'maxTemperature',
  query:
    '$select=date_extract_y(fechaobservacion) as ano,avg(valorobservado) as total&$where=valorobservado>0&$group=ano&$order=ano ASC',
  unit: '°C',
  cacheTTL: 604800,
  positiveDirection: 'down',
})

// ---------------------------------------------------------------------------
// Air quality — IDEAM/SISAIRE (g4t8-zkc3)
// Uses SoQL aggregation on 24h-average readings (duraci_n=1440)
// ---------------------------------------------------------------------------

export const AIR_QUALITY_MANIFEST = indicatorManifest.parse({
  id: `${Sector.MedioAmbiente}_${EnvironmentIndicators.AirQuality}`,
  sector: Sector.MedioAmbiente,
  label: 'Calidad del aire por contaminante',
  description:
    'Concentración promedio anual de PM2.5, PM10 y SO₂ a nivel nacional, basada en promedios de 24 horas de estaciones de monitoreo SISAIRE del IDEAM.',
  question:
    '¿Está mejorando o empeorando la calidad del aire en Colombia, y qué contaminantes son los más críticos?',
  source: 'IDEAM / SISAIRE',
  sourceUrl:
    'https://www.datos.gov.co/Ambiente-y-Desarrollo-Sostenible/Calidad-del-Aire/g4t8-zkc3/about_data',
  resourceId: 'g4t8-zkc3',
  queryKey: 'airQuality',
  query:
    "$select=date_extract_y(med_fecha_inicio) as year,msfl_code,avg(med_concentracion_estandar) as avg_conc&$where=msfl_code in('PM2.5','PM10','SO2') AND med_concentracion_estandar > 0 AND duraci_n=1440&$group=year,msfl_code&$order=year ASC&$limit=100",
  unit: 'μg/m³',
  cacheTTL: 86400,
  positiveDirection: 'down',
})

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export const ENVIRONMENT_CATEGORIES: SectorCategory<EnvironmentIndicators>[] = [
  {
    id: 'emissions-climate',
    label: 'Emisiones y clima',
    description: 'Gases de efecto invernadero, calidad del aire y cobertura forestal.',
    items: [
      { type: 'indicator', id: EnvironmentIndicators.GhgEmissions },
      {
        type: 'multi-series',
        id: EnvironmentIndicators.GhgBySector,
        series: [
          { key: 'energia', label: 'Energía', color: 'oklch(0.62 0.21 260)' },
          { key: 'agricultura', label: 'Agricultura', color: 'oklch(0.72 0.17 145)' },
          { key: 'silvicultura', label: 'Silvicultura / LULUCF', color: 'oklch(0.68 0.19 165)' },
          { key: 'residuos', label: 'Residuos', color: 'oklch(0.75 0.18 75)' },
          { key: 'industria', label: 'Procesos industriales', color: 'oklch(0.65 0.22 350)' },
        ],
      },
      { type: 'indicator', id: EnvironmentIndicators.Pm25Pollution },
      {
        type: 'multi-series',
        id: EnvironmentIndicators.AirQuality,
        series: [
          { key: 'pm25', label: 'PM2.5', color: 'oklch(0.65 0.22 25)' },
          { key: 'pm10', label: 'PM10', color: 'oklch(0.62 0.21 260)' },
          { key: 'so2', label: 'SO₂', color: 'oklch(0.72 0.17 145)' },
        ],
      },
      { type: 'indicator', id: EnvironmentIndicators.ForestArea },
      { type: 'indicator', id: EnvironmentIndicators.MaxTemperature },
    ],
  },
  {
    id: 'protection',
    label: 'Protección ambiental',
    description: 'Delitos ambientales y áreas protegidas del territorio nacional.',
    items: [
      { type: 'indicator', id: EnvironmentIndicators.EnvironmentalCrimes },
      { type: 'indicator', id: EnvironmentIndicators.ProtectedAreas },
    ],
  },
]
