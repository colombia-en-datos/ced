import { Sector } from '@/config/sectors'
import { indicatorManifest, type SectorCategory } from './types'

export enum TechnologyIndicators {
  ComputersForEdu = 'computers_for_edu',
  CyberIncidents = 'cyber_incidents',
  CyberIncidentsByType = 'cyber_incidents_by_type',
  FixedInternet = 'fixed_internet',
  HighTechExports = 'hightech_exports',
  IctServiceExports = 'ict_service_exports',
  InternetUsers = 'internet_users',
  MobileInternet = 'mobile_internet',
  MobileSubscribers = 'mobile_subscribers',
  RdFunding = 'rd_funding',
  RdSpending = 'rd_spending',
  ResearchGroups = 'research_groups',
  Researchers = 'researchers',
  ScientificArticles = 'scientific_articles',
}

// ---------------------------------------------------------------------------
// Socrata — Telefonía Móvil abonados por categoría (nrst-mwx4)
// Stacked area: prepago vs pospago, aggregated quarterly across all providers
// ---------------------------------------------------------------------------

export const MOBILE_SUBSCRIBERS_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Tecnologia}_${TechnologyIndicators.MobileSubscribers}`,
  sector: Sector.Tecnologia,
  label: 'Abonados de telefonía móvil',
  description:
    'Abonados de telefonía móvil en servicio, desglosados por categoría (prepago vs pospago), agregados trimestralmente a nivel nacional. Fuente: MinTIC.',
  question:
    '¿Cuántos abonados de telefonía móvil tiene Colombia y cómo se distribuyen entre prepago y pospago?',
  source: 'MinTIC',
  sourceUrl:
    'https://www.datos.gov.co/Ciencia-Tecnolog-a-e-Innovaci-n/Telefon-a-M-vil-abonados-por-categor-a/nrst-mwx4/about_data',
  resourceId: 'nrst-mwx4',
  queryKey: 'mobileSubscribers',
  query:
    '$select=a_o,trimestre,sum(abonados_prepago::number) as prepago,sum(abonados_pospago::number) as pospago&$group=a_o,trimestre&$order=a_o,trimestre&$limit=500',
  unit: 'abonados',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

// ---------------------------------------------------------------------------
// Socrata — Internet Fijo accesos por tecnología y segmento (n48w-gutb)
// Stacked area: by technology group (Fibra, HFC, Cable, xDSL, Otros)
// ---------------------------------------------------------------------------

export const FIXED_INTERNET_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Tecnologia}_${TechnologyIndicators.FixedInternet}`,
  sector: Sector.Tecnologia,
  label: 'Accesos de internet fijo por tecnología',
  description:
    'Accesos de internet fijo a nivel nacional agrupados por tecnología de acceso (Fibra, HFC, Cable, xDSL y otras), con resolución trimestral. Fuente: MinTIC.',
  question: '¿Cuántas conexiones de internet fijo tiene Colombia y qué tecnologías predominan?',
  source: 'MinTIC',
  sourceUrl:
    'https://www.datos.gov.co/Ciencia-Tecnolog-a-e-Innovaci-n/Internet-Fijo-Accesos-por-tecnolog-a-y-segmento/n48w-gutb/about_data',
  resourceId: 'n48w-gutb',
  queryKey: 'fixedInternet',
  query:
    '$query=SELECT anno,trimestre,tecnologia,sum(no_de_accesos::number) as total GROUP BY anno,trimestre,tecnologia ORDER BY anno,trimestre LIMIT 50000',
  unit: 'accesos',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

// ---------------------------------------------------------------------------
// Socrata — Internet Móvil, segmento y tráfico por proveedor (4z5v-cr6b)
// Multi-series line: traffic by provider (top 5 + "Otros"), annual
// ---------------------------------------------------------------------------

