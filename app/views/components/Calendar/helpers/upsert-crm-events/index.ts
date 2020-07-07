import { CrmEventType } from 'components/Calendar/types'

import { convertTaskToCalendarEvent } from '../convert-task-to-calendar'

export function upsertCrmEvents(
  events: ICalendarEvent[],
  event: IEvent | ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>,
  type: CrmEventType,
  contact?: IContact
): ICalendarEvent[] {
  const calendarEvent: ICalendarEvent = convertTaskToCalendarEvent(
    event as IEvent
  )

  // delete event from events list when user deletes related assocation of that contact inside contact profile timeline
  if (
    contact &&
    (event.associations || []).some(
      association =>
        association.association_type === 'contact' &&
        (association.contact as IContact).id === contact.id
    ) === false
  ) {
    type = 'deleted'
  }

  if (type === 'created') {
    return events.concat(calendarEvent)
  }

  if (type === 'deleted') {
    return events.filter(item => {
      const id =
        item.object_type === 'crm_association' ? item.crm_task : item.id

      return id !== event.id
    })
  }

  if (type === 'updated') {
    return events.map(item => {
      const id =
        item.object_type === 'crm_association' ? item.crm_task : item.id

      return id == event.id ? calendarEvent : item
    })
  }

  return events
}
