import * as z from 'zod'
import {
  COCA_BASE_SEIZURES_MANIFEST,
  COCAINE_SEIZURES_MANIFEST,
  CRIMES_AGAINST_MINORS_MANIFEST,
  CROP_ERADICATION_MANIFEST,
  DISPLACEMENT_MANIFEST,
  DOMESTIC_VIOLENCE_MANIFEST,
  EXTORTION_MANIFEST,
  FINANCIAL_THEFT_MANIFEST,
  FIREARM_SEIZURES_MANIFEST,
  FORCE_CASUALTIES_MANIFEST,
  HOME_THEFT_MANIFEST,
  HOMICIDES_MANIFEST,
  ILLEGAL_MINING_CAPTURES_MANIFEST,
  KIDNAPPINGS_MANIFEST,
  MARIJUANA_SEIZURES_MANIFEST,
  OIL_PIPELINE_BOMBINGS_MANIFEST,
  PERSONAL_THEFT_MANIFEST,
  SEXUAL_CRIMES_MANIFEST,
  TERRORISM_MANIFEST,
  TOURIST_CRIMES_MANIFEST,
  TRAFFIC_INJURIES_MANIFEST,
  VEHICLE_THEFT_MANIFEST,
} from '@/data/security'
import { createSocrataIndicator } from '@/lib/create-socrata-indicator'

// ---------------------------------------------------------------------------
// Shared schema: most MinDefensa datasets use this shape
// ---------------------------------------------------------------------------

const baseDeptFields = {
  cod_depto: z.string(),
  departamento: z.string(),
  cod_muni: z.string(),
  municipio: z.string(),
}

const baseDeptTransform = (row: {
  cod_depto: string
  departamento: string
  cod_muni: string
  municipio: string
}) => ({
  deptCode: row.cod_depto,
  department: row.departamento,
  muniCode: row.cod_muni,
  municipality: row.municipio,
})

// ---------------------------------------------------------------------------
// Violence & conflict
// ---------------------------------------------------------------------------

const homicideRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    ...baseDeptFields,
    zona: z.string(),
    sexo: z.string(),
    arma_medio: z.string(),
    _modalidad_presunta: z.string(),
    spoa_caracterizacion: z.string(),
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    ...baseDeptTransform(row),
    zone: row.zona,
    sex: row.sexo,
    weapon: row.arma_medio,
    presumedModality: row._modalidad_presunta,
    characterization: row.spoa_caracterizacion,
    count: row.cantidad,
  }))

export type HomicideRow = z.output<typeof homicideRowSchema>

export const { useRaw: useHomicides, useByYear: useHomicidesByYear } = createSocrataIndicator(
  HOMICIDES_MANIFEST,
  homicideRowSchema
)

// ---------------------------------------------------------------------------

const terrorismRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    ...baseDeptFields,
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    ...baseDeptTransform(row),
    count: row.cantidad,
  }))

export type TerrorismRow = z.output<typeof terrorismRowSchema>

export const { useRaw: useTerrorism, useByYear: useTerrorismByYear } = createSocrataIndicator(
  TERRORISM_MANIFEST,
  terrorismRowSchema
)

// ---------------------------------------------------------------------------

const kidnappingRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    ...baseDeptFields,
    tipo_delito: z.string(),
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    ...baseDeptTransform(row),
    crimeType: row.tipo_delito,
    count: row.cantidad,
  }))

export type KidnappingRow = z.output<typeof kidnappingRowSchema>

export const { useRaw: useKidnappings, useByYear: useKidnappingsByYear } = createSocrataIndicator(
  KIDNAPPINGS_MANIFEST,
  kidnappingRowSchema
)

// ---------------------------------------------------------------------------

const extortionRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    ...baseDeptFields,
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    ...baseDeptTransform(row),
    count: row.cantidad,
  }))

export type ExtortionRow = z.output<typeof extortionRowSchema>

export const { useRaw: useExtortion, useByYear: useExtortionByYear } = createSocrataIndicator(
  EXTORTION_MANIFEST,
  extortionRowSchema
)

// ---------------------------------------------------------------------------

// National-level dataset (e29y-pi4y). Uses `vigencia` (year) instead of a date.
const displacementRowSchema = z
  .object({
    vigencia: z.coerce.number(),
    hecho: z.string(),
    sexo: z.string(),
    etnia: z.string(),
    discapacidad: z.string(),
    ciclo_vital: z.string(),
    per_ocu: z.coerce.number(),
    eventos: z.coerce.number(),
  })
  .transform((row) => ({
    date: new Date(row.vigencia, 0, 1),
    fact: row.hecho,
    sex: row.sexo,
    ethnicity: row.etnia,
    disability: row.discapacidad,
    ageRange: row.ciclo_vital,
    count: row.per_ocu,
    events: row.eventos,
  }))

export type DisplacementRow = z.output<typeof displacementRowSchema>

export const { useRaw: useDisplacement, useByYear: useDisplacementByYear } = createSocrataIndicator(
  DISPLACEMENT_MANIFEST,
  displacementRowSchema
)

