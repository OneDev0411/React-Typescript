import { createDayId } from '../create-day-id'
import eventEmptyState from '../get-event-empty-state'

/**
 * returns list of days including their events
 * @param range
 * @param events
 */
export function normalizeEvents(
  range: NumberRange,
  events: ICalendarEvent[],
  activeDate: Date
) {
  if (events.length === 0) {
    return {}
  }

  // get list of all fetched events
  const list = getEvents(range, events)

  // convert activeDate to yyyy/mm/dd format
  const activeDayId = createDayId(activeDate)

  return Object.entries(list).reduce((acc, [day, events]) => {
    if ((events as ICalendarEvent[]).length === 0) {
      return isToday(day) || day === activeDayId
        ? {
            ...acc,
            [day]: [eventEmptyState]
          }
        : acc
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
  const convertToUTC =
    event.object_type !== 'crm_task' && event.object_type !== 'email_campaign'

  if (!event.recurring) {
    return createDayId(eventTime, convertToUTC)
  }

  const year =
    from.getUTCFullYear() === to.getUTCFullYear() ||
    eventTime.getUTCMonth() >= from.getUTCMonth()
      ? from.getUTCFullYear()
      : to.getUTCFullYear()

  return `${year}/${eventTime.getUTCMonth() + 1}/${eventTime.getUTCDate()}`
}
