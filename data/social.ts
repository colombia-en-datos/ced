import { Sector } from '@/config/sectors'
import { indicatorManifest, type SectorCategory } from './types'

export enum SocialIndicators {
  // Social programs (DPS)
  FamiliasEnAccion = 'familias_en_accion',
  FamiliasEnSuTierra = 'familias_en_su_tierra',
  EmpleoParaLaProsperidad = 'empleo_para_la_prosperidad',
  MiNegocio = 'mi_negocio',
  Iraca = 'iraca',
  Resa = 'resa',
  EmprendimientoColectivo = 'emprendimiento_colectivo',
  CasaDigna = 'casa_digna',
  InfraestructuraSocial = 'infraestructura_social',
  SubsidiosVivienda = 'subsidios_vivienda',

  // Children & early childhood (ICBF)
  PardNna = 'pard_nna',
  IcbfPrevencion = 'icbf_prevencion',
  Bienestarina = 'bienestarina',

  // World Bank
  GiniIndex = 'gini_index',
  PovertyHeadcount = 'poverty_headcount',
  NetMigration = 'net_migration',
}

// ---------------------------------------------------------------------------
// DPS beneficiary datasets — shared SoQL pattern:
//   substring(fechainscripcionbeneficiario,0,5) as ano,
//   sum(cantidaddebeneficiarios) as total
// ---------------------------------------------------------------------------

const DPS_SOURCE = 'Departamento Administrativo para la Prosperidad Social (DPS)'

function dpsManifest(
  id: SocialIndicators,
  label: string,
  description: string,
  resourceId: string,
  opts?: { query?: string; unit?: string; positiveDirection?: 'up' | 'down'; question?: string }
) {
  return indicatorManifest.parse({
    id: `${Sector.Social}_${id}`,
    sector: Sector.Social,
    label,
    description,
    question: opts?.question,
    source: DPS_SOURCE,
    sourceUrl: `https://www.datos.gov.co/resource/${resourceId}`,
    resourceId,
    queryKey: `social_${id}`,
    query:
      opts?.query ??
      '$select=substring(fechainscripcionbeneficiario,0,5) as ano,sum(cantidaddebeneficiarios) as total&$group=substring(fechainscripcionbeneficiario,0,5)&$order=ano ASC',
    unit: opts?.unit ?? 'beneficiarios',
    cacheTTL: 604800,
    positiveDirection: opts?.positiveDirection ?? 'up',
  })
}

export const FAMILIAS_EN_ACCION_MANIFEST = dpsManifest(
  SocialIndicators.FamiliasEnAccion,
  'Más Familias en Acción',
  'Beneficiarios inscritos al programa Más Familias en Acción, el principal programa de transferencias monetarias condicionadas del gobierno. Otorga incentivos a familias en pobreza y pobreza extrema.',
  'xfif-myr2',
  { question: '¿Cuántas familias reciben el principal programa de transferencias del gobierno?' }
)

export const FAMILIAS_EN_SU_TIERRA_MANIFEST = dpsManifest(
  SocialIndicators.FamiliasEnSuTierra,
  'Familias en su Tierra',
  'Beneficiarios del programa Familias en su Tierra, orientado a apoyar a familias desplazadas que retornan a sus territorios o se reubican.',
  'mebh-t5gy',
  { question: '¿Se está apoyando a las familias desplazadas que retornan a sus territorios?' }
)

export const EMPLEO_PARA_LA_PROSPERIDAD_MANIFEST = dpsManifest(
  SocialIndicators.EmpleoParaLaProsperidad,
  'Empleo para la Prosperidad',
  'Beneficiarios del programa de empleo para poblaciones vulnerables y en situación de pobreza extrema.',
  'bis6-3he6',
  { question: '¿Está el gobierno ayudando a la población vulnerable a encontrar empleo?' }
)

export const MI_NEGOCIO_MANIFEST = dpsManifest(
  SocialIndicators.MiNegocio,
  'Mi Negocio',
  'Beneficiarios del programa Mi Negocio, que genera oportunidades para la creación y desarrollo de proyectos productivos mediante capitalización de negocios y emprendimientos.',
  'igeg-jgr5',
  { question: '¿Se está ayudando a la población vulnerable a crear negocios?' }
)

export const IRACA_MANIFEST = dpsManifest(
  SocialIndicators.Iraca,
  'IRACA',
  'Beneficiarios del programa IRACA de inclusión productiva, orientado a población vulnerable, desplazada o en pobreza extrema.',
  'y52n-eqn5',
  { question: '¿Está el programa de inclusión productiva llegando a la población desplazada?' }
)

export const RESA_MANIFEST = dpsManifest(
  SocialIndicators.Resa,
  'Red de Seguridad Alimentaria (ReSA)',
  'Beneficiarios de la Red de Seguridad Alimentaria, que mejora el acceso a alimentos mediante huertas caseras o comunitarias y educación nutricional.',
  '5m78-fkmq',
  { question: '¿Están los programas de seguridad alimentaria llegando a la población?' }
)

