import fecha from 'fecha'

import { createDayId } from '../create-day-id'

import eventEmptyState from '../get-event-empty-state'

import { Placeholder } from '../../types'

export function createListRows(
  events: ICalendarEventsList,
  activeDate: Date,
  placeholders: Placeholder[]
): ICalendarListRow[] {
  const activeDayId = createDayId(activeDate, false)

  const distributedEvents = distributeMultiDayEvents(events)

  return Object.entries(distributedEvents).flatMap(([month, daysOfMonth]) => {
    if (
      placeholders.includes(Placeholder.Month) &&
      isEmptyMonth(month, daysOfMonth, activeDate)
    ) {
      return [
        {
          isEventHeader: true,
          headerType: 'month-header',
          isToday: false,
          isTomorrow: false,
          title: getMonthTitle(new Date(month), daysOfMonth),
          date: month
        },
        {
          ...eventEmptyState,
          type: 'month'
        }
      ]
    }

    return getMonthEvents(daysOfMonth, activeDayId, placeholders)
  })
}

/**
 * Duplicates multi day events through all its days.
 * It doesn't mutate the input `events` and creates a new one.
 */
function distributeMultiDayEvents(
  events: ICalendarEventsList
): ICalendarEventsList {
  const distributedEvents: ICalendarEventsList = {}
  let multiDayEvents: ICalendarEvent[] = []

  Object.entries(events).forEach(([month, daysOfMonth]) => {
    distributedEvents[month] = {}
    Object.entries(daysOfMonth).forEach(([day, events]) => {
      const dayStart = new Date(day).getTime()
      const dayEnd = dayStart + 24 * 60 * 60 * 1000

      distributedEvents[month][day] = []
      multiDayEvents = multiDayEvents.filter(
        event => parseFloat(event.end_date!) * 1000 > dayStart
      )
      multiDayEvents.forEach(event => distributedEvents[month][day].push(event))

      events.forEach(event => {
        distributedEvents[month][day].push(event)

        if (parseFloat(event.end_date!) * 1000 > dayEnd) {
          multiDayEvents.push(event)
        }
      })
    })
  })

  return distributedEvents
}

/**
 * returns month's events
 * @param days
 */
function getMonthEvents(
  days: ICalendarMonthEvents,
  activeDayId: string,
  placeholders: Placeholder[]
): ICalendarListRow[] {
  const now = new Date()
  const today = fecha.format(now, 'YYYY-MM-DD')
  const tomorrow = fecha.format(
    new Date(now).setDate(now.getDate() + 1),
    'YYYY-MM-DD'
  )

  return Object.entries(days)
    .filter(([day, events]) => {
      if (events.length > 0) {
        return true
      }

      return (
        placeholders.includes(Placeholder.Day) &&
        (isToday(day) || day === activeDayId)
      )
    })
    .flatMap(([day, events]) => {
      return [
        {
          isEventHeader: true,
          headerType: 'day-header',
          isToday: fecha.format(new Date(day), 'YYYY-MM-DD') === today,
          isTomorrow: fecha.format(new Date(day), 'YYYY-MM-DD') === tomorrow,
          title: getDayTitle(new Date(day)),
          date: day
        },
        ...(events.length > 0
          ? (events as ICalendarEvent[]).map(
              (event: ICalendarEvent, index: number) => ({
                ...event,
                rowIndex: index
              })
            )
          : [
              {
                ...eventEmptyState,
                type: 'day'
              }
            ])
      ]
    })
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
 * returns last day of given month
 * @param days
 */
function getLastDayOfMonth(days: ICalendarMonthEvents): number {
  const daysOfMonth = Object.keys(days)

  return new Date(daysOfMonth[daysOfMonth.length - 1]).getDate()
}

/**
 * checks the given month has any event or not
 * @param month
 * @param days
 * @param activeDate
 */
function isEmptyMonth(
  month: string,
  days: ICalendarMonthEvents,
  activeDate: Date
): boolean {
  const date = new Date(month)

  if (
    activeDate.getFullYear() === date.getFullYear() &&
    activeDate.getMonth() === date.getMonth()
  ) {
    return false
  }

  return Object.values(days).every(events => events.length === 0)
}

/**
 * returns day title
 * @param date
 */
function getDayTitle(date: Date) {
  return date.getFullYear() !== new Date().getFullYear()
    ? fecha.format(date, 'dddd, MMMM Do, YYYY')
    : fecha.format(date, 'dddd, MMMM Do')
}

/**
 * returns month title
 * @param date
 * @param daysOfMonth
 */
function getMonthTitle(date: Date, daysOfMonth: ICalendarMonthEvents) {
  const daysRange = `1 - ${getLastDayOfMonth(daysOfMonth)}`

  return date.getFullYear() !== new Date().getFullYear()
    ? fecha.format(date, `MMMM ${daysRange}, YYYY`)
    : fecha.format(date, `MMMM ${daysRange}`)
}
