import { Sector } from '@/config/sectors'
import { indicatorManifest, type SectorCategory } from './types'

export enum EconomyIndicators {
  BudgetByType = 'budget_by_type',
  BudgetInvestment = 'budget_investment',
  Colcap = 'colcap',
  ExchangeRate = 'exchange_rate',
  ExternalDebt = 'external_debt',
  ForeignInvestment = 'foreign_investment',
  GdpGrowth = 'gdp_growth',
  Inflation = 'inflation',
  MinimumWage = 'minimum_wage',
  NewHousingPrice = 'new_housing_price',
  OccupationRate = 'occupation_rate',
  PolicyRate = 'policy_rate',
  RealMinimumWage = 'real_minimum_wage',
  Remittances = 'remittances',
  Unemployment = 'unemployment',
  UsedHousingPrice = 'used_housing_price',
}

export const GDP_GROWTH_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Economia}_${EconomyIndicators.GdpGrowth}`,
  sector: Sector.Economia,
  label: 'Crecimiento del PIB real',
  description:
    'Variacion porcentual anual del Producto Interno Bruto real. Serie empalmada por el DANE, base 2015.',
  source: 'Banco de la Republica',
  sourceUrl: 'https://suameca.banrep.gov.co/graficador-interactivo/grafica/15294',
  resourceId: '15294',
  queryKey: 'gdpGrowth',
  unit: '%',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

export const INFLATION_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Economia}_${EconomyIndicators.Inflation}`,
  sector: Sector.Economia,
  label: 'Inflacion total',
  description: 'Variacion porcentual anual del IPC, medida mes a mes frente al mismo mes del ano anterior.',
  source: 'Banco de la Republica',
  sourceUrl: 'https://suameca.banrep.gov.co/graficador-interactivo/grafica/15270',
  resourceId: '15270',
  queryKey: 'inflation',
  unit: '%',
  cacheTTL: 604800,
  positiveDirection: 'down',
})

export const EXCHANGE_RATE_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Economia}_${EconomyIndicators.ExchangeRate}`,
  sector: Sector.Economia,
  label: 'Tasa de cambio (TRM)',
  description: 'Tasa representativa del mercado: pesos colombianos por un dolar estadounidense.',
  source: 'Banco de la Republica',
  sourceUrl: 'https://suameca.banrep.gov.co/graficador-interactivo/grafica/1',
  resourceId: '1',
  queryKey: 'exchangeRate',
  unit: 'COP/USD',
  cacheTTL: 604800,
  positiveDirection: 'down',
})

export const REMITTANCES_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Economia}_${EconomyIndicators.Remittances}`,
  sector: Sector.Economia,
  label: 'Remesas de trabajadores',
  description:
    'Transferencias corrientes mensuales realizadas por emigrantes colombianos a su pais de origen, registradas en la Balanza de Pagos.',
  source: 'Banco de la Republica',
  sourceUrl: 'https://suameca.banrep.gov.co/graficador-interactivo/grafica/15363',
  resourceId: '15363',
  queryKey: 'remittances',
  unit: 'Millones USD',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

export const COLCAP_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Economia}_${EconomyIndicators.Colcap}`,
  sector: Sector.Economia,
  label: 'Indice COLCAP',
  description:
    'Indice de capitalizacion que refleja las variaciones de precios de las acciones mas liquidas de la Bolsa de Valores de Colombia.',
  source: 'Banco de la Republica',
  sourceUrl: 'https://suameca.banrep.gov.co/graficador-interactivo/grafica/6',
  resourceId: '6',
  queryKey: 'colcap',
  unit: 'Puntos',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

export const MINIMUM_WAGE_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Economia}_${EconomyIndicators.MinimumWage}`,
  sector: Sector.Economia,
  label: 'Salario minimo mensual',
  description: 'Salario minimo mensual legal vigente fijado anualmente por el gobierno nacional.',
  source: 'Banco de la Republica',
  sourceUrl: 'https://suameca.banrep.gov.co/graficador-interactivo/grafica/15416',
  resourceId: '15416',
  queryKey: 'minimumWage',
  unit: 'COP',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

export const REAL_MINIMUM_WAGE_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Economia}_${EconomyIndicators.RealMinimumWage}`,
  sector: Sector.Economia,
  label: 'Salario minimo real',
  description:
    'Indice del salario minimo real: salario minimo nominal deflactado por el promedio anual del IPC. Base = primer ano disponible. Permite comparar el poder adquisitivo del salario minimo a lo largo del tiempo.',
  source: 'Banco de la Republica (derivado)',
  sourceUrl: 'https://suameca.banrep.gov.co/graficador-interactivo/grafica/15416',
  resourceId: 'derived_real_minimum_wage',
  queryKey: 'realMinimumWage',
  unit: 'Indice real',
  cacheTTL: 604800,
  positiveDirection: 'up',
  formula: '(Salario mínimo nominal ÷ IPC) × 100',
  derivedSources: [
    {
      label: 'Salario mínimo mensual (serie 15416)',
      url: 'https://suameca.banrep.gov.co/graficador-interactivo/grafica/15416',
    },
    {
      label: 'Índice de Precios al Consumidor (serie 15000)',
      url: 'https://suameca.banrep.gov.co/graficador-interactivo/grafica/15000',
    },
  ],
})

export const OCCUPATION_RATE_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Economia}_${EconomyIndicators.OccupationRate}`,
  sector: Sector.Economia,
  label: 'Tasa de ocupacion',
  description:
    'Proporcion de personas en edad de trabajar que se encuentran ocupadas. Total nacional, mensual.',
  source: 'Banco de la Republica',
  sourceUrl: 'https://suameca.banrep.gov.co/graficador-interactivo/grafica/15313',
  resourceId: '15313',
  queryKey: 'occupationRate',
  unit: '%',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