export const MOBILE_INTERNET_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Tecnologia}_${TechnologyIndicators.MobileInternet}`,
  sector: Sector.Tecnologia,
  label: 'Tráfico de internet móvil por proveedor',
  description:
    'Tráfico total de internet móvil (prepago + pospago) por proveedor a nivel nacional, en terabytes. Los 5 proveedores principales se muestran individualmente y el resto se agrupa como "Otros". Fuente: MinTIC.',
  question: '¿Cuánto tráfico de internet móvil fluye por las redes colombianas y quién lo domina?',
  source: 'MinTIC',
  sourceUrl:
    'https://www.datos.gov.co/Ciencia-Tecnolog-a-e-Innovaci-n/Internet-M-vil-segmento-y-tr-fico-por-proveedor/4z5v-cr6b/about_data',
  resourceId: '4z5v-cr6b',
  queryKey: 'mobileInternet',
  query: '$select=a_o,trimestre,proveedor,segmento,tr_fico&$order=a_o,trimestre&$limit=1000',
  unit: 'TB',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

// ---------------------------------------------------------------------------
// Socrata — Computadores Para Educar (pyqj-s96k)
// Stacked bar: PCs, tablets estudiantes, tablets docentes por año
// ---------------------------------------------------------------------------

export const COMPUTERS_FOR_EDU_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Tecnologia}_${TechnologyIndicators.ComputersForEdu}`,
  sector: Sector.Tecnologia,
  label: 'Computadores Para Educar',
  description:
    'Terminales entregadas a sedes educativas por el programa Computadores Para Educar, desagregadas por tipo (PCs, tablets para estudiantes, tablets para docentes). Incluye aportes de MinTIC y entidades territoriales.',
  question: '¿Cuántos computadores y tabletas se han entregado a los colegios del país?',
  source: 'MinTIC',
  sourceUrl:
    'https://www.datos.gov.co/Ciencia-Tecnolog-a-e-Innovaci-n/Computadores-Para-Educar/pyqj-s96k/about_data',
  resourceId: 'pyqj-s96k',
  queryKey: 'computersForEdu',
  query:
    '$select=anio,sum(pc_entregados_mintic::number) as pcs_mintic,sum(pc_aportados_por_et::number) as pcs_et,sum(tabletas_mintic_estudiantes::number) as tablets_students,sum(tabletas_aportadas_por_et::number) as tablets_students_et,sum(tabletas_mintic_docentes::number) as tablets_teachers&$group=anio&$order=anio',
  unit: 'terminales',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

// ---------------------------------------------------------------------------
// Socrata — Gestión de Incidentes (agi2-ekag) — total por año
// ---------------------------------------------------------------------------

export const CYBER_INCIDENTS_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Tecnologia}_${TechnologyIndicators.CyberIncidents}`,
  sector: Sector.Tecnologia,
  label: 'Incidentes de ciberseguridad',
  description:
    'Incidentes de ciberseguridad gestionados por el CSIRT del Gobierno Nacional, incluyendo phishing, acceso no autorizado, compromiso de aplicaciones y otros tipos de ataque.',
  question: '¿Cuántos incidentes de ciberseguridad se gestionan anualmente en Colombia?',
  source: 'MinTIC / CSIRT Gobierno',
  sourceUrl:
    'https://www.datos.gov.co/Ciencia-Tecnolog-a-e-Innovaci-n/Gesti-n-de-Incidentes/agi2-ekag/about_data',
  resourceId: 'agi2-ekag',
  queryKey: 'cyberIncidents',
  query:
    '$select=date_extract_y(fecha_de_solicitud) as ano,count(*) as total&$group=date_extract_y(fecha_de_solicitud)&$order=ano',
  unit: 'incidentes',
  cacheTTL: 86400,
  positiveDirection: 'down',
})

// ---------------------------------------------------------------------------
// Socrata — Gestión de Incidentes (agi2-ekag) — por tipo
// Multi-series: top 5 tipos + "Otros"
// ---------------------------------------------------------------------------

export const CYBER_INCIDENTS_BY_TYPE_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Tecnologia}_${TechnologyIndicators.CyberIncidentsByType}`,
  sector: Sector.Tecnologia,
  label: 'Incidentes de ciberseguridad por tipo',
  description:
    'Incidentes de ciberseguridad desagregados por taxonomía de ataque: phishing, uso no autorizado de recursos, compromiso de aplicaciones, spam, sistema vulnerable y otros.',
  question: '¿Qué tipos de ciberataques son los más frecuentes en entidades del gobierno colombiano?',
  source: 'MinTIC / CSIRT Gobierno',
  sourceUrl:
    'https://www.datos.gov.co/Ciencia-Tecnolog-a-e-Innovaci-n/Gesti-n-de-Incidentes/agi2-ekag/about_data',
  resourceId: 'agi2-ekag',
  queryKey: 'cyberIncidentsByType',
  query:
    '$select=date_extract_y(fecha_de_solicitud) as year,tipo_de_incidente,count(*) as total&$group=date_extract_y(fecha_de_solicitud),tipo_de_incidente&$order=year&$limit=500',
  unit: 'incidentes',
  cacheTTL: 86400,
  positiveDirection: 'down',
})

