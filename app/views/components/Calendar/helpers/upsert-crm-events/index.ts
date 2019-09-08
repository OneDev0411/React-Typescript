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
    return events.filter(item => {
      const id =
        item.object_type === 'crm_association' ? item.crm_task : item.id

      return id !== event.id
    })
  }

  if (type === 'updated') {
    return events.map(item => {
      const id =
        item.object_type === 'crm_association' ? item.crm_task : item.id

      return id == event.id ? calendarEvent : item
    })
  }

  return events
}
