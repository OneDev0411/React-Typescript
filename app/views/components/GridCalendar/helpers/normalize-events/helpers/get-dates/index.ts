import { Options } from 'rrule'

interface FullCalendarEventDate {
  start: string
  end?: string
  /*
    I'm doing this because of wrong type in fullcalendar pkg 
    and cause confilict between rrule pkg type
  */
  rrule?: Partial<Omit<Options, 'freq'>> & { freq?: 'string' }
}

const RECURRING_FREQUENCY = 'yearly'

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

  // Check end_date is available
  const end = end_date ? { end: endObject.toISOString() } : {}

  // Check event is a recurring event
  const recurringData = recurring
    ? {
        rrule: {
          freq: RECURRING_FREQUENCY,
          interval: 1,
          dtstart: startObject
        }
      }
    : {}

  // @ts-ignore
  return {
    start: startObject.toISOString(),
    ...end,
    ...recurringData
  }
}
