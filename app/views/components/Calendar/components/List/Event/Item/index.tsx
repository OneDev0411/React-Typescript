import React from 'react'

import CrmEvent from './CrmEvent'
import { DealContext } from './DealContext'
import { ContactAttribute } from './ContactAttribute'

interface Props {
  event: ICalendarEvent
  onClickCrmEventAssociations: (event: ICalendarEvent) => void
}

export function EventItem(props: Props) {
  const { event } = props

  if (event.object_type === 'crm_task') {
    return (
      <CrmEvent
        event={event}
        onClickCrmEventAssociations={props.onClickCrmEventAssociations}
      />
    )
  }

  if (event.object_type === 'contact_attribute') {
    return <ContactAttribute event={event} />
  }

  if (event.object_type === 'deal_context') {
    return <DealContext event={event} />
  }

  console.warn(`Could not render ${event}`)

  return null
}
