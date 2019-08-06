import React from 'react'

import CrmEvent from './CrmEvent'
import { EventIcon } from './EventIcon'

import styles from './styles'

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
    return (
      <div style={styles.container}>
        <EventIcon event={event} />
        <div style={styles.title}>
          <a href={`/dashboard/contacts/${event.contact}`} target="_blank">
            {event.full_contact!.display_name}
          </a>
          's {event.event_type}
        </div>
      </div>
    )
  }

  if (event.object_type === 'deal_context') {
    return (
      <div style={styles.container}>
        <EventIcon event={event} />
        <div style={styles.title}>
          {event.type_label} for{' '}
          <a href={`/dashboard/deals/${event.deal}`} target="_blank">
            {event.title}
          </a>
        </div>
      </div>
    )
  }

  console.warn(`Could not render ${event}`)

  return null
}
