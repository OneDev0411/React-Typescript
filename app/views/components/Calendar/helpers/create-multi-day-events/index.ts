import { isNegativeTimezone } from 'utils/is-negative-timezone'

function getEndDate(event: ICalendarEvent): Date {
  const isAllDay = event.metadata?.all_day || false
  const endDate = new Date(Number(event.end_date!) * 1000)

  if (isAllDay && !isNegativeTimezone()) {
    endDate.setHours(0, 0, 0, 0)
  }

  return endDate
}

function sortItems(a, b) {
  const dateObjectA = new Date(a[0])
  const dateObjectB = new Date(b[0])

  return dateObjectA < dateObjectB ? -1 : 1
}

/**
 * Duplicates multi day events through all its days.
 * It doesn't mutate the input `events` and creates a new one.
 */
export default function createMultiDayEvents(
  events: ICalendarEventsList
): ICalendarEventsList {
  const distributedEvents: ICalendarEventsList = {}
  let multiDayEvents: ICalendarEvent[] = []
  const months = Object.entries(events).sort(sortItems)

  months.forEach(([month, daysOfMonth]) => {
    distributedEvents[month] = {}

    const days = Object.entries(daysOfMonth).sort(sortItems)

    days.forEach(([day, events]) => {
      const dayStart = new Date(day).getTime()
      const dayEnd = dayStart + 86400000 // = one day

      distributedEvents[month][day] = []
      multiDayEvents = multiDayEvents.filter(event => {
        const endDate = getEndDate(event)

        return endDate.getTime() > dayStart
      })
      multiDayEvents.forEach(event => distributedEvents[month][day].push(event))

      events.forEach(event => {
        distributedEvents[month][day].push(event)

        const endDate = getEndDate(event)

        if (endDate.getTime() > dayEnd) {
          multiDayEvents.push(event)
        }
      })
    })
  })

  return distributedEvents
}
