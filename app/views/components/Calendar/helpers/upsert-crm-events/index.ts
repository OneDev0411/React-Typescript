import { convertTaskToCalendarEvent } from '../convert-task-to-calendar'

export function upsertCrmEvents(
  events: ICalendarEvent[],
  event: IEvent,
  type: string
): ICalendarEvent[] {
  const calendarEvent: ICalendarEvent = convertTaskToCalendarEvent(event)

  if (type === 'created') {
    return events.concat(calendarEvent)
  }

  if (type === 'deleted') {
    return events.filter(item => item.id !== event.id)
  }

  if (type === 'updated') {
    return events.map(item => (item.id === event.id ? calendarEvent : item))
  }

  return events
}
