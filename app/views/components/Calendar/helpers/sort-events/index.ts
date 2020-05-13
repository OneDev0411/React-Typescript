/**
 * returns sorted version of events
 * @param events
 */

export function sortEvents(events: ICalendarEvent[]): ICalendarEvent[] {
  return events.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )
}
