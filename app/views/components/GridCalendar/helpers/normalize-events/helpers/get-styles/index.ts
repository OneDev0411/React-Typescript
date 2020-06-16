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
  const { object_type, event_type, all_day, timestamp, end_date } = event
  const startDate = new Date(Number(timestamp || 0) * 1000)
  const endDate = new Date(Number(end_date || 0) * 1000)

  const isDiffrentDay =
    startDate.getDate() < endDate.getDate() ||
    startDate.getMonth() < endDate.getMonth()

  if (
    [
      'birthday',
      'child_birthday',
      'wedding_anniversary',
      'work_anniversary',
      'home_anniversary'
    ].includes(event_type)
  ) {
    return colorGenerator('#fce6fa', '#fce6fa', '#ff00cc')
  }

  if (
    object_type === 'deal_context' &&
    [
      'list_date',
      'expiration_date',
      'contract_date',
      'inspection_date',
      'option_period',
      'financing_due',
      'title_due',
      't47_due',
      'closing_date',
      'possession_date',
      'lease_executed',
      'lease_application_date',
      'lease_begin',
      'lease_end'
    ].includes(event_type)
  ) {
    return colorGenerator('#f8f8ff', '#f8f8ff', '#0945eb')
  }

  if (all_day || isDiffrentDay || ['Open House', 'Tour'].includes(event_type)) {
    return colorGenerator('#f2f2f2', '#f2f2f2', '#000')
  }

  return colorGenerator('transparent', 'transparent', '#000')
}