// ---------------------------------------------------------------------------
// Socrata — Grupos de Investigación (hrhc-c4wu)
// Stacked bar: A1, A, B, C, D, Reconocido por convocatoria
// ---------------------------------------------------------------------------

export const RESEARCH_GROUPS_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Tecnologia}_${TechnologyIndicators.ResearchGroups}`,
  sector: Sector.Tecnologia,
  label: 'Grupos de investigación por categoría',
  description:
    'Grupos de investigación reconocidos por MinCiencias, clasificados por categoría (A1, A, B, C, D, Reconocido) en cada convocatoria de medición. El número total creció de 4.304 (2013) a 6.160 (2021).',
  question: '¿Cómo está creciendo el ecosistema de investigación en Colombia?',
  source: 'MinCiencias',
  sourceUrl:
    'https://www.datos.gov.co/Ciencia-Tecnolog-a-e-Innovaci-n/Grupos-de-Investigaci-n/hrhc-c4wu/about_data',
  resourceId: 'hrhc-c4wu',
  queryKey: 'researchGroups',
  query:
    '$query=SELECT nme_convocatoria,nme_clasificacion_gr,count(*) as total GROUP BY nme_convocatoria,nme_clasificacion_gr ORDER BY nme_convocatoria',
  unit: 'grupos',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

// ---------------------------------------------------------------------------
// Socrata — Investigadores Reconocidos (bqtm-4y2h)
// Stacked bar: Junior, Asociado, Sénior, Emérito por convocatoria
// ---------------------------------------------------------------------------

export const RESEARCHERS_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Tecnologia}_${TechnologyIndicators.Researchers}`,
  sector: Sector.Tecnologia,
  label: 'Investigadores reconocidos por categoría',
  description:
    'Investigadores reconocidos por MinCiencias, clasificados por nivel (Junior, Asociado, Sénior, Emérito) en cada convocatoria de medición. Crecimiento de 8.016 (2013) a 21.094 (2021).',
  question: '¿Cuántos investigadores reconocidos tiene Colombia y de qué nivel son?',
  source: 'MinCiencias',
  sourceUrl:
    'https://www.datos.gov.co/Ciencia-Tecnolog-a-e-Innovaci-n/Investigadores-Reconocidos/bqtm-4y2h/about_data',
  resourceId: 'bqtm-4y2h',
  queryKey: 'researchers',
  query:
    '$query=SELECT nme_convocatoria,nme_clasificacion_pr,count(*) as total GROUP BY nme_convocatoria,nme_clasificacion_pr ORDER BY nme_convocatoria',
  unit: 'investigadores',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

// ---------------------------------------------------------------------------
// Socrata — Proyectos de Investigación e Innovación (6hgx-q9pi)
// Simple indicator: annual R&D funding total (scaled to millions COP)
// ---------------------------------------------------------------------------

export const RD_FUNDING_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Tecnologia}_${TechnologyIndicators.RdFunding}`,
  sector: Sector.Tecnologia,
  label: 'Financiación de proyectos de I+D',
  description:
    'Monto total aprobado para proyectos de investigación e innovación financiados por MinCiencias (antes Colciencias), en millones de COP. Incluye financiación directa y contrapartidas.',
  question: '¿Cuánto invierte Colombia en proyectos de investigación e innovación?',
  source: 'MinCiencias',
  sourceUrl:
    'https://www.datos.gov.co/Ciencia-Tecnolog-a-e-Innovaci-n/Proyectos-de-Investigaci-n-e-Innovaci-n/6hgx-q9pi/about_data',
  resourceId: '6hgx-q9pi',
  queryKey: 'rdFunding',
  query:
    '$select=ano_convocatoria as ano,sum(monto_total_ap::number) as total&$group=ano_convocatoria&$order=ano_convocatoria',
  unit: 'millones COP',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

// ---------------------------------------------------------------------------
// World Bank indicators
// ---------------------------------------------------------------------------

export const INTERNET_USERS_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Tecnologia}_${TechnologyIndicators.InternetUsers}`,
  sector: Sector.Tecnologia,
  label: 'Usuarios de internet',
  description:
    'Porcentaje de la población colombiana que utiliza internet. Incluye acceso desde cualquier dispositivo en los últimos 3 meses. Fuente: ITU vía Banco Mundial.',
  question: '¿Qué porcentaje de colombianos usa internet?',
  source: 'Banco Mundial',
  sourceUrl: 'https://datos.bancomundial.org/indicador/IT.NET.USER.ZS?locations=CO',
  resourceId: 'IT.NET.USER.ZS',
  queryKey: 'wbInternetUsers',
  unit: '%',
  cacheTTL: 2592000,
  positiveDirection: 'up',
})