export const UNEMPLOYMENT_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Economia}_${EconomyIndicators.Unemployment}`,
  sector: Sector.Economia,
  label: 'Tasa de desempleo',
  description:
    'Proporcion de la poblacion economicamente activa que busca empleo sin conseguirlo. Total nacional, mensual.',
  source: 'Banco de la Republica',
  sourceUrl: 'https://suameca.banrep.gov.co/graficador-interactivo/grafica/15312',
  resourceId: '15312',
  queryKey: 'unemployment',
  unit: '%',
  cacheTTL: 604800,
  positiveDirection: 'down',
})

export const POLICY_RATE_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Economia}_${EconomyIndicators.PolicyRate}`,
  sector: Sector.Economia,
  label: 'Tasa de politica monetaria',
  description:
    'Tasa de interes de intervencion del Banco de la Republica. Tasa minima de las subastas de repos a un dia.',
  source: 'Banco de la Republica',
  sourceUrl: 'https://suameca.banrep.gov.co/graficador-interactivo/grafica/59',
  resourceId: '59',
  queryKey: 'policyRate',
  unit: '%',
  cacheTTL: 604800,
  positiveDirection: 'down',
})

export const EXTERNAL_DEBT_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Economia}_${EconomyIndicators.ExternalDebt}`,
  sector: Sector.Economia,
  label: 'Deuda externa total',
  description:
    'Saldo mensual de los pasivos contractuales pendientes de reintegro que asumen los residentes de Colombia frente a no residentes.',
  source: 'Banco de la Republica',
  sourceUrl: 'https://suameca.banrep.gov.co/graficador-interactivo/grafica/15330',
  resourceId: '15330',
  queryKey: 'externalDebt',
  unit: 'Millones USD',
  cacheTTL: 604800,
  positiveDirection: 'down',
})

export const FOREIGN_INVESTMENT_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Economia}_${EconomyIndicators.ForeignInvestment}`,
  sector: Sector.Economia,
  label: 'Inversion extranjera directa',
  description:
    'Flujo anual de inversion extranjera directa en Colombia. Valores negativos indican desinversion neta.',
  source: 'Banco de la Republica',
  sourceUrl: 'https://suameca.banrep.gov.co/graficador-interactivo/grafica/15366',
  resourceId: '15366',
  queryKey: 'foreignInvestment',
  unit: 'Millones USD',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

export const NEW_HOUSING_PRICE_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Economia}_${EconomyIndicators.NewHousingPrice}`,
  sector: Sector.Economia,
  label: 'Precio vivienda nueva (IPVNBR)',
  description:
    'Indice real de precios de la vivienda nueva, agregado nacional. Base diciembre 2006. Elaborado por el Banco de la Republica.',
  source: 'Banco de la Republica',
  sourceUrl: 'https://suameca.banrep.gov.co/graficador-interactivo/grafica/17269',
  resourceId: '17269',
  queryKey: 'newHousingPrice',
  unit: 'Indice real',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

export const USED_HOUSING_PRICE_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Economia}_${EconomyIndicators.UsedHousingPrice}`,
  sector: Sector.Economia,
  label: 'Precio vivienda usada (IPVU)',
  description:
    'Indice real de precios de la vivienda usada, trimestral. Base 1990=100. Elaborado por el Banco de la Republica.',
  source: 'Banco de la Republica',
  sourceUrl: 'https://suameca.banrep.gov.co/graficador-interactivo/grafica/57',
  resourceId: '57',
  queryKey: 'usedHousingPrice',
  unit: 'Indice real',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

