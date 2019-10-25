export function convertTaskToCalendarEvent(event: IEvent): ICalendarEvent {
  const people = getPeople(event.associations)

  return {
    ...event,
    campaign: null,
    contact: null,
    created_by: '',
    date: '',
    deal: null,
    full_thread: null,
    metadata: { is_partner: false, status: '' },
    next_occurence: '',
    recurring: false,
    status: '',
    thread_key: null,
    timestamp_midday: '',
    timestamp_readable: '',
    type: '',
    type_label: '',
    users: [],
    event_type: event.task_type,
    timestamp: event.due_date,
    object_type: event.type,
    people,
    people_len: people.length,
    full_crm_task: {
      end_date: event.end_date,
      assignees: event.assignees,
      associations: event.associations
    }
  }
}

/**
 * converts contacts of associations to people object
 * @param associations
 */
function getPeople(associations: IEvent['associations']): IContact[] {
  if (!associations) {
    return []
  }

  return associations
    .filter(association => association.association_type === 'contact')
    .map(association => association.contact as IContact)
}
