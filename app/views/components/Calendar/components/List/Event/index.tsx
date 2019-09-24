import React from 'react'

import { EmptyState } from './EmptyState'

import { CrmTask } from './CrmTask'
import { ContactAttribute } from './ContactAttribute'
import { DealContext } from './DealContext'
import { NextTouch } from './NextTouch'
import { EmailCampaign } from './EmailCampaign'

import emptyStateEvent from '../../../helpers/get-event-empty-state'

interface Props {
  style: React.CSSProperties
  event: ICalendarEvent
  nextItem: ICalendarListRow
}

const events: {
  component: any
  condition(event: ICalendarEvent): boolean
}[] = [
  {
    component: EmptyState,
    condition: (event: ICalendarEvent) =>
      event.event_type === emptyStateEvent.event_type
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
      ) && event.event_type === 'scheduled_email'
  }
]

/**
 * renders the given calendar event
 */
export function Event({ event, nextItem, style }: Props) {
  const sharedProps = {
    style,
    event,
    nextItem
  }

  const item = events.find(item => item.condition(event) === true)

  if (item) {
    return <item.component {...sharedProps} />
  }

  return null
}
