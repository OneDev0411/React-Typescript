import { isLeapYear } from 'date-fns'
import uniqBy from 'lodash/uniqBy'

import { createDayId } from '../create-day-id'
import { sortEvents } from '../sort-events'

/**
 * returns list of days including their events
 * @param range
 * @param events
 */
export function normalizeEvents(
  events: ICalendarEvent[],
  range: ICalendarRange
) {
  const list = getEvents(range, events)

  return Object.entries(list).reduce((acc, [month, daysOfMonth]) => {
    return {
      [month]: getSortedEvents(daysOfMonth),
      ...acc
    }
  }, {})
}

/**
 * returns all events including empty days
 * @param range
 * @param events
 */
function getEvents(
  range: ICalendarRange,
  events: ICalendarEvent[]
): ICalendarEventsList {
  const uniqEvents = uniqBy(events, event =>
    event.object_type === 'crm_association' ? event.crm_task : event.id
  )

  return uniqEvents.reduce(
    (acc: ICalendarEventsList, event: ICalendarEvent) => {
      const index = getEventIndex(event, range)

      const [year, month, day] = index.split('/')

      /*
      since we're recurring all-day event, here we're skipping the event
      that happened on 29 Feb in a leap year in a non-leap year
    */
      if (
        parseInt(day, 10) === 29 &&
        parseInt(month, 10) === 2 &&
        !isLeapYear(
          new Date(parseInt(year, 10), parseInt(month, 10), parseInt(day, 10))
        )
      ) {
        return acc
      }

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
    },
    {}
  )
}

/**
 * returns sorted list of days events in a month
 * @param daysEvents
 */
function getSortedEvents(events: ICalendarMonthEvents) {
  return Object.entries(events).reduce((acc, [day, events]) => {
    return {
      [day]: sortEvents(events),
      ...acc
    }
  }, {})
}

/**
 * creates a day index for the given event
 * @param event
 * @param range
 */
function getEventIndex(event: ICalendarEvent, range: ICalendarRange) {
  const eventTime = new Date(event.sort_timestamp * 1000)

  console.log('eventTime', eventTime)

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

  const year = eventTime.getFullYear()
  const month = eventTime.getMonth()
  const day = eventTime.getDate()

  console.log('year', year, 'month', month, 'day', day)

  return `${year}/${month + 1}/${day}`
}
