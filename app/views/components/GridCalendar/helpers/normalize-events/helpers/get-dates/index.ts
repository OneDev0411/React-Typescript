interface FullCalendarEventDate {
  start: string
  end?: string
}

/**
 * return the start and end date of an event
 * @param event
 */
export const getDates = (event: ICalendarEvent): FullCalendarEventDate => {
  const { timestamp, end_date, recurring } = event
  const current = new Date()
  // Start Date
  const startObject = new Date(Number(timestamp || 0) * 1000)

  if (recurring) {
    startObject.setUTCFullYear(current.getUTCFullYear())
  }

  // End Date
  const endObject = new Date(Number(end_date || 0) * 1000)
  const end = end_date ? { end: endObject.toISOString() } : {}

  return {
    start: startObject.toISOString(),
    ...end
  }
}
