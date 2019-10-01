/**
 * returns sorted version of events
 * @param events
 */

export function sortEvents(events: ICalendarEvent[]): ICalendarEvent[] {
  return events.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}
