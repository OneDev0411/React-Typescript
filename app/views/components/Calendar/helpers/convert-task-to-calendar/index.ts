export function convertTaskToCalendarEvent(event: IEvent): ICalendarEvent {
  const people = getPeople(event.associations)
  const basicMetadata = { is_partner: false, status: '', send_updates: false }

  const metadata = event.metadata
    ? { ...basicMetadata, ...event.metadata }
    : basicMetadata

  return {
    ...event,
    crm_task: event.id,
    campaign: null,
    contact: null,
    created_by: '',
    date: '',
    deal: null,
    metadata,
    next_occurence: '',
    recurring: false,
    status: '',
    thread_key: null,
    timestamp_midday: '',
    timestamp_readable: '',
    type: '',
    // TODO: server must provide end_date as number for calendar events
    end_date: event.end_date ? event.end_date.toString() : null,
    type_label: '',
    users: [],
    event_type: event.task_type,
    timestamp: event.due_date,
    object_type: event.type,
    people,
    people_len: people.length
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
    .filter(association =>
      ['contact', 'agent'].includes(association.association_type)
    )
    .map(association => association.contact as IContact)
}
