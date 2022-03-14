import { differenceInSeconds, startOfDay } from 'date-fns'
import moment from 'moment-timezone'

export function getWeekdayName(date: Date = new Date()): Weekday {
  return date.toLocaleDateString('en-US', {
    weekday: 'long'
  }) as Weekday
}

export function getMonthName(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    month: 'short'
  })
}

export function getDayNumber(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    day: 'numeric'
  })
}

export function getSecondsSinceStartOfDay(date: Date = new Date()): number {
  const startOfThatDay = startOfDay(date)

  return differenceInSeconds(date, startOfThatDay)
}

export function getUTCStartOfCurrentDayTimestamp(): number {
  const now = new Date()

  return Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    0,
    0,
    0,
    0
  )
}

export function fromNow(date: Date): string {
  const event = moment.tz(
    date,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  )

  const fromNow = moment(event).fromNow()

  return moment(event).calendar(null, {
    // when the date is closer, specify custom values
    lastWeek: '[Last] dddd',
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: `[${fromNow}]`,
    // when the date is further away, use from-now functionality
    sameElse() {
      return `[${fromNow}]`
    }
  })
}

export function isToday(date: Date): boolean {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const event = moment.tz(date, userTimeZone)
  const today = moment()

  return event.date() === today.date() && event.month() === today.month()
}

export function convertTimestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000)
}

export function convertDateToTimestamp(date: Date): number {
  return date.getTime() / 1000
}
