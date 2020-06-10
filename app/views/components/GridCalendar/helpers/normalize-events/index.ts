import { EventInput } from '@fullcalendar/core'

/**
 * returns list of events for using in full calendar
 * @param events
 */
export function normalizeEvents(events: ICalendarEvent[]): EventInput[] {
  return events.map(event => {
    const { title, timestamp, end_date, all_day } = event
    // Start Date
    const start = new Date(timestamp * 1000)
    // End Date
    const endTimestamps = Number(end_date || 0)
    const end = new Date(endTimestamps * 1000)

    return {
      title,
      start: start.toISOString(),
      end: end.toISOString(),
      allDay: all_day || false
    }
  })
}
