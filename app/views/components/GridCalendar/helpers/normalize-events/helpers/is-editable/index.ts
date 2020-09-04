/**
 * check event is daragable
 * @param event
 */
export const isEditable = (event: ICalendarEvent): boolean => {
  const { object_type, event_type } = event

  if (
    ['contact', 'deal_context'].includes(object_type) ||
    [
      'birthday',
      'child_birthday',
      'next_touch',
      'wedding_anniversary',
      'home_anniversary',
      'work_anniversary',
      'Open House',
      'Tour'
    ].includes(event_type)
  ) {
    return false
  }

  return true
}
