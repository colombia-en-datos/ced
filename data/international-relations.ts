import { Sector } from '@/config/sectors'
import { indicatorManifest, type SectorCategory } from './types'

export enum RelacionesIndicators {
  // Immigration / Visas
  VisasIssued = 'visas_issued',
  VenezuelaVisas = 'venezuela_visas',

  // Diaspora
  Diaspora = 'diaspora',
  ReturnMigration = 'return_migration',

  // Diplomacy
  Treaties = 'treaties',

  // Consular Protection
  DetainedAbroad = 'detained_abroad',
  ConsularAssistance = 'consular_assistance',
}

const MINEXTERIOR = 'Ministerio de Relaciones Exteriores'

// ---------------------------------------------------------------------------
// Immigration / Visas
// ---------------------------------------------------------------------------

export const VISAS_ISSUED_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Relaciones}_${RelacionesIndicators.VisasIssued}`,
  sector: Sector.Relaciones,
  label: 'Visas colombianas expedidas',
  description:
    'Volumen anual de visas colombianas expedidas a extranjeros desde 2017, por nacionalidad y tipo de documento (permanente/temporal).',
  question: '¿Cuántas visas otorga Colombia cada año y a qué nacionalidades?',
  source: MINEXTERIOR,
  sourceUrl: 'https://www.datos.gov.co/resource/mgr2-njqc',
  resourceId: 'mgr2-njqc',
  queryKey: 'relaciones_visas_issued',
  query: '$select=anio as ano,sum(cantidad) as total&$group=anio&$order=anio ASC',
  unit: 'visas',
  cacheTTL: 604800,
  positiveDirection: 'up' as const,
})

export const VENEZUELA_VISAS_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Relaciones}_${RelacionesIndicators.VenezuelaVisas}`,
  sector: Sector.Relaciones,
  label: 'Visas a nacionales de Venezuela',
  description:
    'Visas colombianas expedidas a ciudadanos venezolanos por tipo (temporal, migrante, residente, visitante, traspasos, negocios). Refleja la gestión migratoria de la crisis venezolana.',
  question: '¿Cómo gestiona Colombia la inmigración venezolana?',
  source: MINEXTERIOR,
  sourceUrl: 'https://www.datos.gov.co/resource/yj6h-yjbu',
  resourceId: 'yj6h-yjbu',
  queryKey: 'relaciones_venezuela_visas',
  query:
    '$select=a_o_expedici_n,tipo_de_visa,sum(numero) as total&$group=a_o_expedici_n,tipo_de_visa&$order=a_o_expedici_n ASC',
  unit: 'visas',
  cacheTTL: 604800,
  positiveDirection: 'up' as const,
})

// ---------------------------------------------------------------------------
// Diaspora
// ---------------------------------------------------------------------------

export const DIASPORA_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Relaciones}_${RelacionesIndicators.Diaspora}`,
  sector: Sector.Relaciones,
  label: 'Colombianos registrados en el exterior',
  description:
    'Connacionales inscritos en el Registro Ciudadano en Línea que manifiestan residir en el exterior. Incluye datos por país, nivel académico y perfil demográfico.',
  question: '¿Cuántos colombianos viven en el exterior y dónde?',
  source: MINEXTERIOR,
  sourceUrl: 'https://www.datos.gov.co/resource/y399-rzwf',
  resourceId: 'y399-rzwf',
  queryKey: 'relaciones_diaspora',
  query:
    '$select=substring(fecha_de_registro,1,4) as ano,sum(cantidad_de_personas) as total&$group=substring(fecha_de_registro,1,4)&$order=ano ASC',
  unit: 'registros',
  cacheTTL: 604800,
  positiveDirection: 'up' as const,
})

export const RETURN_MIGRATION_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Relaciones}_${RelacionesIndicators.ReturnMigration}`,
  sector: Sector.Relaciones,
  label: 'Solicitudes de retorno (RUR)',
  description:
    'Solicitudes procesadas de colombianos que retornan del exterior bajo la Ley 1565 de 2012. Incluye retorno humanitario, laboral y voluntario.',
  question: '¿Cuántos colombianos están retornando del exterior?',
  source: MINEXTERIOR,
  sourceUrl: 'https://www.datos.gov.co/resource/6cta-vqaf',
  resourceId: '6cta-vqaf',
  queryKey: 'relaciones_return_migration',
  query:
    '$select=substring(fecha_acta,1,4) as ano,sum(numero) as total&$group=substring(fecha_acta,1,4)&$order=ano ASC',
  unit: 'solicitudes',
  cacheTTL: 604800,
  positiveDirection: 'up' as const,
})

// ---------------------------------------------------------------------------
// Diplomacy
// ---------------------------------------------------------------------------

