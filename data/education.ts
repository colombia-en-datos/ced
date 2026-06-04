import { Sector } from '@/config/sectors'
import { indicatorManifest, type SectorCategory } from './types'

export enum EducationIndicators {
  Dropout = 'dropout',
  Enrollment = 'enrollment',
  Graduates = 'graduates',
  HigherEdEnrollment = 'higher_ed_enrollment',
  NetCoverage = 'net_coverage',
  OfficialTeachers = 'official_teachers',
  Saber11 = 'saber_11',
  Schools = 'schools',
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

export const OFFICIAL_TEACHERS_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Educacion}_${EducationIndicators.OfficialTeachers}`,
  sector: Sector.Educacion,
  label: 'Docentes oficiales EPBM',
  description: 'Número de docentes oficiales de Educación Preescolar, Básica y Media en Colombia desde 2015.',
  source: 'MinEducación',
  sourceUrl: 'https://www.datos.gov.co/Educaci-n/MEN_DOCENTES_OFICIALES_EPBM/pgrh-8um9/about_data',
  resourceId: 'pgrh-8um9',
  queryKey: 'officialTeachers',
  query: '$select=anno_inf,sum(docentes_n) as total&$group=anno_inf&$order=anno_inf ASC',
  unit: 'docentes',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

export const GRADUATES_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Educacion}_${EducationIndicators.Graduates}`,
  sector: Sector.Educacion,
  label: 'Número de bachilleres',
  description: 'Graduados de educación media (grados 11 y ciclo 26) por año a nivel nacional, desde 2019.',
  source: 'MinEducación',
  sourceUrl: 'https://www.datos.gov.co/Educaci-n/MEN_N-MERO_BACHILLERES_POR_ETC/5c2k-ahfc/about_data',
  resourceId: '5c2k-ahfc',
  queryKey: 'graduates',
  // Exclude codigo_etc='1' — duplicate aggregate rows only present in 2022 that double-count graduates
  query:
    "$select=a_o,sum(aprobados_11_total) as grado_11,sum(aprobados_26_total) as ciclo_adultos&$where=codigo_etc <> '1'&$group=a_o&$order=a_o ASC",
  unit: 'bachilleres',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

export const SABER_11_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Educacion}_${EducationIndicators.Saber11}`,
  sector: Sector.Educacion,
  label: 'Resultados Saber 11 por área',
  description:
    'Puntaje promedio por área del examen Saber 11 a nivel nacional. Disponible desde 2014, cuando se adoptó la escala actual.',
  source: 'ICFES',
  sourceUrl: 'https://www.datos.gov.co/Educaci-n/Resultados-nicos-Saber-11/kgxf-xxbe/about_data',
  resourceId: 'kgxf-xxbe',
  queryKey: 'saber11',
  query:
    '$select=substring(periodo, 0, 5) as year, avg(punt_matematicas :: number) as matematicas, avg(punt_ingles :: number) as ingles, avg(punt_lectura_critica :: number) as lectura_critica, avg(punt_c_naturales :: number) as c_naturales, avg(punt_sociales_ciudadanas :: number) as sociales, count(*) as total&$where=punt_lectura_critica IS NOT NULL&$group=substring(periodo, 0, 5)&$order=year ASC',
  unit: 'puntos promedio',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

export const HIGHER_ED_ENROLLMENT_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Educacion}_${EducationIndicators.HigherEdEnrollment}`,
  sector: Sector.Educacion,
  label: 'Matrícula en educación superior',
  description: 'Matrícula estadística de educación superior desde 2015. Fuente: MinEducación.',
  source: 'MinEducación',
  sourceUrl: 'https://www.datos.gov.co/Educaci-n/MEN_MATRICULA_ESTADISTICA_ES/5wck-szir/about_data',
  resourceId: '5wck-szir',
  queryKey: 'higherEdEnrollment',
  query: '$select=a_o,sum(matriculados_2015) as total&$group=a_o&$order=a_o ASC',
  unit: 'matriculados',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