export const EMPRENDIMIENTO_COLECTIVO_MANIFEST = dpsManifest(
  SocialIndicators.EmprendimientoColectivo,
  'Emprendimiento Colectivo',
  'Beneficiarios del programa de fortalecimiento de competencias empresariales de organizaciones productivas formalmente constituidas.',
  'avhj-7jzw',
  { question: '¿Se está fortaleciendo el emprendimiento colectivo en comunidades vulnerables?' }
)

export const CASA_DIGNA_MANIFEST = dpsManifest(
  SocialIndicators.CasaDigna,
  'Casa Digna Vida Digna',
  'Beneficiarios del programa Casa Digna Vida Digna, que realiza mejoramientos de vivienda (cocinas, baños, pisos, techos) para reducir el déficit cualitativo de vivienda.',
  'rfqu-hy2f',
  {
    query:
      '$select=substring(fechaultimobeneficioasignado,0,5) as ano,sum(cantidaddebeneficiarios) as total&$group=substring(fechaultimobeneficioasignado,0,5)&$order=ano ASC',
    unit: 'hogares',
    question: '¿Están los mejoramientos de vivienda llegando a las familias vulnerables?',
  }
)

export const INFRAESTRUCTURA_SOCIAL_MANIFEST = dpsManifest(
  SocialIndicators.InfraestructuraSocial,
  'Infraestructura Social y Hábitat',
  'Hogares beneficiados por proyectos de infraestructura social y hábitat de Prosperidad Social.',
  'he2e-mqh9',
  {
    query: '$select=a_o as ano,sum(n_mero_de_hogares_beneficiados) as total&$group=a_o&$order=a_o ASC',
    unit: 'hogares',
    question: '¿Cuántos hogares se benefician de proyectos de infraestructura social?',
  }
)

// ---------------------------------------------------------------------------
// Housing subsidies — MinVivienda (h2yr-zfb2)
// ---------------------------------------------------------------------------

export const SUBSIDIOS_VIVIENDA_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Social}_${SocialIndicators.SubsidiosVivienda}`,
  sector: Sector.Social,
  label: 'Subsidios de vivienda asignados',
  description:
    'Hogares beneficiados con subsidios de vivienda asignados a nivel nacional. Incluye programas como Mi Casa Ya, Vivienda Gratuita, Semillero de Propietarios, Casa Digna Vida Digna y otros.',
  question: '¿Cuántos hogares reciben subsidios de vivienda del gobierno cada año?',
  source: 'Ministerio de Vivienda, Ciudad y Territorio',
  sourceUrl:
    'https://www.datos.gov.co/Vivienda-Ciudad-y-Territorio/Subsidios-De-Vivienda-Asignados/h2yr-zfb2/about_data',
  resourceId: 'h2yr-zfb2',
  queryKey: 'social_subsidios_vivienda',
  query:
    '$select=a_o_de_asignaci_n as ano,sum(hogares) as total&$group=a_o_de_asignaci_n&$order=a_o_de_asignaci_n ASC',
  unit: 'hogares',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

// ---------------------------------------------------------------------------
// ICBF — Children & early childhood
// ---------------------------------------------------------------------------

const ICBF_SOURCE = 'Instituto Colombiano de Bienestar Familiar (ICBF)'

export const PARD_NNA_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Social}_${SocialIndicators.PardNna}`,
  sector: Sector.Social,
  label: 'Procesos de restablecimiento de derechos (NNA)',
  description:
    'Niños, niñas y adolescentes que ingresan a un Proceso Administrativo de Restablecimiento de Derechos (PARD). Incluye motivos como maltrato, abuso, abandono y trabajo infantil.',
  question: '¿Cuántos niños ingresan a procesos de protección cada año?',
  source: ICBF_SOURCE,
  sourceUrl: 'https://www.datos.gov.co/resource/gj35-hct5',
  resourceId: 'gj35-hct5',
  queryKey: 'social_pard_nna',
  query: '$select=anno as ano,sum(cantidad_procesos) as total&$group=anno&$order=anno ASC',
  unit: 'procesos',
  cacheTTL: 604800,
  positiveDirection: 'down',
})

export const ICBF_PREVENCION_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Social}_${SocialIndicators.IcbfPrevencion}`,
  sector: Sector.Social,
  label: 'Beneficiarios prevención ICBF',
  description:
    'Beneficiarios atendidos en las estrategias, modalidades y programas de prevención del ICBF, incluyendo programas para niños, niñas, adolescentes y familias.',
  question: '¿Cuántos niños y familias se benefician de los programas de prevención del ICBF?',
  source: ICBF_SOURCE,
  sourceUrl: 'https://www.datos.gov.co/resource/g58z-k6f6',
  resourceId: 'g58z-k6f6',
  queryKey: 'social_icbf_prevencion',
  query: '$select=a_o as ano,sum(beneficiarios) as total&$group=a_o&$order=a_o ASC',
  unit: 'beneficiarios',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

export const BIENESTARINA_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Social}_${SocialIndicators.Bienestarina}`,
  sector: Sector.Social,
  label: 'Puntos de distribución Bienestarina',
  description:
    'Cantidad de puntos de distribución de Bienestarina (complemento alimentario del ICBF) activos a nivel nacional.',
  question: '¿Cuántos puntos de distribución de Bienestarina hay en el país?',
  source: ICBF_SOURCE,
  sourceUrl: 'https://www.datos.gov.co/resource/crxh-as6c',
  resourceId: 'crxh-as6c',
  queryKey: 'social_bienestarina',
  query: '$select=anno as ano,count(*) as total&$group=anno&$order=anno ASC',
  unit: 'puntos',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

