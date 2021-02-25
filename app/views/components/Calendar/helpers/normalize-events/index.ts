import uniqBy from 'lodash/uniqBy'

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
  const uniqEvents = uniqBy(events, event =>
    event.object_type === 'crm_association' ? event.crm_task : event.id
  )

  return uniqEvents.reduce((acc: string[], event: ICalendarEvent) => {
    const index = getEventIndex(event, range)
    const [year, month, day] = index.split('/')
    const monthId = `${year}/${month}/1`
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

  // finds the days cound between the start and end date
  const daysCount = Math.round(Math.abs(end - start) / 86400)

  // creates a array list of days: [0, 1, 2, 3, ...]
  const listOfDays = new Array(daysCount).fill(null).map((_, index) => index)

  return listOfDays.reduce((acc, index) => {
    const date = new Date(start * 1000 + index * 86400000)
    const year = date.getUTCFullYear()
    const month = date.getUTCMonth() + 1
    const day = date.getUTCDate()

    const monthId = `${year}/${month}/1`
    const dayId = `${year}/${month}/${day}`

    return {
      ...acc,
      [monthId]: {
        ...(acc[monthId] || {}),
        [dayId]: []
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
  const isAllDayEvent = event.all_day || false

  if (isAllDayEvent) {
    const dummyStartDate = new Date(eventTime)

    eventTime.setHours(
      dummyStartDate.getUTCHours(),
      dummyStartDate.getUTCMinutes(),
      dummyStartDate.getUTCSeconds(),
      0
    )
    eventTime.setFullYear(
      dummyStartDate.getUTCFullYear(),
      dummyStartDate.getUTCMonth(),
      dummyStartDate.getUTCDate()
    )
  }

  const convertToUTC =
    [
      'crm_association',
      'crm_task',
      'email_campaign',
      'email_campaign_recipient'
    ].includes(event.object_type) === false

  if (!event.recurring) {
    return createDayId(eventTime, convertToUTC)
  }

  if (event.title === "James's Home Anniversary") {
    console.log({
      event,
      eventTimeMonthRaw: eventTime.getMonth(),
      eventTimeMonthUTC: eventTime.getUTCMonth()
    })
    console.log({
      'from.getUTCFullYear() === to.getUTCFullYear()':
        from.getUTCFullYear() === to.getUTCFullYear(),
      'eventTime.getUTCMonth() >= from.getUTCMonth()':
        eventTime.getUTCMonth() >= from.getUTCMonth()
    })
    console.log({
      from,
      ufrom: from.getUTCFullYear(),
      rfrom: from.getFullYear()
    })
    console.log({
      to,
      uto: to.getUTCFullYear(),
      rto: to.getFullYear()
    })
  }

  const year =
    from.getUTCFullYear() === to.getUTCFullYear() &&
    eventTime.getUTCMonth() >= from.getUTCMonth()
      ? from.getUTCFullYear()
      : to.getUTCFullYear()
  const month = isAllDayEvent
    ? eventTime.getMonth() + 1
    : eventTime.getUTCMonth() + 1
  const day = isAllDayEvent ? eventTime.getDate() : eventTime.getUTCDate()

  return `${year}/${month}/${day}`
}
