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

  // reset start and end time if is a all_dat event since server send us a utc time for all_day events
  if (all_day) {
    const dummyStart = new Date(startDate)

    startDate.setHours(
      dummyStart.getUTCHours(),
      dummyStart.getUTCMinutes(),
      dummyStart.getUTCSeconds(),
      0
    )
    startDate.setFullYear(
      dummyStart.getUTCFullYear(),
      dummyStart.getUTCMonth(),
      dummyStart.getUTCDate()
    )

    if (end_date) {
      const dummyEnd = new Date(endDate)

      endDate.setHours(
        dummyEnd.getUTCHours(),
        dummyEnd.getUTCMinutes(),
        dummyEnd.getUTCSeconds(),
        0
      )
      startDate.setFullYear(
        dummyEnd.getUTCFullYear(),
        dummyEnd.getUTCMonth(),
        dummyEnd.getUTCDate()
      )
    }
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
