import { isDealEvent, isCelebrationEvent } from '../event-checker'

interface FullCalendarEventStyle {
  backgroundColor: string
  borderColor: string
  textColor: string
}

const colorGenerator = (
  bg: string,
  bd: string,
  text: string
): FullCalendarEventStyle => {
  return {
    backgroundColor: bg,
    borderColor: bd,
    textColor: text
  }
}
/**
 * return event style for using in full calendar
 * @param event
 */
export const getStyles = (event: ICalendarEvent): FullCalendarEventStyle => {
  const { event_type, all_day, timestamp, end_date } = event
  const startDate = new Date(Number(timestamp || 0) * 1000)
  const endDate = new Date(Number(end_date || 0) * 1000)

  const isDiffrentDay =
    startDate.getDate() < endDate.getDate() ||
    startDate.getMonth() < endDate.getMonth()

  if (isCelebrationEvent(event)) {
    return colorGenerator('#fce6fa', '#fce6fa', '#ff00cc')
  }

  if (isDealEvent(event)) {
    return colorGenerator('#f8f8ff', '#f8f8ff', '#0945eb')
  }

  if (all_day || isDiffrentDay || ['Open House', 'Tour'].includes(event_type)) {
    return colorGenerator('#f2f2f2', '#f2f2f2', '#000')
  }

  return colorGenerator('transparent', 'transparent', '#000')
}
