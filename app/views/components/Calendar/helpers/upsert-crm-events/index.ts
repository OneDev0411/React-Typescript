import { createDayId } from '../create-day-id'
import { sortEvents } from '../sort-events'
import { convertTaskToCalendarEvent } from '../convert-task-to-calendar'

export function upsertCrmEvents(
  events: CalendarEventsList,
  event: IEvent,
  type: string
) {
  const dayId = createDayId(event.due_date * 1000)
  const calendarEvent = convertTaskToCalendarEvent(event)

  if (type === 'created') {
    return sortEvents({
      ...events,
      [dayId]: events[dayId]
        ? [...events[dayId], calendarEvent]
        : [calendarEvent]
    } as CalendarEventsList)
  }

  if (type === 'deleted') {
    return {
      ...events,
      [dayId]: events[dayId].filter(
        (item: ICalendarEvent) => item.id !== event.id
      )
    }
  }

  if (type === 'updated') {
    const nextEvents = Object.entries(events).reduce((acc, [day, list]) => {
      return {
        ...acc,
        [day]: list.filter(item => item.id !== event.id)
      }
    }, {})

    return {
      ...nextEvents,
      [dayId]: [...(nextEvents[dayId] || []), calendarEvent].sort(
        (a: ICalendarEvent, b: ICalendarEvent) => a.timestamp - b.timestamp
      )
    }
  }

  return {}
}
