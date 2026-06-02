export type EventGroup = {
  group: string
  events: Event[]
}

export type Event = {
  id: number
  year: number
  label: string
}

export const EVENT_GROUPS: EventGroup[] = [
  {
    group: 'Administraciones',
    events: [
      { id: 1, year: 2002, label: 'Inicio gobierno Uribe I' },
      { id: 4, year: 2006, label: 'Inicio gobierno Uribe II' },
      { id: 7, year: 2010, label: 'Inicio gobierno Santos I' },
      { id: 10, year: 2014, label: 'Inicio gobierno Santos II' },
      { id: 14, year: 2018, label: 'Inicio gobierno Duque' },
      { id: 18, year: 2022, label: 'Inicio gobierno Petro' },
    ],
  },
  {
    group: 'Seguridad y conflicto',
    events: [
      { id: 2, year: 2002, label: 'Inicio Política de Seguridad Democrática' },
      { id: 3, year: 2003, label: 'Inicio desmovilización AUC' },
      { id: 5, year: 2008, label: 'Operación Jaque — rescate Betancourt' },
      { id: 8, year: 2012, label: 'Inicio diálogos de paz FARC (La Habana)' },
      { id: 12, year: 2016, label: 'Acuerdo de paz FARC' },
      { id: 19, year: 2022, label: 'Inicio Paz Total' },
    ],
  },
  {
    group: 'Economía',
    events: [
      { id: 6, year: 2008, label: 'Crisis financiera global' },
      { id: 9, year: 2012, label: 'Entrada en vigor TLC con EE.UU.' },
      { id: 11, year: 2014, label: 'Colapso precio del petróleo' },
      { id: 16, year: 2020, label: 'COVID-19 — PIB cae 6.8%' },
      {
        id: 17,
        year: 2021,
        label: 'Paro Nacional — reforma tributaria retirada',
      },
    ],
  },
  {
    group: 'Social',
    events: [
      { id: 13, year: 2018, label: 'Crisis migratoria venezolana' },
      { id: 15, year: 2019, label: 'Paro Nacional 21-N' },
    ],
  },
]

export const EVENTS: Event[] = EVENT_GROUPS.flatMap((g) => g.events).sort((a, b) => a.id - b.id)