export const BUDGET_BY_TYPE_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Economia}_${EconomyIndicators.BudgetByType}`,
  sector: Sector.Economia,
  label: 'Presupuesto por tipo de gasto',
  description:
    'Pagos del Presupuesto General de la Nación desagregados por tipo de gasto: funcionamiento, inversión y servicio de la deuda pública. Valores acumulados al último mes disponible de cada año.',
  question: '¿Qué proporción del presupuesto se destina a inversión frente a funcionamiento y deuda?',
  source: 'MinHacienda',
  sourceUrl:
    'https://www.datos.gov.co/Hacienda-y-Cr-dito-P-blico/Informaci-n-de-Gastos-del-Presupuesto-General-de-l/5phs-yqfw/about_data',
  resourceId: '5phs-yqfw',
  queryKey: 'budgetByType',
  query:
    '$select=anio,nombretipogasto,nombremes,sum(pagos) as total&$group=anio,nombretipogasto,nombremes&$order=anio ASC&$limit=5000',
  unit: 'Billones COP',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

export const BUDGET_INVESTMENT_MANIFEST = indicatorManifest.parse({
  id: `${Sector.Economia}_${EconomyIndicators.BudgetInvestment}`,
  sector: Sector.Economia,
  label: 'Inversión pública por sector',
  description:
    'Pagos de inversión del Presupuesto General de la Nación, desagregados por los 8 sectores con mayor inversión. Valores acumulados a diciembre de cada año.',
  question: '¿Cómo distribuye el gobierno colombiano su inversión entre los distintos sectores?',
  source: 'MinHacienda',
  sourceUrl:
    'https://www.datos.gov.co/Hacienda-y-Cr-dito-P-blico/Informaci-n-de-Gastos-del-Presupuesto-General-de-l/5phs-yqfw/about_data',
  resourceId: '5phs-yqfw',
  queryKey: 'budgetInvestment',
  query:
    "$select=anio,sector,nombremes,sum(pagos) as total&$where=nombretipogasto='INVERSION'&$group=anio,sector,nombremes&$order=anio ASC&$limit=5000",
  unit: 'Billones COP',
  cacheTTL: 604800,
  positiveDirection: 'up',
})

export const ECONOMY_CATEGORIES: SectorCategory<EconomyIndicators>[] = [
  {
    id: 'activity',
    label: 'Actividad economica',
    description: 'Crecimiento de la economia y situacion del mercado laboral.',
    items: [
      { type: 'indicator', id: EconomyIndicators.GdpGrowth },
      { type: 'indicator', id: EconomyIndicators.Unemployment },
      { type: 'indicator', id: EconomyIndicators.OccupationRate },
    ],
  },
  {
    id: 'prices',
    label: 'Precios',
    description: 'Variacion de precios y costo de vida.',
    items: [
      { type: 'indicator', id: EconomyIndicators.Inflation },
      { type: 'indicator', id: EconomyIndicators.MinimumWage },
      { type: 'indicator', id: EconomyIndicators.RealMinimumWage },
      { type: 'indicator', id: EconomyIndicators.NewHousingPrice },
      { type: 'indicator', id: EconomyIndicators.UsedHousingPrice },
    ],
  },
  {
    id: 'external',
    label: 'Sector externo',
    description: 'Relacion de Colombia con la economia global: comercio, deuda e inversion.',
    items: [
      { type: 'indicator', id: EconomyIndicators.ExchangeRate },
      { type: 'indicator', id: EconomyIndicators.Remittances },
      { type: 'indicator', id: EconomyIndicators.ExternalDebt },
      { type: 'indicator', id: EconomyIndicators.ForeignInvestment },
    ],
  },
  {
    id: 'financial',
    label: 'Mercado financiero',
    description: 'Tasas de interes de referencia y desempeno del mercado accionario.',
    items: [
      { type: 'indicator', id: EconomyIndicators.PolicyRate },
      { type: 'indicator', id: EconomyIndicators.Colcap },
    ],
  },
  {
    id: 'spending',
    label: 'Gasto público',
    description: 'Distribución de la inversión del gobierno nacional por sector.',
    items: [
      {
        type: 'multi-series',
        id: EconomyIndicators.BudgetByType,
        series: [
          { key: 'funcionamiento', label: 'Funcionamiento', color: 'oklch(0.62 0.21 260)' },
          { key: 'inversion', label: 'Inversión', color: 'oklch(0.72 0.17 145)' },
          { key: 'deuda', label: 'Servicio de la deuda', color: 'oklch(0.65 0.22 25)' },
        ],
      },
      {
        type: 'multi-series',
        id: EconomyIndicators.BudgetInvestment,
        series: [
          { key: 'transporte', label: 'Transporte', color: 'oklch(0.62 0.21 260)' },
          { key: 'inclusionSocial', label: 'Inclusión social', color: 'oklch(0.72 0.17 145)' },
          { key: 'igualdadEquidad', label: 'Igualdad y equidad', color: 'oklch(0.65 0.22 350)' },
          { key: 'educacion', label: 'Educación', color: 'oklch(0.75 0.18 75)' },
          { key: 'trabajo', label: 'Trabajo', color: 'oklch(0.65 0.22 25)' },
          { key: 'minasEnergia', label: 'Minas y energía', color: 'oklch(0.68 0.19 200)' },
          { key: 'vivienda', label: 'Vivienda', color: 'oklch(0.70 0.16 310)' },
          { key: 'agricultura', label: 'Agricultura', color: 'oklch(0.72 0.20 115)' },
        ],
      },
    ],
  },
]
