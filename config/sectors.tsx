import {
  IconBuildingBank,
  IconCategory,
  IconDevices,
  IconGlobe,
  IconLeaf,
  IconMedicalCross,
  IconSchool,
  IconShieldLock,
  IconUsersGroup,
} from '@tabler/icons-react'
import type React from 'react'

export enum Sector {
  Overview = 'overview',
  Seguridad = 'seguridad',
  Economia = 'economia',
  Educacion = 'educacion',
  Salud = 'salud',
  MedioAmbiente = 'medio-ambiente',
  Social = 'social',
  Tecnologia = 'tecnologia',
  Relaciones = 'relaciones',
}

export const sectors = [
  { title: 'Overview', url: '/', slug: Sector.Overview },
  { title: 'Seguridad', url: '/seguridad', slug: Sector.Seguridad },
  { title: 'Economía', url: '/economia', slug: Sector.Economia },
  { title: 'Educación', url: '/educacion', slug: Sector.Educacion },
  { title: 'Salud', url: '/salud', slug: Sector.Salud },
  {
    title: 'Medio Ambiente',
    url: '/medio-ambiente',
    slug: Sector.MedioAmbiente,
  },
  { title: 'Social', url: '/social', slug: Sector.Social },
  { title: 'Tecnología', url: '/tecnologia', slug: Sector.Tecnologia },
  { title: 'Relaciones', url: '/relaciones', slug: Sector.Relaciones },
] as const

export const sectorIcons: Record<Sector, React.ReactNode> = {
  [Sector.Overview]: <IconCategory />,
  [Sector.Seguridad]: <IconShieldLock />,
  [Sector.Economia]: <IconBuildingBank />,
  [Sector.Educacion]: <IconSchool />,
  [Sector.Salud]: <IconMedicalCross />,
  [Sector.MedioAmbiente]: <IconLeaf />,
  [Sector.Social]: <IconUsersGroup />,
  [Sector.Tecnologia]: <IconDevices />,
  [Sector.Relaciones]: <IconGlobe />,
}

export function getSectorBySlug(slug: string) {
  return sectors.find((s) => s.slug === slug)
}
