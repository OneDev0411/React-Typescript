import fecha from 'fecha'

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

  const startFormatter = !all_day ? 'dddd, MMM D, hh:mm A' : 'dddd, MMM D'
  const endFormatter =
    !all_day && isDiffrentDay ? 'dddd, MMM D, hh:mm A' : 'hh:mm A'

  const startDateFormat = fecha.format(startDate, startFormatter)
  const endDateFormat = fecha.format(endDate, endFormatter)

  return `${startDateFormat}${!all_day ? ' - ' : ''}${
    !all_day ? endDateFormat : ''
  }`
}
