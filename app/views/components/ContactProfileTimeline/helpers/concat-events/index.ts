/**
 * returns concatenate events based on type of load
 * @param data
 * @param reset
 */
type Data = {
  events: ICalendarEvent[]
  prevEvents: ICalendarEvent[]
  nextEvents: ICalendarEvent[]
}

export function concatEvents(
  data: Data,
  reset: boolean = false
): ICalendarEvent[] {
  const { events = [], prevEvents = [], nextEvents = [] } = data

  if (reset) {
    return prevEvents.concat(nextEvents)
  }

  return [...prevEvents, ...events, ...nextEvents]
}
