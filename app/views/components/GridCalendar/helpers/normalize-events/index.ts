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

  return uniqEvents.map(event => {
    const { title, all_day } = event

    return {
      title,
      allDay: all_day || false,
      ...getDates(event)
    }
  })
}

/**
 * return the start and end date of an event
 * @param event
 */
function getDates(event: ICalendarEvent): FullCalendarEventDate {
  const { timestamp, end_date, recurring } = event
  const current = new Date()
  // Start Date
  const startObject = new Date(timestamp * 1000)

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
