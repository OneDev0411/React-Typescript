import fecha from 'fecha'

export function getRowIdByDate(
  date: Date,
  rows: any[],
  eventKeys: string[],
  calendarRange: [number, number],
  allowSeeking: boolean = true
) {
  let dayId = format(date)

  while (
    allowSeeking &&
    eventKeys.indexOf(dayId) === -1 &&
    isDayInRange(dayId, calendarRange)
  ) {
    const nextDay = date.setDate(date.getDate() + 1)

    // format next day
    dayId = format(nextDay)
  }

  return rows.findIndex(row => row.is_day_header && row.date === dayId)
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
  return fecha.format(new Date(date), 'YYYY-M-D')
}
