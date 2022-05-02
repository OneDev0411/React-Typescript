/**
 * check event is daragable
 * @param event
 */
interface EventEditState {
  editable?: boolean
  eventStartEditable?: boolean
  eventDurationEditable?: boolean
}

export const getEventEditableState = (
  event: ICalendarEvent
): EventEditState => {
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
    return {
      editable: false
    }
  }

  return {
    eventStartEditable: true,
    eventDurationEditable: true
  }
}
