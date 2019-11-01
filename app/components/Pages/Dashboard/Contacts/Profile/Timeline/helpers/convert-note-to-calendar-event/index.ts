export function convertNoteToCalendarEvent(
  note: IContactAttribute,
  contact: IContact
): ICalendarEvent {
  return {
    id: note.id,
    crm_task: note.id,
    title: note.text,
    timestamp: note.created_at,
    object_type: 'crm_association',
    type: 'Note',
    event_type: 'Note',
    people: [contact]
  } as ICalendarEvent
}
