import { Sector } from '@/config/sectors'
import { indicatorManifest } from './types'

export enum EconomyIndicators {
  Colcap = 'colcap',
  CurrentAccount = 'current_account',
  ExchangeRate = 'exchange_rate',
  ExternalDebt = 'external_debt',
  ForeignInvestment = 'foreign_investment',
  GdpGrowth = 'gdp_growth',
  Inflation = 'inflation',
  OccupationRate = 'occupation_rate',
  PolicyRate = 'policy_rate',
  Remittances = 'remittances',
  Unemployment = 'unemployment',
}

export type EconomyCategory = {
  id: string
  label: string
  description: string
  indicators: EconomyIndicators[]
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

export const ECONOMY_CATEGORIES: EconomyCategory[] = [
  {
    id: 'activity',
    label: 'Actividad economica',
    description: 'Crecimiento de la economia y situacion del mercado laboral.',
    indicators: [
      EconomyIndicators.GdpGrowth,
      // EconomyIndicators.Unemployment,
      // EconomyIndicators.OccupationRate,
    ],
  },
  {
    id: 'prices',
    label: 'Precios',
    description: 'Variacion de precios y costo de vida.',
    indicators: [EconomyIndicators.Inflation],
  },
  {
    id: 'external',
    label: 'Sector externo',
    description: 'Relacion de Colombia con la economia global: comercio, deuda e inversion.',
    indicators: [
      EconomyIndicators.ExchangeRate,
      // EconomyIndicators.Remittances,
      // EconomyIndicators.ExternalDebt,
      // EconomyIndicators.CurrentAccount,
      // EconomyIndicators.ForeignInvestment,
    ],
  },
  {
    id: 'financial',
    label: 'Mercado financiero',
    description: 'Tasas de interes de referencia y desempeno del mercado accionario.',
    indicators: [
      // EconomyIndicators.PolicyRate,
      // EconomyIndicators.Colcap,
    ],
  },
]
