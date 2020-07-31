import fecha from 'fecha'

import { isNegativeTimezone } from 'utils/is-negative-timezone'

/**
 * return event style for using in full calendar
 * @param event
 */
export const getFormatDate = (event: ICalendarEvent): string => {
  const { all_day, timestamp, end_date } = event
  const startDate = new Date(Number(timestamp || 0) * 1000)
  const endDate = new Date(Number(end_date || 0) * 1000)

  const isDiffrentDay =
    startDate.getDate() < endDate.getDate() ||
    startDate.getMonth() < endDate.getMonth()

  if (all_day && isNegativeTimezone()) {
    startDate.setHours(24)
    endDate.setHours(24)
  }

  const startFormatter = !all_day ? 'dddd, MMM D, hh:mm A' : 'dddd, MMM D'
  const endFormatter =
    !all_day && isDiffrentDay ? 'dddd, MMM D, hh:mm A' : 'hh:mm A'

  const startDateFormat = fecha.format(startDate, startFormatter)
  const endDateFormat = fecha.format(endDate, endFormatter)

  return `${startDateFormat}${!all_day ? ' - ' : ''}${
    !all_day ? endDateFormat : ''
  }`
}
