import fecha from 'fecha'

/**
 * returns the rowId of virtual list based on the given date.
 * the function tries to find next available date if the current given
 * date has no events in there (since the calendar only shows the days
 * that have events)
 * @param date - the given date to find its row id
 * @param rows - list of virtual list rows
 * @param eventKeys - list of events (by key)
 * @param calendarRange - the current calendar range
 */
export function getRowIdByDate(
  date: Date,
  rows: ICalendarListRow[],
  calendarRange: [number, number]
) {
  const dayId = format(date)

  if (!isDayInRange(dayId, calendarRange)) {
    return null
  }

  return rows.findIndex(row => {
    return row.hasOwnProperty('is_event_header') && row.date === dayId
  })
}

/**
 * checks given day is in range or not
 * @param day
 * @param highRange
 */
function isDayInRange(day: string, calendarRange: [number, number]): boolean {
  const date = new Date(day)

  const timestamp =
    (date.getTime() + date.getTimezoneOffset() * 60 * 1000) / 1000

  return timestamp > calendarRange[0] && timestamp < calendarRange[1]
}

/**
 * returns formatted style of date
 * @param date
 */
function format(date: Date | number) {
  return fecha.format(new Date(date), 'YYYY/M/D')
}
