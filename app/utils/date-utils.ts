import { differenceInSeconds, startOfDay } from 'date-fns'

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
