export function convertTaskToCalendarEvent(event: IEvent): ICalendarEvent {
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
    full_contact: event.contact,
    full_crm_task: {
      end_date: event.end_date,
      assignees: event.assignees,
      associations: event.associations
    }
  }
}
