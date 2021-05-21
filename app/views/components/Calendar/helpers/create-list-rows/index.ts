import fecha from 'fecha'

export function createListRows(
  events: ICalendarEventsList
): ICalendarListRow[] {
  const now = new Date()
  const today = fecha.format(now, 'YYYY-MM-DD')
  const tomorrow = fecha.format(
    new Date(now).setDate(now.getDate() + 1),
    'YYYY-MM-DD'
  )

  return Object.values(events).flatMap(month => {
    return Object.entries(month)
      .filter(([_, events]) => events.length > 0)
      .map(([day, events]) => {
        return {
          header: {
            isToday: fecha.format(new Date(day), 'YYYY-MM-DD') === today,
            isTomorrow: fecha.format(new Date(day), 'YYYY-MM-DD') === tomorrow,
            title: getDayTitle(new Date(day)),
            date: day
          },
          events
        }
      })
  })
}

/**
 * returns day title
 * @param date
 */
function getDayTitle(date: Date) {
  return date.getFullYear() !== new Date().getFullYear()
    ? fecha.format(date, 'dddd, MMMM Do, YYYY')
    : fecha.format(date, 'dddd, MMMM Do')
}
