import { createDayId } from '../create-day-id'

/**
 * returns list of days including their events
 * @param range
 * @param events
 */
export function normalizeEvents(range: NumberRange, events: ICalendarEvent[]) {
  if (events.length === 0) {
    return {}
  }

  const list = getEvents(range, events)

  return Object.entries(list).reduce((acc, [day, events]) => {
    if ((events as ICalendarEvent[]).length === 0 && !isToday(day)) {
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
function getEvents(range: NumberRange, events: ICalendarEvent[]) {
  return events.reduce((acc: string[], event: ICalendarEvent) => {
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

  return createDayId(now, false) === day
}

/**
 * returns days ranges based on start and end dates
 * @param range
 */
function getDaysInRange(range: NumberRange) {
  const [start, end] = range
  const daysCount = Math.round(Math.abs(end - start) / 86400)

  return new Array(daysCount).fill(null).reduce((acc, _, index) => {
    const day = createDayId(new Date(start * 1000 + index * 86400000))

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
function getEventIndex(event: ICalendarEvent, range: NumberRange) {
  const [start, end] = range

  const from = new Date(start * 1000)
  const to = new Date(end * 1000)
  const eventTime = new Date(event.timestamp * 1000)

  if (!event.recurring) {
    return createDayId(eventTime)
  }

  const year =
    from.getUTCFullYear() === to.getUTCFullYear() ||
    eventTime.getUTCMonth() >= from.getUTCMonth()
      ? from.getUTCFullYear()
      : to.getUTCFullYear()

  return `${year}-${eventTime.getUTCMonth() + 1}-${eventTime.getUTCDate()}`
}
