import { addZero } from 'utils/date-times'

interface FullCalendarEventDate {
  start: string
  end?: string
  rrule?: string
}

const RECURRING_FREQUENCY = 'YEARLY'

/**
 * return the start and end date of an event
 * @param event
 */
export const getDates = (event: ICalendarEvent): FullCalendarEventDate => {
  const { timestamp, end_date, recurring, all_day } = event
  // Start Date
  const startObject = new Date(Number(timestamp || 0) * 1000)

  // End Date
  const endObject = new Date(Number(end_date || 0) * 1000)

  // reset start and end time if is a all_dat event since
  // server send us a utc time for all_day events
  if (all_day) {
    const dummyStart = new Date(startObject)

    startObject.setHours(
      dummyStart.getUTCHours(),
      dummyStart.getUTCMinutes(),
      dummyStart.getUTCSeconds(),
      0
    )
    startObject.setFullYear(
      dummyStart.getUTCFullYear(),
      dummyStart.getUTCMonth(),
      dummyStart.getUTCDate()
    )

    if (end_date) {
      const dummyEnd = new Date(endObject)

      endObject.setHours(
        dummyEnd.getUTCHours(),
        dummyEnd.getUTCMinutes(),
        dummyEnd.getUTCSeconds(),
        0
      )
      endObject.setFullYear(
        dummyEnd.getUTCFullYear(),
        dummyEnd.getUTCMonth(),
        dummyEnd.getUTCDate()
      )
    }
  }

  const dates: FullCalendarEventDate = { start: startObject.toISOString() }

  // Check end_date is available
  if (end_date) {
    dates.end = endObject.toISOString()
  }

  // Check event is a recurring event
  if (recurring) {
    const DTSTART = `${startObject.getFullYear()}${addZero(
      startObject.getMonth() + 1
    )}${addZero(startObject.getDate())}T103000Z`

    /*
      the reason we're doing this is we're using a plugin for fullcalendar
      for showing recurring events which accepts this format.
    */
    dates.rrule = `DTSTART:${DTSTART}\nRRULE:FREQ=${RECURRING_FREQUENCY};INTERVAL=1;UNTIL=20400601`
  }

  return dates
}
