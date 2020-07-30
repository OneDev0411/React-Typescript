import { isNegativeTimezone } from 'utils/is-negative-timezone'

interface FullCalendarEventDate {
  start: string
  end?: string
}

/**
 * return the start and end date of an event
 * @param event
 */
export const getDates = (event: ICalendarEvent): FullCalendarEventDate => {
  const { timestamp, end_date, recurring, all_day } = event
  const current = new Date()
  // Start Date
  const startObject = new Date(Number(timestamp || 0) * 1000)

  if (recurring) {
    startObject.setUTCFullYear(current.getUTCFullYear())
  }

  // End Date
  const endObject = new Date(Number(end_date || 0) * 1000)

  // it's kinda hacky but we had to handle this way because of full-calendar pkg bug
  // TODO: handle it in a better way
  if (all_day && isNegativeTimezone()) {
    startObject.setHours(24)
    endObject.setHours(24)
  }

  // Check end_date is available
  const end = end_date ? { end: endObject.toISOString() } : {}

  return {
    start: startObject.toISOString(),
    ...end
  }
}
