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

  return Object.entries(events).flatMap(([month, daysOfMonth]) => {
    if (
      placeholders.includes(Placeholder.Month) &&
      isEmptyMonth(month, daysOfMonth, activeDate)
    ) {
      return [
        {
          isEventHeader: true,
          headerType: 'month-header',
          isToday: false,
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
 * returns month's events
 * @param days
 */
function getMonthEvents(
  days: ICalendarMonthEvents,
  activeDayId: string,
  placeholders: Placeholder[]
): ICalendarListRow[] {
  const today = fecha.format(new Date(), 'YYYY-MM-DD')

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
          title: getDayTitle(new Date(day)),
          date: day
        },
        ...(events.length > 0
          ? events
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
    ? fecha.format(date, 'DD MMMM, YYYY')
    : fecha.format(date, 'DD MMMM')
}

/**
 * returns month title
 * @param date
 * @param daysOfMonth
 */
function getMonthTitle(date: Date, daysOfMonth: ICalendarMonthEvents) {
  const daysRange = `1-${getLastDayOfMonth(daysOfMonth)}`

  return date.getFullYear() !== new Date().getFullYear()
    ? fecha.format(date, `MMMM ${daysRange}, YYYY`)
    : fecha.format(date, `MMMM ${daysRange}`)
}
