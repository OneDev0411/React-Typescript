import _uniqBy from 'lodash/uniqBy'
import { EventInput } from '@fullcalendar/core'

interface FullCalendarEventDate {
  start: string
  end?: string
}

/**
 * return list of events for using in full calendar
 * @param events
 */
export function normalizeEvents(events: ICalendarEvent[]): EventInput[] {
  const uniqEvents = _uniqBy(events, event =>
    event.object_type === 'crm_association' ? event.crm_task : event.id
  )

  return uniqEvents.map((event: ICalendarEvent) => {
    const { id, all_day, ...restEvent } = event

    return {
      ...restEvent,
      id,
      title: getTitle(event),
      allDay: all_day || false,
      editable: isEditable(event),
      ...getDates(event)
    }
  })
}

/**
 * get the event title
 * @param event
 */
function getTitle(event: ICalendarEvent): string {
  const { title, object_type, event_type, type_label } = event

  if (
    object_type === 'contact' &&
    event_type === 'next_touch' &&
    event.people
  ) {
    const contact = event.people[0] as IContact

    return `Touch Reminder: ${contact.display_name}`
  }

  if (object_type === 'deal_context') {
    return `${type_label} for ${title}`
  }

  if (!title) {
    return `[No Title ${event_type}]`
  }

  return title
}

/**
 * return the start and end date of an event
 * @param event
 */
function getDates(event: ICalendarEvent): FullCalendarEventDate {
  const { timestamp, end_date, recurring } = event
  const current = new Date()
  // Start Date
  const startObject = new Date(Number(timestamp || 0) * 1000)

  if (recurring) {
    startObject.setUTCFullYear(current.getUTCFullYear())
  }

  // End Date
  const endObject = new Date(Number(end_date || 0) * 1000)
  const end = end_date ? { end: endObject.toISOString() } : {}

  return {
    start: startObject.toISOString(),
    ...end
  }
}

/**
 * check event is daragable
 * @param event
 */
function isEditable(event: ICalendarEvent): boolean {
  const { object_type, event_type } = event

  if (
    ['contact', 'deal_context'].includes(object_type) ||
    ['birthday', 'next_touch'].includes(event_type)
  ) {
    return false
  }

  return true
}
