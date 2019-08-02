export function convertTaskToCalendarEvent(event: IEvent) {
  return {
    ...event,
    event_type: event.task_type,
    timestamp: event.due_date,
    object_type: event.type,
    full_contact: event.contact,
    full_crm_task: {
      associations: event.associations
    }
  }
}
