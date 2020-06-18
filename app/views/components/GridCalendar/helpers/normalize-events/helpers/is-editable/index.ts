/**
 * check event is daragable
 * @param event
 */
export const isEditable = (event: ICalendarEvent): boolean => {
  const { object_type, event_type } = event

  if (
    ['contact', 'deal_context'].includes(object_type) ||
    ['birthday', 'next_touch', 'Open House', 'Tour'].includes(event_type)
  ) {
    return false
  }

  return true
}
