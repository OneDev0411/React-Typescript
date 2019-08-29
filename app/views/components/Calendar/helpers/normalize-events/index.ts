import { createDayId } from '../create-day-id'
import { sortEvents } from '../sort-events'

/**
 * returns list of days including their events
 * @param range
 * @param events
 */
export function normalizeEvents(events: ICalendarEvent[], range: NumberRange) {
  const list = getEvents(range, events)

  return Object.entries(list).reduce((acc, [month, daysOfMonth]) => {
    return {
      ...acc,
      [month]: getSortedEvents(daysOfMonth)
    }
  }, {})
}

/**
 * returns all events including empty days
 * @param range
 * @param events
 */
function getEvents(
  range: NumberRange,
  events: ICalendarEvent[]
): ICalendarEventsList {
  return events.reduce((acc: string[], event: ICalendarEvent) => {
    const index = getEventIndex(event, range)

    const [year, month, day] = index.split('/')
    const monthId = `${year}/${month}`
    const dayId = `${year}/${month}/${day}`

    const dayEvents =
      acc[monthId] && acc[monthId][dayId] ? acc[monthId][dayId] : []

    return {
      ...acc,
      [monthId]: {
        ...acc[monthId],
        [dayId]: [...dayEvents, event]
      }
    }
  }, getDaysInRange(range))
}

/**
 * returns sorted list of days events in a month
 * @param daysEvents
 */
function getSortedEvents(events: ICalendarMonthEvents) {
  return Object.entries(events).reduce((acc, [day, events]) => {
    return {
      ...acc,
      [day]: sortEvents(events)
    }
  }, {})
}

/**
 * returns days ranges based on start and end dates
 * @param range
 */
function getDaysInRange(range: NumberRange) {
  const [start, end] = range
  const daysCount = Math.round(Math.abs(end - start) / 86400)

  return new Array(daysCount).fill(null).reduce((acc, _, index) => {
    const date = new Date(start * 1000 + index * 86400000)
    const year = date.getUTCFullYear()
    const month = date.getUTCMonth() + 1
    const day = date.getUTCDate()

    const byMonth = `${year}/${month}`
    const byId = `${year}/${month}/${day}`

    return {
      ...acc,
      [byMonth]: {
        ...(acc[byMonth] || {}),
        [byId]: []
      }
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
