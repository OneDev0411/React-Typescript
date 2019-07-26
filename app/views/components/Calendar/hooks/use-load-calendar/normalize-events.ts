/**
 * returns list of days including their events
 * @param range
 * @param events
 */
export function normalize(range: DateRange, events: CalendarEvent[]) {
  const list = getEvents(range, events)

  return Object.entries(list).reduce((acc, [day, events]) => {
    if ((events as CalendarEvent[]).length === 0 && !isToday(day)) {
      return acc
    }

    return {
      ...acc,
      [day]: events
    }
  }, {}) as CalendarEventsList
}

/**
 * returns all events including empty days
 * @param range
 * @param events
 */
function getEvents(range: DateRange, events: CalendarEvent[]) {
  return events.reduce((acc: string[], event: CalendarEvent) => {
    const index = getEventIndex(event, range)

    return {
      ...acc,
      [index]: [...(acc[index] || []), event]
    }
  }, getDaysInRange(range))
}

/**
 * checks the given day is equal to today or not
 * @param day
 */
function isToday(day: string): boolean {
  const now = new Date()

  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}` === day
}

/**
 * returns days ranges based on start and end dates
 * @param range
 */
function getDaysInRange(range: DateRange) {
  const [start, end] = range
  const daysCount = Math.round(Math.abs(end - start) / 86400)

  return new Array(daysCount).fill(null).reduce((acc, _, index) => {
    const day = getUTCDate(new Date(start * 1000 + index * 86400000))

    return {
      ...acc,
      [day]: []
    }
  }, {})
}

/**
 * creates a day index for the given event
 * @param event
 * @param range
 */
function getEventIndex(event: CalendarEvent, range: DateRange) {
  const [start, end] = range

  const from = new Date(start * 1000)
  const to = new Date(end * 1000)
  const eventTime = new Date(event.timestamp * 1000)

  if (!event.recurring) {
    return getUTCDate(eventTime)
  }

  const year =
    from.getUTCFullYear() === to.getUTCFullYear() ||
    eventTime.getUTCMonth() >= from.getUTCMonth()
      ? from.getUTCFullYear()
      : to.getUTCFullYear()

  return `${year}-${eventTime.getUTCMonth() + 1}-${eventTime.getUTCDate()}`
}

/**
 * return utc format of given date
 * @param date
 */
function getUTCDate(date: Date) {
  return `${date.getUTCFullYear()}-${date.getUTCMonth() +
    1}-${date.getUTCDate()}`
}