export const TREATIES_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Relaciones}_${RelacionesIndicators.Treaties}`,
  sector: Sector.Relaciones,
  label: 'Tratados internacionales vigentes',
  description:
    'Tratados internacionales de Colombia con otros estados y organismos internacionales. Incluye tratados bilaterales y multilaterales por tema.',
  question: '¿Cuántos tratados internacionales activos tiene Colombia?',
  source: MINEXTERIOR,
  sourceUrl: 'https://www.datos.gov.co/resource/fdir-hk5z',
  resourceId: 'fdir-hk5z',
  queryKey: 'relaciones_treaties',
  query:
    "$select=substring(fechaadopcion,7,4) as ano,count(*) as total&$where=vigente='SI' AND fechaadopcion!='(NO REGISTRA)'&$group=substring(fechaadopcion,7,4)&$order=ano ASC",
  unit: 'tratados',
  cacheTTL: 604800,
  positiveDirection: 'up' as const,
})

// ---------------------------------------------------------------------------
// Consular Protection
// ---------------------------------------------------------------------------

export const DETAINED_ABROAD_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Relaciones}_${RelacionesIndicators.DetainedAbroad}`,
  sector: Sector.Relaciones,
  label: 'Colombianos detenidos en el exterior',
  description:
    'Censo mensual de colombianos detenidos en el exterior por país, delito y situación jurídica. Narcotráfico representa el 41% de los casos.',
  question: '¿Cuántos colombianos están detenidos en el exterior y por qué delitos?',
  source: MINEXTERIOR,
  sourceUrl: 'https://www.datos.gov.co/resource/e97j-vuf7',
  resourceId: 'e97j-vuf7',
  queryKey: 'relaciones_detained_abroad',
  query:
    '$select=fecha_publicaci_n as fecha,sum(cantidad) as total&$group=fecha_publicaci_n&$order=fecha_publicaci_n ASC',
  unit: 'detenidos',
  cacheTTL: 86400,
  positiveDirection: 'down' as const,
})

export const CONSULAR_ASSISTANCE_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Relaciones}_${RelacionesIndicators.ConsularAssistance}`,
  sector: Sector.Relaciones,
  label: 'Asistencias consulares',
  description:
    'Asistencias brindadas a connacionales en el exterior por categoría: derechos migratorios, precariedad económica, vulneración de derechos, ley de víctimas y más.',
  question: '¿Cuántas asistencias consulares brinda Colombia en el exterior?',
  source: MINEXTERIOR,
  sourceUrl: 'https://www.datos.gov.co/resource/p62d-8cf3',
  resourceId: 'p62d-8cf3',
  queryKey: 'relaciones_consular_assistance',
  query:
    '$select=a_o_asistencia as ano,sum(cantidad) as total&$group=a_o_asistencia&$order=a_o_asistencia ASC',
  unit: 'asistencias',
  cacheTTL: 604800,
  positiveDirection: 'up' as const,
})

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export const RELACIONES_CATEGORIES: SectorCategory<RelacionesIndicators>[] = [
  {
    id: 'immigration',
    label: 'Inmigración y visas',
    description: 'Visas expedidas por Colombia a extranjeros y gestión migratoria de la crisis venezolana.',
    items: [
      { type: 'indicator', id: RelacionesIndicators.VisasIssued },
      {
        type: 'stacked-area',
        id: RelacionesIndicators.VenezuelaVisas,
        series: [
          { key: 'temporal', label: 'Temporal', color: '#6366f1' },
          { key: 'migrante', label: 'Migrante', color: '#f59e0b' },
          { key: 'residente', label: 'Residente', color: '#10b981' },
          { key: 'visitante', label: 'Visitante', color: '#ef4444' },
          { key: 'traspasos', label: 'Traspasos', color: '#8b5cf6' },
          { key: 'negocios', label: 'Negocios', color: '#64748b' },
        ],
      },
    ],
  },
  {
    id: 'diaspora',
    label: 'Diáspora colombiana',
    description: 'Colombianos registrados en el exterior y solicitudes de retorno al país.',
    items: [
      { type: 'indicator', id: RelacionesIndicators.Diaspora },
      { type: 'indicator', id: RelacionesIndicators.ReturnMigration },
    ],
  },
  {
    id: 'diplomacy',
    label: 'Diplomacia',
    description: 'Actividad diplomática de Colombia: tratados internacionales vigentes por año de adopción.',
    items: [{ type: 'indicator', id: RelacionesIndicators.Treaties }],
  },
  {
    id: 'consular-protection',
    label: 'Protección consular',
    description: 'Asistencia consular y colombianos detenidos en el exterior.',
    items: [
      { type: 'indicator', id: RelacionesIndicators.ConsularAssistance },
      { type: 'indicator', id: RelacionesIndicators.DetainedAbroad },
    ],
  },
]