// ---------------------------------------------------------------------------
// World Bank — structural indicators
// ---------------------------------------------------------------------------

export const GINI_INDEX_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Social}_${SocialIndicators.GiniIndex}`,
  sector: Sector.Social,
  label: 'Coeficiente GINI',
  description:
    'Índice de desigualdad de ingresos. 0 representa igualdad perfecta y 100 desigualdad máxima. Mide cómo se distribuye el ingreso entre la población.',
  question: '¿Está disminuyendo la desigualdad de ingresos en Colombia?',
  source: 'Banco Mundial',
  sourceUrl: 'https://datos.bancomundial.org/indicator/SI.POV.GINI?locations=CO',
  resourceId: 'SI.POV.GINI',
  queryKey: 'wbGiniIndex',
  unit: 'índice',
  cacheTTL: 2592000,
  positiveDirection: 'down',
})

export const POVERTY_HEADCOUNT_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Social}_${SocialIndicators.PovertyHeadcount}`,
  sector: Sector.Social,
  label: 'Pobreza monetaria',
  description: 'Porcentaje de la población que vive por debajo de la línea de pobreza nacional.',
  question: '¿Está disminuyendo la pobreza en Colombia?',
  source: 'Banco Mundial',
  sourceUrl: 'https://datos.bancomundial.org/indicador/SI.POV.NAHC?locations=CO',
  resourceId: 'SI.POV.NAHC',
  queryKey: 'wbPovertyHeadcount',
  unit: '%',
  cacheTTL: 2592000,
  positiveDirection: 'down',
})

export const NET_MIGRATION_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Social}_${SocialIndicators.NetMigration}`,
  sector: Sector.Social,
  label: 'Migración neta',
  description:
    'Diferencia entre el número de personas que entran y salen del país durante un período de cinco años. Valores negativos indican emigración neta.',
  question: '¿Más personas están entrando o saliendo de Colombia?',
  source: 'Banco Mundial',
  sourceUrl: 'https://datos.bancomundial.org/indicador/SM.POP.NETM?locations=CO',
  resourceId: 'SM.POP.NETM',
  queryKey: 'wbNetMigration',
  unit: 'personas',
  cacheTTL: 2592000,
  positiveDirection: 'up',
})

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export const SOCIAL_CATEGORIES: SectorCategory<SocialIndicators>[] = [
  {
    id: 'social-programs',
    label: 'Programas sociales',
    description:
      'Beneficiarios de los principales programas sociales del gobierno: transferencias, empleo, seguridad alimentaria, vivienda y emprendimiento.',
    items: [
      { type: 'indicator', id: SocialIndicators.FamiliasEnAccion },
      { type: 'indicator', id: SocialIndicators.Resa },
      { type: 'indicator', id: SocialIndicators.FamiliasEnSuTierra },
      { type: 'indicator', id: SocialIndicators.MiNegocio },
      { type: 'indicator', id: SocialIndicators.Iraca },
      { type: 'indicator', id: SocialIndicators.EmpleoParaLaProsperidad },
      { type: 'indicator', id: SocialIndicators.EmprendimientoColectivo },
      { type: 'indicator', id: SocialIndicators.CasaDigna },
      { type: 'indicator', id: SocialIndicators.SubsidiosVivienda },
      { type: 'indicator', id: SocialIndicators.InfraestructuraSocial },
    ],
  },
  {
    id: 'children',
    label: 'Primera infancia y niñez',
    description:
      'Indicadores de protección y bienestar infantil: procesos de restablecimiento de derechos, programas de prevención y nutrición.',
    items: [
      { type: 'indicator', id: SocialIndicators.PardNna },
      { type: 'indicator', id: SocialIndicators.IcbfPrevencion },
      { type: 'indicator', id: SocialIndicators.Bienestarina },
    ],
  },
  {
    id: 'inequality-poverty',
    label: 'Desigualdad y pobreza',
    description:
      'Indicadores estructurales de desigualdad de ingresos, pobreza monetaria y flujos migratorios.',
    items: [
      { type: 'indicator', id: SocialIndicators.GiniIndex },
      { type: 'indicator', id: SocialIndicators.PovertyHeadcount },
      { type: 'indicator', id: SocialIndicators.NetMigration },
    ],
  },
]
