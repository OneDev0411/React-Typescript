import fecha from 'fecha'

export function createListRows(events: CalendarEventsList) {
  const today = fecha.format(new Date(), 'YYYY-MM-DD')

  return Object.entries(events).reduce((acc, [day, eventsList]) => {
    return [
      ...acc,
      {
        is_header: true,
        is_today: fecha.format(new Date(day), 'YYYY-MM-DD') === today,
        title: day
      },
      ...eventsList
    ]
  }, [])
}
