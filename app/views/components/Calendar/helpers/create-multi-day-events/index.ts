import { isNegativeTimezone } from 'utils/is-negative-timezone'

function getEndDate(event: ICalendarEvent): Date {
  const isAllDay = event.all_day || false
  const endDate = new Date(Number(event.end_date!) * 1000)

  if (isAllDay && !isNegativeTimezone()) {
    endDate.setHours(0, 0, 0, 0)
  }

  return endDate
}

function sortItems<T>(list: [string, T][], contrariwise: boolean) {
  return list.sort((a, b) => {
    const dateObjectA = new Date(a[0])
    const dateObjectB = new Date(b[0])

    const number = dateObjectA < dateObjectB ? -1 : 1

    return contrariwise ? number * -1 : number
  })
}

/**
 * Duplicates multi day events through all its days.
 * It doesn't mutate the input `events` and creates a new one.
 */
export default function createMultiDayEvents(
  events: ICalendarEventsList,
  contrariwise: boolean
): ICalendarEventsList {
  const distributedEvents: ICalendarEventsList = {}
  let multiDayEvents: ICalendarEvent[] = []

  const months = sortItems<ICalendarMonthEvents>(
    Object.entries(events),
    contrariwise
  )

  months.forEach(([month, daysOfMonth]) => {
    distributedEvents[month] = {}

    const days = sortItems(Object.entries(daysOfMonth), contrariwise)

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
