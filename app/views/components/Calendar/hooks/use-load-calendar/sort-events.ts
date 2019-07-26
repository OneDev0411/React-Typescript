/**
 * returns sorted version of events
 * @param events
 */
export function sortEvents(events: CalendarEventsList) {
  return Object.keys(events)
    .sort(
      (a: string, b: string) => new Date(a).getTime() - new Date(b).getTime()
    )
    .reduce((acc, key) => {
      return {
        ...acc,
        [key]: events[key]
      }
    }, {})
}