export const SCHOOLS_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Educacion}_${EducationIndicators.Schools}`,
  sector: Sector.Educacion,
  label: 'Establecimientos educativos EPBM',
  description: 'Número de establecimientos educativos de Preescolar, Básica y Media en Colombia desde 2015.',
  source: 'MinEducación',
  sourceUrl:
    'https://www.datos.gov.co/Educaci-n/MEN_ESTABLECIMIENTOS_EDUCATIVOS_PREESCOLAR_B-SICA_/cfw5-qzt5/about_data',
  resourceId: 'cfw5-qzt5',
  queryKey: 'schools',
  query: '$select=a_o,count(distinct nombre_establecimiento) as total&$group=a_o&$order=a_o ASC',
  unit: 'establecimientos',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export const EDUCATION_CATEGORIES: SectorCategory<EducationIndicators>[] = [
  {
    id: 'coverage',
    label: 'Cobertura y acceso',
    description: 'Indicadores de matrícula y cobertura en todos los niveles educativos.',
    items: [
      { type: 'indicator', id: EducationIndicators.Enrollment },
      {
        type: 'multi-series',
        id: EducationIndicators.NetCoverage,
        series: [
          { key: 'transicion', label: 'Transición', color: 'oklch(0.72 0.17 195)' },
          { key: 'primaria', label: 'Primaria', color: 'oklch(0.62 0.21 260)' },
          { key: 'secundaria', label: 'Secundaria', color: 'oklch(0.75 0.18 75)' },
          { key: 'media', label: 'Media', color: 'oklch(0.65 0.22 350)' },
        ],
      },
      { type: 'indicator', id: EducationIndicators.HigherEdEnrollment },
    ],
  },
  {
    id: 'retention',
    label: 'Permanencia y graduación',
    description: 'Deserción escolar y graduados del sistema educativo.',
    items: [
      {
        type: 'multi-series',
        id: EducationIndicators.Dropout,
        series: [
          { key: 'transicion', label: 'Transición', color: 'oklch(0.72 0.17 195)' },
          { key: 'primaria', label: 'Primaria', color: 'oklch(0.62 0.21 260)' },
          { key: 'secundaria', label: 'Secundaria', color: 'oklch(0.75 0.18 75)' },
          { key: 'media', label: 'Media', color: 'oklch(0.65 0.22 350)' },
        ],
      },
      {
        type: 'multi-series',
        id: EducationIndicators.Graduates,
        series: [
          { key: 'grado11', label: 'Grado 11', color: 'oklch(0.72 0.17 195)' },
          { key: 'cicloAdultos', label: 'Ciclo adultos (grado 26)', color: 'oklch(0.75 0.18 75)' },
        ],
      },
    ],
  },
  {
    id: 'quality',
    label: 'Calidad',
    description: 'Resultados de evaluaciones estandarizadas y calidad educativa.',
    items: [
      {
        type: 'multi-series',
        id: EducationIndicators.Saber11,
        series: [
          { key: 'matematicas', label: 'Matemáticas', color: 'oklch(0.62 0.21 260)' },
          { key: 'lecturaCritica', label: 'Lectura crítica', color: 'oklch(0.72 0.17 195)' },
          { key: 'cNaturales', label: 'C. Naturales', color: 'oklch(0.68 0.16 145)' },
          { key: 'sociales', label: 'Sociales y ciudadanas', color: 'oklch(0.75 0.18 75)' },
          { key: 'ingles', label: 'Inglés', color: 'oklch(0.65 0.22 350)' },
        ],
      },
    ],
  },
  {
    id: 'infrastructure',
    label: 'Infraestructura',
    description: 'Recursos del sistema educativo: docentes y establecimientos.',
    items: [
      { type: 'indicator', id: EducationIndicators.OfficialTeachers },
      { type: 'indicator', id: EducationIndicators.Schools },
    ],
  },
]
