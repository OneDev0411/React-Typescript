import React, { useContext } from 'react'

import { ListContext } from '../../context'

import CrmTitle from './CrmTitle'
import styles from '../styles'

interface Props {
  event: ICalendarEvent
}

export function EventTitle({ event }: Props) {
  const { setSelectedEvent } = useContext(ListContext)

  if (event.object_type === 'crm_task') {
    return <CrmTitle event={event} />
  }

  if (event.object_type === 'contact_attribute') {
    return (
      <div style={styles.title}>
        <a href={`/dashboard/contacts/${event.contact}`} target="_blank">
          {event.full_contact!.display_name}
        </a>
        's {event.type_label}
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

  if (event.object_type === 'contact' && event.event_type === 'next_touch') {
    return (
      <div style={styles.title}>
        Contact{' '}
        <a href={`/dashboard/contacts/${event.contact}`} target="_blank">
          {event.full_contact!.display_name}
        </a>
      </div>
    )
  }

  if (
    event.object_type === 'email_campaign' &&
    event.event_type === 'scheduled_email'
  ) {
    return (
      <div style={styles.title}>
        <a
          style={styles.link}
          onClick={e => {
            e.preventDefault()
            setSelectedEvent(event)
          }}
        >
          {event.title}
        </a>
      </div>
    )
  }

  console.warn(`Could not render ${event}`)

  return null
}
