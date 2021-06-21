import React from 'react'

import { EmptyState } from './components/EmptyState'

import { CrmTask } from './CrmTask'
import { ContactAttribute } from './ContactAttribute'
import { DealContext } from './DealContext'
import { NextTouch } from './NextTouch'
import { EmailCampaign } from './EmailCampaign'
import { EmailThread } from './EmailThread'

interface Props {
  event: ICalendarEvent
  onEventChange(event: IEvent, type: string): void
}
type EventsType = {
  component({ event, onEventChange }: Props): React.ReactElement<any> | null
  condition(event: ICalendarEvent): boolean
}

const events: EventsType[] = [
  {
    component: EmptyState,
    condition: (event: ICalendarEvent) => event.event_type === 'empty-state'
  },
  {
    component: CrmTask,
    condition: (event: ICalendarEvent) =>
      ['crm_task', 'crm_association'].includes(event.object_type)
  },
  {
    component: ContactAttribute,
    condition: (event: ICalendarEvent) =>
      event.object_type === 'contact_attribute'
  },
  {
    component: DealContext,
    condition: (event: ICalendarEvent) => event.object_type === 'deal_context'
  },
  {
    component: NextTouch,
    condition: (event: ICalendarEvent) =>
      event.object_type === 'contact' && event.event_type === 'next_touch'
  },
  {
    component: EmailCampaign,
    condition: (event: ICalendarEvent) =>
      ['email_campaign', 'email_campaign_recipient'].includes(
        event.object_type
      ) && ['scheduled_email', 'executed_email'].includes(event.event_type)
  },
  {
    component: EmailThread,
    condition: (event: ICalendarEvent) =>
      event.object_type === 'email_thread_recipient'
  }
]

/**
 * renders the given calendar event
 */
export function Event({ event, onEventChange }: Props) {
  const eventItem = events.find(item => item.condition(event) === true)

  if (!eventItem) {
    return null
  }

  return <eventItem.component event={event} onEventChange={onEventChange} />
}