// ---------------------------------------------------------------------------

const forceCasualtiesRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    ...baseDeptFields,
    accion: z.string(),
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    ...baseDeptTransform(row),
    action: row.accion,
    count: row.cantidad,
  }))

export type ForceCasualtiesRow = z.output<typeof forceCasualtiesRowSchema>

export const { useRaw: useForceCasualties, useByYear: useForceCasualtiesByYear } = createSocrataIndicator(
  FORCE_CASUALTIES_MANIFEST,
  forceCasualtiesRowSchema
)

// ---------------------------------------------------------------------------

const oilPipelineBombingsRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    ...baseDeptFields,
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    ...baseDeptTransform(row),
    count: row.cantidad,
  }))

export type OilPipelineBombingsRow = z.output<typeof oilPipelineBombingsRowSchema>

export const { useRaw: useOilPipelineBombings, useByYear: useOilPipelineBombingsByYear } =
  createSocrataIndicator(OIL_PIPELINE_BOMBINGS_MANIFEST, oilPipelineBombingsRowSchema)

// ---------------------------------------------------------------------------
// Social / domestic
// ---------------------------------------------------------------------------

const domesticViolenceRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    ...baseDeptFields,
    zona: z.string(),
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    ...baseDeptTransform(row),
    zone: row.zona,
    count: row.cantidad,
  }))

export type DomesticViolenceRow = z.output<typeof domesticViolenceRowSchema>

export const { useRaw: useDomesticViolence, useByYear: useDomesticViolenceByYear } = createSocrataIndicator(
  DOMESTIC_VIOLENCE_MANIFEST,
  domesticViolenceRowSchema
)

// ---------------------------------------------------------------------------

const sexualCrimesRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    ...baseDeptFields,
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    ...baseDeptTransform(row),
    count: row.cantidad,
  }))

export type SexualCrimesRow = z.output<typeof sexualCrimesRowSchema>

export const { useRaw: useSexualCrimes, useByYear: useSexualCrimesByYear } = createSocrataIndicator(
  SEXUAL_CRIMES_MANIFEST,
  sexualCrimesRowSchema
)

// ---------------------------------------------------------------------------

// Each row is one victim — no `cantidad` column in this dataset
const crimesAgainstMinorsRowSchema = z
  .object({
    fecha: z.coerce.date(),
    departamento: z.string(),
    municipio: z.string(),
    delito: z.string(),
    genero: z.string(),
    zona: z.string(),
  })
  .transform((row) => ({
    date: row.fecha,
    department: row.departamento,
    municipality: row.municipio,
    crime: row.delito,
    gender: row.genero,
    zone: row.zona,
    count: 1 as number,
  }))

export type CrimesAgainstMinorsRow = z.output<typeof crimesAgainstMinorsRowSchema>

export const { useRaw: useCrimesAgainstMinors, useByYear: useCrimesAgainstMinorsByYear } =
  createSocrataIndicator(CRIMES_AGAINST_MINORS_MANIFEST, crimesAgainstMinorsRowSchema)

// ---------------------------------------------------------------------------

const trafficInjuriesRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    ...baseDeptFields,
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    ...baseDeptTransform(row),
    count: row.cantidad,
  }))

export type TrafficInjuriesRow = z.output<typeof trafficInjuriesRowSchema>

export const { useRaw: useTrafficInjuries, useByYear: useTrafficInjuriesByYear } = createSocrataIndicator(
  TRAFFIC_INJURIES_MANIFEST,
  trafficInjuriesRowSchema
)

// ---------------------------------------------------------------------------
// Theft
// ---------------------------------------------------------------------------

const personalTheftRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    ...baseDeptFields,
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    ...baseDeptTransform(row),
    count: row.cantidad,
  }))

export type PersonalTheftRow = z.output<typeof personalTheftRowSchema>

export const { useRaw: usePersonalTheft, useByYear: usePersonalTheftByYear } = createSocrataIndicator(
  PERSONAL_THEFT_MANIFEST,
  personalTheftRowSchema
)

// ---------------------------------------------------------------------------

const homeTheftRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    ...baseDeptFields,
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    ...baseDeptTransform(row),
    count: row.cantidad,
  }))

export type HomeTheftRow = z.output<typeof homeTheftRowSchema>

export const { useRaw: useHomeTheft, useByYear: useHomeTheftByYear } = createSocrataIndicator(
  HOME_THEFT_MANIFEST,
  homeTheftRowSchema
)

// ---------------------------------------------------------------------------

const vehicleTheftRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    ...baseDeptFields,
    tipo_delito: z.string(),
    zona: z.string(),
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    ...baseDeptTransform(row),
    crimeType: row.tipo_delito,
    zone: row.zona,
    count: row.cantidad,
  }))

export type VehicleTheftRow = z.output<typeof vehicleTheftRowSchema>

export const { useRaw: useVehicleTheft, useByYear: useVehicleTheftByYear } = createSocrataIndicator(
  VEHICLE_THEFT_MANIFEST,
  vehicleTheftRowSchema
)

// ---------------------------------------------------------------------------

const financialTheftRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    ...baseDeptFields,
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    ...baseDeptTransform(row),
    count: row.cantidad,
  }))

export type FinancialTheftRow = z.output<typeof financialTheftRowSchema>

export const { useRaw: useFinancialTheft, useByYear: useFinancialTheftByYear } = createSocrataIndicator(
  FINANCIAL_THEFT_MANIFEST,
  financialTheftRowSchema
)

// ---------------------------------------------------------------------------

// No `cantidad` field — each row is one incident, so count is always 1
const touristCrimesRowSchema = z
  .object({
    fecha: z.coerce.date(),
    departamento: z.string(),
    municipio: z.string(),
  })
  .transform((row) => ({
    date: row.fecha,
    department: row.departamento,
    municipality: row.municipio,
    count: 1 as number,
  }))

export type TouristCrimesRow = z.output<typeof touristCrimesRowSchema>

export const { useRaw: useTouristCrimes, useByYear: useTouristCrimesByYear } = createSocrataIndicator(
  TOURIST_CRIMES_MANIFEST,
  touristCrimesRowSchema
)

// ---------------------------------------------------------------------------
// Operations / enforcement
// ---------------------------------------------------------------------------

const cocaineSeizuresRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    ...baseDeptFields,
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    ...baseDeptTransform(row),
    count: row.cantidad,
  }))

export type CocaineSeizuresRow = z.output<typeof cocaineSeizuresRowSchema>

export const { useRaw: useCocaineSeizures, useByYear: useCocaineSeizuresByYear } = createSocrataIndicator(
  COCAINE_SEIZURES_MANIFEST,
  cocaineSeizuresRowSchema
)

// ---------------------------------------------------------------------------

const cocaBaseSeizuresRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    ...baseDeptFields,
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    ...baseDeptTransform(row),
    count: row.cantidad,
  }))

export type CocaBaseSeizuresRow = z.output<typeof cocaBaseSeizuresRowSchema>

export const { useRaw: useCocaBaseSeizures, useByYear: useCocaBaseSeizuresByYear } = createSocrataIndicator(
  COCA_BASE_SEIZURES_MANIFEST,
  cocaBaseSeizuresRowSchema
)

// ---------------------------------------------------------------------------

const marijuanaSeizuresRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    ...baseDeptFields,
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    ...baseDeptTransform(row),
    count: row.cantidad,
  }))

export type MarijuanaSeizuresRow = z.output<typeof marijuanaSeizuresRowSchema>

export const { useRaw: useMarijuanaSeizures, useByYear: useMarijuanaSeizuresByYear } = createSocrataIndicator(
  MARIJUANA_SEIZURES_MANIFEST,
  marijuanaSeizuresRowSchema
)

// ---------------------------------------------------------------------------

// 6 rows from 2012 are missing `cantidad` — default to 0 to avoid NaN
const cropEradicationRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    ...baseDeptFields,
    cantidad: z.preprocess((v) => (v == null ? 0 : v), z.coerce.number()),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    ...baseDeptTransform(row),
    count: row.cantidad,
  }))

export type CropEradicationRow = z.output<typeof cropEradicationRowSchema>

export const { useRaw: useCropEradication, useByYear: useCropEradicationByYear } = createSocrataIndicator(
  CROP_ERADICATION_MANIFEST,
  cropEradicationRowSchema
)

// ---------------------------------------------------------------------------

const illegalMiningCapturesRowSchema = z
  .object({
    fecha_hecho: z.coerce.date(),
    ...baseDeptFields,
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    ...baseDeptTransform(row),
    count: row.cantidad,
  }))

export type IllegalMiningCapturesRow = z.output<typeof illegalMiningCapturesRowSchema>

export const { useRaw: useIllegalMiningCaptures, useByYear: useIllegalMiningCapturesByYear } =
  createSocrataIndicator(ILLEGAL_MINING_CAPTURES_MANIFEST, illegalMiningCapturesRowSchema)

// ---------------------------------------------------------------------------

// fecha_hecho is stored as text in DD/MM/YYYY format, not calendar_date
const parseDDMMYYYY = (s: string) => {
  const [dd, mm, yyyy] = s.split('/')
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd))
}

const firearmSeizuresRowSchema = z
  .object({
    departamento: z.string(),
    municipio_hecho: z.string(),
    codigo_dane: z.string(),
    clase_bien: z.string(),
    fecha_hecho: z.string().transform(parseDDMMYYYY),
    cantidad: z.coerce.number(),
  })
  .transform((row) => ({
    date: row.fecha_hecho,
    department: row.departamento,
    municipality: row.municipio_hecho,
    daneCode: row.codigo_dane,
    weaponType: row.clase_bien,
    count: row.cantidad,
  }))

export type FirearmSeizuresRow = z.output<typeof firearmSeizuresRowSchema>

export const { useRaw: useFirearmSeizures, useByYear: useFirearmSeizuresByYear } = createSocrataIndicator(
  FIREARM_SEIZURES_MANIFEST,
  firearmSeizuresRowSchema
)
