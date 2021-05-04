const SECONDS_IN_HOUR = 60 * 60
const SECONDS_IN_MINUTE = 60

import { TimeRange } from './types'

function getZeroPaddedString(
  value: number | string,
  length: number = 2
): string {
  return value.toString().padStart(length, '0')
}

export function getFormattedTimeOfTheDayBySeconds(seconds: number): string {
  const hours = Math.floor(seconds / SECONDS_IN_HOUR) || 12
  const remainingSeconds = seconds % SECONDS_IN_HOUR
  const minutes = Math.floor(remainingSeconds / SECONDS_IN_MINUTE)

  const amPm = hours >= 12 ? 'PM' : 'AM'

  return `${getZeroPaddedString(
    hours > 12 ? hours % 12 : hours
  )}:${getZeroPaddedString(minutes)} ${amPm}`
}

export function getTimeSlotsInRange(
  start: number,
  end: number,
  duration: number,
  slots: TimeRange[] = []
): TimeRange[] {
  if (start >= end) {
    return slots
  }

  return getTimeSlotsInRange(start + duration, end, duration, [
    ...slots,
    [start, start + duration]
  ])
}

export function isTimeWrappedInSlot(time: number, slot: TimeRange): boolean {
  return time > slot[0] && time <= slot[1]
}
