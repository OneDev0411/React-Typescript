import React from 'react'

import CrmTitle from './CrmTitle'
import styles from '../styles'

interface Props {
  event: ICalendarEvent
  onClickCrmEventAssociations: (event: ICalendarEvent) => void
}

export function EventTitle(props: Props) {
  const { event } = props

  if (event.object_type === 'crm_task') {
    return (
      <CrmTitle
        event={event}
        onClickCrmEventAssociations={props.onClickCrmEventAssociations}
      />
    )
  }

  if (event.object_type === 'contact_attribute') {
    return (
      <div style={styles.title}>
        <a href={`/dashboard/contacts/${event.contact}`} target="_blank">
          {event.full_contact!.display_name}
        </a>
        's {event.event_type}
      </div>
    )
  }

  if (event.object_type === 'deal_context') {
    return (
      <div style={styles.title}>
        {event.type_label} for{' '}
        <a href={`/dashboard/deals/${event.deal}`} target="_blank">
          {event.title}
        </a>
      </div>
    )
  }

  console.warn(`Could not render ${event}`)

  return null
}
