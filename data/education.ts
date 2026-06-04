import { Sector } from '@/config/sectors'
import { indicatorManifest } from './types'

export enum EducationIndicators {
  Dropout = 'dropout',
  Enrollment = 'enrollment',
  NetCoverage = 'net_coverage',
}

export const BASIC_EDUCATION_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Educacion}_basic_education_stats`,
  sector: Sector.Educacion,
  label: 'Estadísticas de educación básica y media',
  description:
    'Indicadores de cobertura, matrícula y deserción en preescolar, básica y media por departamento. Fuente: MinEducación.',
  source: 'MinEducación',
  sourceUrl:
    'https://www.datos.gov.co/Educaci-n/MEN_ESTADISTICAS_EN_EDUCACION_EN_PREESCOLAR-B-SICA/ji8i-4anb/about_data',
  resourceId: 'ji8i-4anb',
  queryKey: 'educationStats',
  orderField: 'ano',
  limit: 600,
  unit: '%',
  cacheTTL: 604800,
  positiveDirection: 'up',
})