export const RD_SPENDING_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Tecnologia}_${TechnologyIndicators.RdSpending}`,
  sector: Sector.Tecnologia,
  label: 'Gasto en I+D (% del PIB)',
  description:
    'Gasto en investigación y desarrollo como porcentaje del PIB. Colombia fluctúa entre 0,13% y 0,37%, muy por debajo del promedio OCDE (~2,7%). Fuente: UNESCO vía Banco Mundial.',
  question: '¿Cuánto invierte Colombia en investigación y desarrollo como proporción de su economía?',
  source: 'Banco Mundial',
  sourceUrl: 'https://datos.bancomundial.org/indicador/GB.XPD.RSDV.GD.ZS?locations=CO',
  resourceId: 'GB.XPD.RSDV.GD.ZS',
  queryKey: 'wbRdSpending',
  unit: '%',
  cacheTTL: 2592000,
  positiveDirection: 'up',
})

export const SCIENTIFIC_ARTICLES_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Tecnologia}_${TechnologyIndicators.ScientificArticles}`,
  sector: Sector.Tecnologia,
  label: 'Artículos científicos publicados',
  description:
    'Artículos en revistas científicas y técnicas indexadas a nivel internacional. Colombia pasó de 362 (1996) a 9.683 (2022), un crecimiento de 27 veces.',
  question: '¿Cuántos artículos científicos publica Colombia al año?',
  source: 'Banco Mundial',
  sourceUrl: 'https://datos.bancomundial.org/indicador/IP.JRN.ARTC.SC?locations=CO',
  resourceId: 'IP.JRN.ARTC.SC',
  queryKey: 'wbScientificArticles',
  unit: 'artículos',
  cacheTTL: 2592000,
  positiveDirection: 'up',
})

