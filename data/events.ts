export type EventGroup = {
  group: string
  events: Event[]
}

export type Event = {
  id: number
  date: Date
  label: string
}

export const EVENT_GROUPS: EventGroup[] = [
  {
    group: 'Administraciones',
    events: [
      { id: 1, date: new Date('2002-08-07'), label: 'Inicio gobierno Uribe I' },
      { id: 4, date: new Date('2006-08-07'), label: 'Inicio gobierno Uribe II' },
      { id: 7, date: new Date('2010-08-07'), label: 'Inicio gobierno Santos I' },
      { id: 10, date: new Date('2014-08-07'), label: 'Inicio gobierno Santos II' },
      { id: 14, date: new Date('2018-08-07'), label: 'Inicio gobierno Duque' },
      { id: 18, date: new Date('2022-08-07'), label: 'Inicio gobierno Petro' },
    ],
  },
  {
    group: 'Seguridad y conflicto',
    events: [
      { id: 2, date: new Date('2003-06-29'), label: 'Inicio Política de Seguridad Democrática' },
      { id: 3, date: new Date('2003-07-15'), label: 'Inicio desmovilización AUC' },
      { id: 5, date: new Date('2008-07-02'), label: 'Operación Jaque — rescate Betancourt' },
      { id: 8, date: new Date('2012-10-18'), label: 'Inicio diálogos de paz FARC (La Habana)' },
      { id: 12, date: new Date('2016-09-26'), label: 'Acuerdo de paz FARC' },
      { id: 19, date: new Date('2022-11-04'), label: 'Inicio Paz Total' },
    ],
  },
  {
    group: 'Economía',
    events: [
      { id: 6, date: new Date('2008-09-15'), label: 'Crisis financiera global' },
      { id: 9, date: new Date('2012-05-15'), label: 'Entrada en vigor TLC con EE.UU.' },
      { id: 11, date: new Date('2014-11-27'), label: 'Colapso precio del petróleo' },
      { id: 16, date: new Date('2020-03-25'), label: 'COVID-19 — PIB cae 6.8%' },
      { id: 17, date: new Date('2021-04-28'), label: 'Paro Nacional — reforma tributaria retirada' },
    ],
  },
  {
    group: 'Social',
    events: [
      { id: 13, date: new Date('2018-02-02'), label: 'Crisis migratoria venezolana' },
      { id: 15, date: new Date('2019-11-21'), label: 'Paro Nacional 21-N' },
    ],
  },
]

export const EVENTS: Event[] = EVENT_GROUPS.flatMap((g) => g.events).sort((a, b) => a.id - b.id)
