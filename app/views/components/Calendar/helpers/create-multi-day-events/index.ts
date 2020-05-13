/**
 * Duplicates multi day events through all its days.
 * It doesn't mutate the input `events` and creates a new one.
 */
export default function createMultiDayEvents(
  events: ICalendarEventsList
): ICalendarEventsList {
  const distributedEvents: ICalendarEventsList = {}
  let multiDayEvents: ICalendarEvent[] = []

  Object.entries(events).forEach(([month, daysOfMonth]) => {
    distributedEvents[month] = {}
    Object.entries(daysOfMonth).forEach(([day, events]) => {
      const dayStart = new Date(day).getTime()
      const dayEnd = dayStart + 86400000 // = one day

      distributedEvents[month][day] = []
      multiDayEvents = multiDayEvents.filter(
        event => parseFloat(event.end_date!) * 1000 > dayStart
      )
      multiDayEvents.forEach(event => distributedEvents[month][day].push(event))

      events.forEach(event => {
        distributedEvents[month][day].push(event)

        const isAllDay = (event.metadata && event.metadata.all_day) || false
        const endDate = new Date(parseFloat(event.end_date!) * 1000)

        if (isAllDay) {
          endDate.setHours(0, 0, 0, 0)
        }

        if (endDate.getTime() > dayEnd) {
          multiDayEvents.push(event)
        }
      })
    })
  })

  return distributedEvents
}
