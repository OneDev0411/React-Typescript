import { EventContentArg } from '@fullcalendar/react'
import fecha from 'fecha'

/**
 * return event style for using in full calendar
 * @param event
 * @param fullCalendarEventObject // the event object provided by full calendar
 */
export const getFormatDate = (
  event: ICalendarEvent,
  fullCalendarEventObject?: EventContentArg
): string => {
  const { all_day, recurring, timestamp, end_date } = event
  const startDate = new Date(Number(timestamp || 0) * 1000)
  const endDate = new Date(Number(end_date || 0) * 1000)

  const isDifferentDay =
    startDate.getDate() < endDate.getDate() ||
    startDate.getMonth() < endDate.getMonth()

  // reset start and end time if is a all_dat event since server send us a utc time for all_day events
  if (all_day) {
    const dummyStart = new Date(startDate)
    /*
    We're doing this because for some all-day recurring event which
    its year doesn't set and 1800 is set automatically by server
    and we're going to use the current range of our calendar
    */
    const startYear =
      recurring && fullCalendarEventObject
        ? fullCalendarEventObject.view.currentStart.getUTCFullYear()
        : dummyStart.getUTCFullYear()

    startDate.setHours(
      dummyStart.getUTCHours(),
      dummyStart.getUTCMinutes(),
      dummyStart.getUTCSeconds(),
      0
    )
    startDate.setFullYear(
      startYear,
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
      endDate.setFullYear(
        dummyEnd.getUTCFullYear(),
        dummyEnd.getUTCMonth(),
        dummyEnd.getUTCDate()
      )
    }
  }

  const startFormatter = !all_day ? 'dddd, MMM D, hh:mm A' : 'dddd, MMM D'
  const endFormatter =
    !all_day && isDifferentDay ? 'dddd, MMM D, hh:mm A' : 'hh:mm A'

  const startDateFormat = fecha.format(startDate, startFormatter)
  const endDateFormat = fecha.format(endDate, endFormatter)

  return `${startDateFormat}${
    !all_day && end_date ? ` - ${endDateFormat}` : ''
  }`
}