export const HIGHTECH_EXPORTS_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Tecnologia}_${TechnologyIndicators.HighTechExports}`,
  sector: Sector.Tecnologia,
  label: 'Exportaciones de alta tecnología',
  description:
    'Exportaciones de productos de alta tecnología como porcentaje de las exportaciones manufactureras. Incluye productos aeroespaciales, farmacéuticos, computadores, instrumentos científicos y maquinaria eléctrica.',
  question: '¿Qué proporción de las exportaciones colombianas son de alta tecnología?',
  source: 'Banco Mundial',
  sourceUrl: 'https://datos.bancomundial.org/indicador/TX.VAL.TECH.MF.ZS?locations=CO',
  resourceId: 'TX.VAL.TECH.MF.ZS',
  queryKey: 'wbHighTechExports',
  unit: '%',
  cacheTTL: 2592000,
  positiveDirection: 'up',
})

export const ICT_SERVICE_EXPORTS_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Tecnologia}_${TechnologyIndicators.IctServiceExports}`,
  sector: Sector.Tecnologia,
  label: 'Exportaciones de servicios TIC',
  description:
    'Exportaciones de servicios de tecnologías de la información y comunicación como porcentaje del total de exportaciones de servicios. Refleja la competitividad del sector de outsourcing tecnológico colombiano.',
  question: '¿Qué tan competitiva es Colombia en servicios tecnológicos a nivel internacional?',
  source: 'Banco Mundial',
  sourceUrl: 'https://datos.bancomundial.org/indicador/BX.GSR.CCIS.ZS?locations=CO',
  resourceId: 'BX.GSR.CCIS.ZS',
  queryKey: 'wbIctServiceExports',
  unit: '%',
  cacheTTL: 2592000,
  positiveDirection: 'up',
})

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export const TECHNOLOGY_CATEGORIES: SectorCategory<TechnologyIndicators>[] = [
  {
    id: 'connectivity',
    label: 'Conectividad',
    description: 'Adopción de internet, telefonía móvil y accesos de internet fijo por tecnología.',
    items: [
      { type: 'indicator', id: TechnologyIndicators.InternetUsers },
      {
        type: 'stacked-area',
        id: TechnologyIndicators.MobileSubscribers,
        series: [
          { key: 'prepago', label: 'Prepago', color: 'oklch(0.65 0.22 250)' },
          { key: 'pospago', label: 'Pospago', color: 'oklch(0.72 0.17 160)' },
        ],
      },
      {
        type: 'multi-series',
        id: TechnologyIndicators.MobileInternet,
        series: [
          { key: 'tigo', label: 'Tigo', color: 'oklch(0.55 0.25 260)' },
          { key: 'movistar', label: 'Movistar', color: 'oklch(0.62 0.21 145)' },
          { key: 'claro', label: 'Claro', color: 'oklch(0.65 0.22 25)' },
          { key: 'virgin', label: 'Virgin', color: 'oklch(0.72 0.17 350)' },
          { key: 'wom', label: 'WOM', color: 'oklch(0.68 0.19 75)' },
          { key: 'otros', label: 'Otros', color: 'oklch(0.62 0.15 300)' },
        ],
      },
      {
        type: 'stacked-area',
        id: TechnologyIndicators.FixedInternet,
        series: [
          { key: 'fibra', label: 'Fibra óptica', color: 'oklch(0.65 0.22 250)' },
          { key: 'hfc', label: 'HFC', color: 'oklch(0.72 0.17 160)' },
          { key: 'cable', label: 'Cable', color: 'oklch(0.68 0.19 75)' },
          { key: 'xdsl', label: 'xDSL', color: 'oklch(0.75 0.18 45)' },
          { key: 'otros', label: 'Otros', color: 'oklch(0.62 0.15 300)' },
        ],
      },
    ],
  },
  {
    id: 'inclusion-cybersecurity',
    label: 'Inclusión digital y ciberseguridad',
    description: 'Programas de inclusión digital y gestión de incidentes de ciberseguridad.',
    items: [
      {
        type: 'stacked-area',
        id: TechnologyIndicators.ComputersForEdu,
        series: [
          { key: 'pcs', label: 'PCs', color: 'oklch(0.65 0.22 250)' },
          { key: 'tabletsStudents', label: 'Tablets estudiantes', color: 'oklch(0.72 0.17 160)' },
          { key: 'tabletsTeachers', label: 'Tablets docentes', color: 'oklch(0.68 0.19 75)' },
        ],
      },
      { type: 'indicator', id: TechnologyIndicators.CyberIncidents },
      {
        type: 'multi-series',
        id: TechnologyIndicators.CyberIncidentsByType,
        series: [
          { key: 'phishing', label: 'Phishing', color: 'oklch(0.65 0.22 25)' },
          { key: 'usoNoAutorizado', label: 'Uso no autorizado', color: 'oklch(0.62 0.21 260)' },
          { key: 'compromisoApp', label: 'Compromiso de aplicaciones', color: 'oklch(0.72 0.17 145)' },
          { key: 'spam', label: 'Spam', color: 'oklch(0.75 0.18 75)' },
          { key: 'sistemaVulnerable', label: 'Sistema vulnerable', color: 'oklch(0.68 0.19 350)' },
          { key: 'otros', label: 'Otros', color: 'oklch(0.62 0.15 300)' },
        ],
      },
    ],
  },
  {
    id: 'research-innovation',
    label: 'Investigación e innovación',
    description:
      'Inversión en I+D, producción científica, grupos de investigación y competitividad tecnológica.',
    items: [
      { type: 'indicator', id: TechnologyIndicators.RdSpending },
      { type: 'indicator', id: TechnologyIndicators.ScientificArticles },
      { type: 'indicator', id: TechnologyIndicators.RdFunding },
      {
        type: 'stacked-area',
        id: TechnologyIndicators.ResearchGroups,
        series: [
          { key: 'a1', label: 'A1', color: 'oklch(0.55 0.25 260)' },
          { key: 'a', label: 'A', color: 'oklch(0.62 0.21 230)' },
          { key: 'b', label: 'B', color: 'oklch(0.68 0.18 200)' },
          { key: 'c', label: 'C', color: 'oklch(0.72 0.15 170)' },
          { key: 'd', label: 'D', color: 'oklch(0.75 0.12 140)' },
          { key: 'reconocido', label: 'Reconocido', color: 'oklch(0.78 0.10 110)' },
        ],
      },
      {
        type: 'stacked-area',
        id: TechnologyIndicators.Researchers,
        series: [
          { key: 'emerito', label: 'Emérito', color: 'oklch(0.55 0.25 260)' },
          { key: 'senior', label: 'Sénior', color: 'oklch(0.62 0.21 230)' },
          { key: 'asociado', label: 'Asociado', color: 'oklch(0.70 0.17 170)' },
          { key: 'junior', label: 'Junior', color: 'oklch(0.78 0.12 110)' },
        ],
      },
      { type: 'indicator', id: TechnologyIndicators.HighTechExports },
      { type: 'indicator', id: TechnologyIndicators.IctServiceExports },
    ],
  },
]
